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

import {renderInfoBox} from 'local_ai_manager/infobox';
import {renderUserQuota} from 'local_ai_manager/userquota';
import * as BasedataHandler from 'tiny_ai/datahandler/basedata';
import Templates from 'core/templates';
import DataManager from 'tiny_ai/datamanager';
import SummarizeHandler from 'tiny_ai/datahandler/summarize';
import TranslateHandler from 'tiny_ai/datahandler/translate';
import TtsHandler from 'tiny_ai/datahandler/tts';
import ImggenHandler from 'tiny_ai/datahandler/imggen';
import StartHandler from 'tiny_ai/datahandler/start';
import OptimizeHandler from './datahandler/optimize';
import $ from 'jquery';


let modal = null;
let userId = null;

export const init = async (existingModal) => {
    modal = existingModal;
    await BasedataHandler.init();
    await StartHandler.init();
};

export const renderStart = async () => {
    DataManager.reset();
    const templateContext = await StartHandler.getTemplateContext();
    await renderModalContent('moodle-modal-body-start', 'moodle-modal-footer-info', templateContext);
};

export const renderSummarize = async () => {
    const templateContext = SummarizeHandler.getTemplateContext('summarize');
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
};

export const renderTranslate = async () => {
    const templateContext = TranslateHandler.getTemplateContext();
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
};

export const renderDescribe = async () => {
    const templateContext = SummarizeHandler.getTemplateContext('describe');
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
};

export const renderTts = async () => {
    const templateContext = await TtsHandler.getTemplateContext('tts');
    await renderModalContent('moodle-modal-body-preferences', 'moodle-modal-footer-generate', templateContext);
};

export const renderAudiogen = async () => {
    const templateContext = await TtsHandler.getTemplateContext('audiogen');
    await renderModalContent('moodle-modal-body-mediageneration', 'moodle-modal-footer-generate', templateContext);
};

export const renderImggen = async () => {
    const templateContext = await ImggenHandler.getTemplateContext();
    await renderModalContent('moodle-modal-body-mediageneration', 'moodle-modal-footer-generate', templateContext);
};

export const renderLoading = async () => {
    const templateContext = {};
    templateContext.modal_headline = BasedataHandler.getTinyAiString('aigenerating');
    await renderModalContent('moodle-modal-body-loading', 'moodle-modal-footer-empty', templateContext);
};

export const renderSuggestion = async () => {
    const templateContext = {};
    templateContext.modal_headline = BasedataHandler.getTinyAiString('aisuggestion');
    // TODO Eventually do not use the same rendering in the suggestion like in the course, or just leave it because we
    //  consider it beautiful
    templateContext.result_text = renderAiResultForEditor();

    Object.assign(templateContext, BasedataHandler.getReplaceButtonsContext());
    await renderModalContent('moodle-modal-body-suggestion', 'moodle-modal-footer-replace', templateContext);
};

export const renderOptimizePrompt = async () => {
    const templateContext = OptimizeHandler.getTemplateContext();
    await renderModalContent('moodle-modal-body-optimize', 'moodle-modal-footer-generate', templateContext);
};

export const renderDismiss = async() => {
    const templateContext = {
        modal_headline: '',
        centered_headline: BasedataHandler.getTinyAiString('dismisssuggestion'),
        showIcon: false,
        buttons: [
            {
                hasText: true,
                button_text: BasedataHandler.getTinyAiString('cancel'),
                icon_left: false,
                icon_right: false,
                primary: false,
                secondary: true,
                tertiary: false,
                action: 'canceldismiss'
            },
            {
                hasText: true,
                button_text: BasedataHandler.getTinyAiString('dismiss'),
                icon_left: false,
                icon_right: false,
                primary: true,
                secondary: false,
                tertiary: false,
                action: 'dismiss'
            }
        ]
    };
    await renderModalContent('moodle-modal-body-dismiss', 'moodle-modal-footer-empty', templateContext);
};

export const renderAiResultForEditor = () => {
    let html;
    switch (DataManager.getCurrentTool()) {
        case 'tts':
        case 'audiogen': {
            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = 'controls';
            audioPlayer.src = DataManager.getCurrentAiResult();
            audioPlayer.type = 'audio/mpeg';
            html = audioPlayer.outerHTML;
            break;
        }
        case 'imggen': {
            const img = document.createElement('img');
            img.src = DataManager.getCurrentAiResult();
            img.classList.add('mw-100');
            html = img.outerHTML;
            break;
        }
        default: {
            html = DataManager.getCurrentAiResult();
        }
    }
    return html;
};

/**
 * Re-renders the content auf the modal once it has been created.
 *
 * @param {string} bodyComponentTemplate the name of the body template to use (without the prefix 'tiny_ai/components/')
 * @param {string} footerComponentTemplate the name of the footer template to use (without the prefix 'tiny_ai/components/')
 * @param {string} templateContext the template context being used for all partial templates
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
    // Hide all eventually still existing tooltips first, because they show on 'hover' and
    // 'focus'. So we need to remove them before removing the corresponding buttons from the DOM.
    // Boostrap 4 still using jQuery for tooltips, so we need jQuery here.
    document.querySelectorAll('button[data-action]').forEach(button => {
        $(button).tooltip('hide');
    });
    modal.setBody(result[1].html);
    modal.setFooter(result[2].html);
    result.forEach((item) => {
        Templates.runTemplateJS(item.js);
    });
    await insertInfoBox();
    await insertUserQuotaBox();
    document.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', event => {
            $(event.target).closest('button[data-action]').tooltip('hide');
        });
    });
};

export const insertInfoBox = async () => {
    const infoBoxSelector = '[data-rendertarget="infobox"]';
    if (document.querySelector(infoBoxSelector)) {
        await renderInfoBox('tiny_ai', userId, infoBoxSelector, ['singleprompt', 'translate', 'tts', 'imggen']);
    }
};

export const insertUserQuotaBox = async () => {
    const usageBoxSelector = '[data-rendertarget="usageinfo"]';
    if (document.querySelector(usageBoxSelector)) {
        await renderUserQuota(usageBoxSelector, ['singleprompt', 'translate', 'tts', 'imggen']);
    }
};
