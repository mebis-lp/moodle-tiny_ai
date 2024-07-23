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

import {makeRequest} from 'local_ai_manager/make_request';
import DataManager from 'tiny_ai/datamanager';
import {exception as displayException} from 'core/notification';
import {getStrings, getString} from 'core/str';
import * as AiConfig from 'local_ai_manager/config';
import {prefetchStrings} from 'core/prefetch';

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
    'cancel',
    'describe_baseprompt',
    'describe_headline',
    'dismiss',
    'dismisssuggestion',
    'error_nopromptgiven',
    'freeprompt_placeholder',
    'gender',
    'generalerror',
    'generate',
    'hideprompt',
    'imggen_headline',
    'imggen_placeholder',
    'insertbelow',
    'keeplanguagetype',
    'languagetype',
    'languagetype_prompt',
    'mainselection_heading',
    'maxwordcount',
    'maxwordcount_prompt',
    'nomaxwordcount',
    'replaceselection',
    'reworkprompt',
    'simplelanguage',
    'size',
    'showprompt',
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
    // Now get the strings. Strings where dynamic data has to be injected are not being fetched.
    [
        strings.aigenerating,
        strings.aisuggestion,
        strings.audiogen_headline,
        strings.audiogen_placeholder,
        strings.back,
        strings.cancel,
        strings.describe_baseprompt,
        strings.describe_headline,
        strings.dismiss,
        strings.dismisssuggestion,
        strings.error_nopromptgiven,
        strings.freeprompt_placeholder,
        strings.gender,
        strings.generalerror,
        strings.generate,
        strings.hideprompt,
        strings.imggen_headline,
        strings.imggen_placeholder,
        strings.insertbelow,
        strings.keeplanguagetype,
        strings.languagetype,
        strings.languagetype_prompt,
        strings.mainselection_heading,
        strings.maxwordcount,
        strings.maxwordcount_prompt,
        strings.nomaxwordcount,
        strings.replaceselection,
        strings.reworkprompt,
        strings.simplelanguage,
        strings.size,
        strings.showprompt,
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

export const getReplaceButtonsContext = () => {
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
                    button_text: strings.insertbelow,
                    icon_left: true,
                    icon_right: false,
                    secondary: true,
                    iconname: 'text-insert-last',
                    customicon: true
                },
                {
                    action: 'replace',
                    hasText: true,
                    button_text: strings.replaceselection,
                    icon_left: true,
                    icon_right: false,
                    primary: true,
                    iconname: 'check',
                    iconstyle: 'solid'
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
                        icon_right: true
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
        collapsed: true
    }
};
