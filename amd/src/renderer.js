// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny AI utils library.
 *
 * @module      tiny_ai/renderer
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import AiModal from './modal';
import {SELECTORS} from 'tiny_ai/selectors';
import {makeRequest} from 'local_ai_manager/make_request';
import {getPurposeConfig} from 'local_ai_manager/config';
import ModalEvents from 'core/modal_events';
import {getDraftItemId} from 'editor_tiny/options';
import {getStrings} from 'core/str';
import {prefetchStrings} from 'core/prefetch';
import {alert, exception as displayException} from 'core/notification';
import {renderInfoBox} from 'local_ai_manager/render_infobox';
import {getContextId} from 'editor_tiny/options';
import {getUserId} from 'tiny_ai/options';
import {renderUserQuota} from 'local_ai_manager/userquota';
import {call as fetchMany} from 'core/ajax';
import {selectionbarSource, toolbarSource, menubarSource} from 'tiny_ai/common';
import Log from 'core/log';
import Templates from 'core/templates';
import DataManager from 'tiny_ai/datamanager';
import {constants} from 'tiny_ai/constants';
import {getAiConfig} from 'local_ai_manager/config';
import SummarizeHandler from 'tiny_ai/datahandler/summarize';
import TranslateHandler from 'tiny_ai/datahandler/translate';


const stringKeys = [
    'back',
    'generate',
    'hideprompt',
    'mainselection_heading',
    'showprompt',
    'toolname_audiogen',
    'toolname_describe',
    'toolname_describe_extension',
    'toolname_imggen',
    'toolname_summarize',
    'toolname_summarize_extension',
    'toolname_translate',
    'toolname_translate_extension',
    'toolname_tts',
    'toolname_tts_extension',
];
let aiConfig = null;

prefetchStrings('tiny_ai', stringKeys);
let strings = {};
let modal = null;
let userId = null;

export const init = async (existingModal, userIdFromEditor) => {
    modal = existingModal;
    aiConfig = await getAiConfig();
    const stringRequest = stringKeys.map(key => {
        return {key, component: 'tiny_ai'}
    });
    [
        strings.back,
        strings.generate,
        strings.hideprompt,
        strings.mainselection_heading,
        strings.showprompt,
        strings.toolname_audiogen,
        strings.toolname_describe,
        strings.toolname_describe_extension,
        strings.toolname_imggen,
        strings.toolname_summarize,
        strings.toolname_summarize_extension,
        strings.toolname_translate,
        strings.toolname_translate_extension,
        strings.toolname_tts,
        strings.toolname_tts_extension,
    ] = await getStrings(stringRequest);
};

const getBackAndGenerateButtonContext = () => {
    return {
        footer_buttons: [
            {
                hasText: true,
                button_text: strings.back,
                icon_left: true,
                icon_right: false,
                primary: false,
                secondary: false,
                tertiary: true,
                iconname: 'arrow-left',
                iconstyle: 'solid',
                action: 'back'
            },
            {
                hasText: true,
                button_text: strings.generate,
                icon_left: true,
                icon_right: false,
                primary: true,
                secondary: false,
                tertiary: false,
                iconname: 'sparkle',
                customicon: true,
                action: 'generate'
            }
        ]
    };
}

const getReplaceButtonsContext = () => {
    return {
        footer_iconbuttons:
            [
                {
                    action: 'delete',
                    iconName: 'trash'
                },
                {
                    action: 'regenerate',
                    iconName: 'arrows-rotate'
                }
            ],
        footer_buttons:
            [
                {
                    action: 'insert',
                    hasText: true,
                    button_text: "UNTEN EINFUEGEN",
                    icon_left: true,
                    icon_right: false,
                    secondary: true,
                    iconname: 'text-insert-last',
                    customicon: true
                },
                {
                    action: 'replace',
                    hasText: true,
                    button_text: "AUSWAHL ERSETZEN",
                    icon_left: true,
                    icon_right: false,
                    primary: true,
                    iconname: 'check',
                    iconstyle: 'solid'
                }
            ],
    };
};

const getInputContext = () => {
    return {
        input: [
            {
                iconname: 'sparkle',
                customicon: true,
                button: [
                    {
                        customicon: false,
                        iconname: 'arrow-right',
                        iconstyle: 'solid',
                        icon_left: false,
                        icon_right: true
                    }
                ]
            }
        ],
    }
}

const getShowPromptButtonContext = () => {
    return {
        hasText: true,
        button_text: strings.showprompt,
        icon_left: true,
        icon_right: false,
        tertiary: true,
        iconname: 'eye',
        iconstyle: 'solid',
        action: 'showprompt',
        textareatype: 'prompt',
        collapsed: true
    }
};

export const getTemplateContextStart = async (mode) => {

    const getPurposeConfig = (tool) => {
        const toolPurpose = constants.toolPurposeMapping[tool];
        return aiConfig.purposes.filter(purpose => purpose['purpose'] === toolPurpose)[0];
    }

    // TODO Test if this logic is correct
    const isToolDisabled = (tool) => {
        if (!aiConfig.tenantenabled && aiConfig.role !== 'role_basic') {
            return true;
        }
        if (aiConfig.userlocked) {
            return true;
        }
        const purposeInfo = getPurposeConfig(tool);
        if (!purposeInfo.isconfigured && aiConfig.role !== 'role_basic') {
            return true;
        }
        if (purposeInfo.limitreached) {
            return true;
        }
        return false;
    }

    // TODO Test if this logic is correct
    const isToolHidden = (tool) => {
        if (aiConfig.role !== 'role_basic') {
            return false;
        }
        if (!aiConfig.tenantenabled) {
            return true;
        }
        const purposeInfo = getPurposeConfig(tool);
        if (!purposeInfo.isconfigured) {
            return true;
        }
        if (purposeInfo.limitreached) {
            return true;
        }
        return false;
    }

    let toolButtons = [];
    switch (mode) {
        case 'selection':
            toolButtons.push({
                tool: strings.toolname_summarize,
                description: strings.toolname_summarize_extension,
                customicon: true,
                iconname: 'shorten',
                disabled: isToolDisabled('summarize'),
                action: 'loadsummarize'
            });
            toolButtons.push({
                tool: strings.toolname_translate,
                description: strings.toolname_translate_extension,
                iconname: 'language',
                iconstyle: 'solid',
                disabled: isToolDisabled('translate'),
                action: 'loadtranslate'
            });
            toolButtons.push({
                tool: strings.toolname_describe,
                description: strings.toolname_describe_extension,
                customicon: true,
                iconname: 'extend',
                disabled: isToolDisabled('describe'),
                action: 'loaddescribe'
            });
            toolButtons.push({
                tool: strings.toolname_tts,
                description: strings.toolname_tts_extension,
                iconstyle: 'solid',
                iconname: 'microphone',
                disabled: isToolDisabled('tts'),
                action: 'loadtts'
            });
            break;
        case 'general':
            toolButtons.push({
                tool: strings.toolname_audiogen,
                iconstyle: 'solid',
                iconname: 'microphone',
                disabled: isToolDisabled('tts'),
                action: 'loadtts'
            });
            toolButtons.push({
                tool: strings.toolname_imggen,
                iconstyle: 'solid',
                iconname: 'image',
                disabled: isToolDisabled('imggen'),
                action: 'loadimggen'
            });
    }
    toolButtons = toolButtons.filter(buttonContext => !isToolHidden(buttonContext.tool));

    const templateContext = {
        showIcon: true,
        modal_headline: strings.mainselection_heading,
        modal_buttons: toolButtons,
    };
    Object.assign(templateContext, getInputContext());
    return templateContext;
}


export const getTemplateContextSummarize = async (extendPrompt) => {
    const context = {
        modal_headline: "Zusammenfassen des markierten Textes",
        showIcon: true,
        tool: 'summarize'
    };
    Object.assign(context, getShowPromptButtonContext());
    Object.assign(context, getBackAndGenerateButtonContext());

    const maxWordCountDropdownContext = {};
    maxWordCountDropdownContext.preference = 'maxWordCount';
    maxWordCountDropdownContext.dropdown_default = Object.values(SummarizeHandler.maxWordCountOptions)[0];
    maxWordCountDropdownContext.dropdown_default_value = Object.keys(SummarizeHandler.maxWordCountOptions)[0];
    maxWordCountDropdownContext.dropdown_description = 'MAXIMALE WORTANZAHL';
    const maxWordCountDropdownOptions = [];
    for (const [key, value] of Object.entries(SummarizeHandler.maxWordCountOptions)) {
        maxWordCountDropdownOptions.push({
            optionValue: key,
            optionLabel: value,
        })
    }
    delete maxWordCountDropdownOptions[Object.keys(SummarizeHandler.languageTypeOptions)[0]]
    maxWordCountDropdownContext.dropdown_options = maxWordCountDropdownOptions;

    const languageTypeDropdownContext = {};
    languageTypeDropdownContext.preference = 'languageType';
    languageTypeDropdownContext.dropdown_default = Object.values(SummarizeHandler.languageTypeOptions)[0];
    languageTypeDropdownContext.dropdown_default_value = Object.keys(SummarizeHandler.languageTypeOptions)[0];
    languageTypeDropdownContext.dropdown_description = 'ART DER SPRACHE';
    const languageTypeDropdownOptions = [];
    for (const [key, value] of Object.entries(SummarizeHandler.languageTypeOptions)) {
        languageTypeDropdownOptions.push({
            optionValue: key,
            optionLabel: value,
        })
    }
    delete languageTypeDropdownOptions[Object.keys(SummarizeHandler.languageTypeOptions)[0]];
    languageTypeDropdownContext.dropdown_options = languageTypeDropdownOptions;


    Object.assign(context, {
        modal_dropdowns: [
            maxWordCountDropdownContext,
            languageTypeDropdownContext,
        ]
    });

    return context;
}

export const getTemplateContextTranslate = async () => {
    const context = {
        modal_headline: 'Übersetzen des markierten Textes',
        showIcon: true,
        tool: 'translate'
    };
    const targetLanguageDropdownContext = {};
    targetLanguageDropdownContext.preference = 'targetLanguage';
    targetLanguageDropdownContext.dropdown_default = Object.values(TranslateHandler.targetLanguageOptions)[0];
    targetLanguageDropdownContext.dropdown_default_value = Object.keys(TranslateHandler.targetLanguageOptions)[0];
    targetLanguageDropdownContext.dropdown_description = 'ZIELSPRACHE';
    const targetLanguageDropdownOptions = [];
    for (const [key, value] of Object.entries(TranslateHandler.targetLanguageOptions)) {
        targetLanguageDropdownOptions.push({
            optionValue: key,
            optionLabel: value,
        })
    }
    targetLanguageDropdownContext.dropdown_options = targetLanguageDropdownOptions;

    Object.assign(context, {
        modal_dropdowns: [
            targetLanguageDropdownContext,
        ]
    });
    Object.assign(context, getShowPromptButtonContext());
    Object.assign(context, getBackAndGenerateButtonContext());
    return context;
}

export const getTemplateContextDescribe = async () => {
    const context = getTemplateContextSummarize();
    context.tool = 'describe';
    context.modal_headline = "AUSFÜHRLICHE BESCHREIBUNG DES MARKIERTEN TEXTES";
    return context;
}

export const getTemplateContextTts = async () => {
    return {};
}

export const getTemplateContextAudiogen = async () => {
    return {};
}

export const getTemplateContextImggen = async () => {
    const context = {
        modal_headline: "BILDGENERIERUNG",
        showIcon: true,
        tool: 'imggen',
        modal_dropdowns: [
            {
                dropdown_description: "AUFLOESUNG",
                dropdown_default: "Keine Auswahl",
                dropdown_options: [
                    {
                        optionLabel: "Test 1",
                        optionValue: "1"
                    },
                    {
                        optionLabel: "Test 2",
                        optionValue: "2"
                    },
                    {
                        optionLabel: "Test 3",
                        optionValue: "3"
                    },
                    {
                        optionLabel: "Test 4",
                        optionValue: "4"
                    }
                ]
            },
        ],
        placeholder: "BESCHREIBUNG DES BILDS EINGEBEN",
    };
    Object.assign(context, getBackAndGenerateButtonContext())
    return context;
}

export const getTemplateContextOptimizePrompt = () => {
    const context = {
        modal_headline: "LETZTEN PROMPT UEBERARBEITEN",
        showIcon: true,
        textareatype: 'prompt'
    }
    Object.assign(context, getBackAndGenerateButtonContext());
    return context;

};

export const renderStart = async (mode) => {
    const templateContext = await getTemplateContextStart(mode);
    await renderModalContent('moodle-modal-body-start', 'moodle-modal-footer-info', templateContext);
}

export const renderSummarize = async () => {
    const templateContext = await getTemplateContextSummarize();
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
}

export const renderTranslate = async () => {
    const templateContext = await getTemplateContextTranslate();
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
}

export const renderDescribe = async () => {
    const templateContext = await getTemplateContextDescribe();
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
}

export const renderTts = async () => {
    const templateContext = await getTemplateContextTts();
    await renderModalContent('moodle-modal-body-audio', 'moodle-modal-footer-generate', templateContext);
}

export const renderAudiogen = async () => {
    const templateContext = await getTemplateContextAudiogen();
    await renderModalContent('moodle-modal-body-audio', 'moodle-modal-footer-generate', templateContext);
}

export const renderImggen = async () => {
    const templateContext = await getTemplateContextImggen();
    await renderModalContent('moodle-modal-body-imggen', 'moodle-modal-footer-generate', templateContext);
}

export const renderLoading = async () => {
    const templateContext = {};
    templateContext.modal_headline = "KI GENERIERT";
    await renderModalContent('moodle-modal-body-loading', 'moodle-modal-footer-empty', templateContext);
}

export const renderSuggestion = async () => {
    const templateContext = {};
    templateContext.modal_headline = "KI-VORSCHLAG";
    templateContext.result_text = DataManager.getCurrentAiResult();
    Object.assign(templateContext, getReplaceButtonsContext());
    await renderModalContent('moodle-modal-body-suggestion', 'moodle-modal-footer-replace', templateContext);
}

export const renderOptimizePrompt = async () => {
    const templateContext = getTemplateContextOptimizePrompt();
    await renderModalContent('moodle-modal-body-optimize', 'moodle-modal-footer-generate', templateContext);
}

/**
 * Re-renders the content auf the modal once it has been created.
 *
 * @param bodyComponentTemplate the name of the body template to use (without the prefix 'tiny_ai/components/')
 * @param footerComponentTemplate the name of the footer template to use (without the prefix 'tiny_ai/components/')
 * @param templateContext the template context being used for all partial templates
 * @returns {Promise<void>} the async promise
 */
export const renderModalContent = async (bodyComponentTemplate, footerComponentTemplate, templateContext) => {
    const result = await Promise.all([
        Templates.renderForPromise('tiny_ai/components/moodle-modal-header-title', templateContext),
        Templates.renderForPromise('tiny_ai/components/' + bodyComponentTemplate, templateContext),
        Templates.renderForPromise('tiny_ai/components/' + footerComponentTemplate, templateContext)
    ]);
    if (templateContext.hasOwnProperty('modal_headline')) {
        // If there is no headline specified, we keep the old one.
        modal.setTitle(result[0].html);
    }
    modal.setBody(result[1].html);
    modal.setFooter(result[2].html);
    result.forEach((item) => {
        Templates.runTemplateJS(item.js);
    })
    await insertInfoBox();
    await insertUserQuotaBox();
};

export const insertInfoBox = async () => {
    // TODO extract used purposes
    const infoBoxSelector = '[data-rendertarget="infobox"]';
    if (document.querySelector(infoBoxSelector)) {
        await renderInfoBox('tiny_ai', userId, infoBoxSelector, ['singleprompt', 'tts', 'imggen']);
    }
};

export const insertUserQuotaBox = async () => {
    const usageBoxSelector = '[data-rendertarget="usageinfo"]';
    if (document.querySelector(usageBoxSelector)) {
        await renderUserQuota(usageBoxSelector, ['singleprompt', 'tts', 'imggen']);
    }
};
