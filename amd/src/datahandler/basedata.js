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
    'back',
    'backbutton_tooltip',
    'cancel',
    'copybutton',
    'copybutton_tooltip',
    'deletebutton_tooltip',
    'describeimg_baseprompt',
    'describeimg_headline',
    'describe_baseprompt',
    'describe_headline',
    'dismiss',
    'dismisssuggestion',
    'downloadbutton',
    'downloadbutton_tooltip',
    'error_filetypeclipboardnotsupported_title',
    'error_filetypeclipboardnotsupported_text',
    'error_nofile',
    'error_nofileinclipboard_text',
    'error_nofileinclipboard_title',
    'error_nopromptgiven',
    'freeprompt_placeholder',
    'freepromptbutton_tooltip',
    'gender',
    'generalerror',
    'generate',
    'generatebutton_tooltip',
    'imagefromeditor',
    'imagetotext_baseprompt',
    'imagetotext_headline',
    'imagetotext_insertimage',
    'imggen_headline',
    'imggen_placeholder',
    'insertatcaret',
    'insertatcaret_tooltip',
    'insertbelow',
    'insertbelow_tooltip',
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
    'prompteditmode',
    'prompteditmode_tooltip',
    'summarize_baseprompt',
    'summarize_headline',
    'targetlanguage',
    'technicallanguage',
    'texttouse',
    'toolname_describe',
    'toolname_describeimg',
    'toolname_imggen',
    'toolname_imagetotext',
    'toolname_summarize',
    'toolname_translate',
    'toolname_tts',
    'translate_baseprompt',
    'translate_headline',
    'tts_headline',
    'voice'
];

let strings = new Map();

export const init = async() => {
    prefetchStrings('tiny_ai', stringKeys);
    const stringRequest = stringKeys.map(key => {
        return {key, component: 'tiny_ai'};
    });
    // We now get the strings. They are already prefetched, so this is not a performance feature.
    // We just use this to avoid having to code asynchronously all the time just for retrieving the
    // strings by using getString which returns a promise.
    const fetchedStrings = await getStrings(stringRequest);
    for (let i = 0; i < stringKeys.length; i++) {
        strings.set(stringKeys[i], fetchedStrings[i]);
    }
};

export const getTinyAiString = (string) => {
    return strings.get(string);
};

export const getBackAndGenerateButtonContext = () => {
    return {
        footerButtons: [
            {
                hasText: true,
                buttonText: getTinyAiString('back'),
                iconLeft: true,
                iconRight: false,
                primary: false,
                secondary: false,
                tertiary: true,
                iconname: 'arrow-left',
                iconstyle: 'solid',
                action: 'back',
                aiButtonHidden: false,
                tooltip: getTinyAiString('backbutton_tooltip')
            },
            {
                hasText: true,
                buttonText: getTinyAiString('generate'),
                iconLeft: true,
                iconRight: false,
                primary: true,
                secondary: false,
                tertiary: false,
                iconname: 'sparkle',
                customicon: true,
                action: 'generate',
                aiButtonHidden: false,
                tooltip: getTinyAiString('generatebutton_tooltip')
            }
        ]
    };
};

export const getReplaceButtonsContext = (selectionExists) => {

    return {
        footerIconButtons:
            [
                {
                    action: 'delete',
                    iconname: 'trash',
                    aiButtonHidden: false,
                    tooltip: getTinyAiString('deletebutton_tooltip')
                },
                {
                    action: 'regenerate',
                    iconname: 'arrows-rotate',
                    aiButtonHidden: false,
                    tooltip: getTinyAiString('regeneratebutton_tooltip')
                }
            ],
        footerButtons:
            [
                {
                    action: 'insertbelow',
                    hasText: true,
                    buttonText: getTinyAiString('insertbelow'),
                    iconLeft: true,
                    iconRight: false,
                    secondary: true,
                    iconname: 'text-insert-last',
                    customicon: true,
                    aiButtonHidden: false,
                    tooltip: getTinyAiString('insertbelow_tooltip')
                },
                {
                    action: selectionExists ? 'replace' : 'insertatcaret',
                    hasText: true,
                    buttonText: selectionExists
                        ? getTinyAiString('replaceselection') : getTinyAiString('insertatcaret'),
                    iconLeft: true,
                    iconRight: false,
                    primary: true,
                    iconname: 'check',
                    iconstyle: 'solid',
                    aiButtonHidden: false,
                    tooltip: selectionExists
                        ? getTinyAiString('replaceselection_tooltip') : getTinyAiString('insertatcaret_tooltip')
                }
            ],
    };
};

export const getCopyAndDownloadButtonsContext = () => {
    const buttonsContext = getReplaceButtonsContext(false);
    delete buttonsContext.footerButtons;
    buttonsContext.footerButtons = [
        {
            action: 'copy',
            hasText: true,
            buttonText: getTinyAiString('copybutton'),
            iconLeft: true,
            iconRight: false,
            secondary: true,
            iconname: 'copy',
            iconstyle: 'solid',
            aiButtonHidden: false,
            tooltip: getTinyAiString('copybutton_tooltip')
        },
        {
            action: 'download',
            hasText: true,
            buttonText: getTinyAiString('downloadbutton'),
            iconLeft: true,
            iconRight: false,
            primary: true,
            iconname: 'file-download',
            iconstyle: 'solid',
            aiButtonHidden: false,
            tooltip: getTinyAiString('downloadbutton_tooltip'),
        }
    ];
    return buttonsContext;
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
                        iconLeft: false,
                        iconRight: true,
                        tooltip: getTinyAiString('freepromptbutton_tooltip')
                    }
                ]
            }
        ],
    };
};

export const getShowPromptButtonContext = (showButton = true) => {
    return {
        hasText: true,
        buttonText: getTinyAiString('prompteditmode'),
        iconLeft: true,
        iconRight: false,
        tertiary: true,
        iconname: 'edit',
        iconstyle: 'solid',
        action: 'showprompt',
        aiButtonHidden: !showButton,
        textareas: [
            {
                textareatype: 'text',
                collapsed: false,
            },
            {
                textareatype: 'prompt',
                collapsed: true,
            }
        ],
        collapsed: true,
        tooltip: getTinyAiString('prompteditmode_tooltip')
    };
};
