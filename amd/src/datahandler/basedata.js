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

import {getStrings} from 'core/str';
import {prefetchStrings} from 'core/prefetch';
import {getMode} from 'tiny_ai/utils';
import {constants} from 'tiny_ai/constants';

/**
 * Tiny AI base data provider.
 *
 * @module      tiny_ai/datahandler/basedata
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const stringKeys = [
    'aigenerating',
    'aisuggestion',
    'audiogen_headline',
    'audiogen_placeholder',
    'back',
    'backbutton_tooltip',
    'cancel',
    'deletebutton_tooltip',
    'describe_baseprompt',
    'describe_headline',
    'dismiss',
    'dismisssuggestion',
    'error_nopromptgiven',
    'freeprompt_placeholder',
    'freepromptbutton_tooltip',
    'gender',
    'generalerror',
    'generate',
    'generatebutton_tooltip',
    'hideprompt',
    'imggen_headline',
    'imggen_placeholder',
    'insertatcaret',
    'insertatcaretbutton_tooltip',
    'insertbelow',
    'insertbelowbutton_tooltip',
    'keeplanguagetype',
    'languagetype',
    'languagetype_prompt',
    'mainselection_heading',
    'maxwordcount',
    'maxwordcount_prompt',
    'nomaxwordcount',
    'regeneratebutton_tooltip',
    'replaceselection',
    'replaceselectionbutton_tooltip',
    'reworkprompt',
    'simplelanguage',
    'size',
    'showprompt',
    'showpromptbutton_tooltip',
    'summarize_baseprompt',
    'summarize_headline',
    'targetlanguage',
    'technicallanguage',
    'texttouse',
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
    'translate_baseprompt',
    'translate_headline',
    'tts_headline',
    'voice'
];

let strings = {};



export const init = async() => {
    prefetchStrings('tiny_ai', stringKeys);
    const stringRequest = stringKeys.map(key => {
        return {key, component: 'tiny_ai'}
    });
    // We now get the strings. They are already prefetched, so this is not a performance feature.
    // We just use this to avoid having to code asynchronously all the time just for retrieving the
    // strings by using getString which returns a promise.
    [
        strings.aigenerating,
        strings.aisuggestion,
        strings.audiogen_headline,
        strings.audiogen_placeholder,
        strings.back,
        strings.backbutton_tooltip,
        strings.cancel,
        strings.deletebutton_tooltip,
        strings.describe_baseprompt,
        strings.describe_headline,
        strings.dismiss,
        strings.dismisssuggestion,
        strings.error_nopromptgiven,
        strings.freeprompt_placeholder,
        strings.freepromptbutton_tooltip,
        strings.gender,
        strings.generalerror,
        strings.generate,
        strings.generatebutton_tooltip,
        strings.hideprompt,
        strings.imggen_headline,
        strings.imggen_placeholder,
        strings.insertatcaret,
        strings.insertatcaretbutton_tooltip,
        strings.insertbelow,
        strings.insertbelowbutton_tooltip,
        strings.keeplanguagetype,
        strings.languagetype,
        strings.languagetype_prompt,
        strings.mainselection_heading,
        strings.maxwordcount,
        strings.maxwordcount_prompt,
        strings.nomaxwordcount,
        strings.regeneratebutton_tooltip,
        strings.replaceselection,
        strings.replaceselectionbutton_tooltip,
        strings.reworkprompt,
        strings.simplelanguage,
        strings.size,
        strings.showprompt,
        strings.showpromptbutton_tooltip,
        strings.summarize_baseprompt,
        strings.summarize_headline,
        strings.targetlanguage,
        strings.technicallanguage,
        strings.texttouse,
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
        strings.translate_baseprompt,
        strings.translate_headline,
        strings.tts_headline,
        strings.voice
    ] = await getStrings(stringRequest);
}

export const getTinyAiString = (string) => {
    return strings[string];
}

export const getBackAndGenerateButtonContext = () => {
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
                action: 'back',
                tooltip: strings.backbutton_tooltip
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
                action: 'generate',
                tooltip: strings.generatebutton_tooltip
            }
        ]
    };
}

export const getReplaceButtonsContext = () => {

    return  {
        footer_iconbuttons:
            [
                {
                    action: 'delete',
                    iconname: 'trash',
                    tooltip: strings.deletebutton_tooltip
                },
                {
                    action: 'regenerate',
                    iconname: 'arrows-rotate',
                    tooltip: strings.regeneratebutton_tooltip
                }
            ],
        footer_buttons:
            [
                {
                    action: 'insertbelow',
                    hasText: true,
                    button_text: strings.insertbelow,
                    icon_left: true,
                    icon_right: false,
                    secondary: true,
                    iconname: 'text-insert-last',
                    customicon: true,
                    tooltip: strings.insertbelow_tooltip
                },
                {
                    action: getMode() === constants.modalModes.selection ? 'replace' : 'insertatcaret',
                    hasText: true,
                    button_text: getMode() === constants.modalModes.selection ? strings.replaceselection : strings.insertatcaret,
                    icon_left: true,
                    icon_right: false,
                    primary: true,
                    iconname: 'check',
                    iconstyle: 'solid',
                    tooltip: getMode() === constants.modalModes.selection ? strings.replaceselection_tooltip : strings.insertatcaret_tooltip
                }
            ],
    };
};

export const getInputContext = () => {
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
                        icon_right: true,
                        tooltip: strings.freepromptbutton_tooltip
                    }
                ]
            }
        ],
    }
}

export const getShowPromptButtonContext = () => {
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
        collapsed: true,
        tooltip: strings.showpromptbutton_tooltip
    }
};
