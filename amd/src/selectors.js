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
 * Tiny Link plugin helper function to build queryable data selectors.
 *
 * @module      tiny_ai/selectors
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export default {
    actions: {
        submit: '[data-action="save"]',
    },
    elements: {
        'cmdPromptSimplify': 'tiny_ai-simplify-prompt',
        'cmdPromptTranslate': 'tiny_ai-translate-prompt',
        'cmdPromptTTS': 'tiny_ai-tts-prompt',
        'cmdPromptImgGen': 'tiny_ai-imggen-prompt',

        'spanResult': 'tiny_ai-span-results',
        'previewWrapperId': 'tiny_ai-preview-wrapper',
        'previewSectionId': 'tiny_ai-preview',
        'taResult': 'tiny_ai-results',

        'classPurposeSettings': 'tiny_ai-settings',

        'settingsIdSimplify': 'tiny_ai-simplify-settings',
        'settingsIdTranslate': 'tiny_ai-translate-settings',
        'settingsIdTTS': 'tiny_ai-tts-settings',
        'translationOutputlanguage': 'tiny_ai-translation-outputlanguage',
        'ttsOutputlanguage': 'tiny_ai-tts-outputlanguage',
        'ttsOutputVoice': 'tiny_ai-tts-outputvoice',
        'settingsIdImgGen': 'tiny_ai-imggen-settings',

        'imggenwidth': 'tiny_ai-image-width',
        'imggenheight': 'tiny_ai-image-height',

        'freerompt': 'tiny_ai-free-prompt',
    },
    confirmation: {
        'simplification': 'confirm_no_personal_data_simplification',
        'translation': 'confirm_no_personal_data_translate',
        'tts': 'confirm_no_personal_data_tts',
        'imggen': 'confirm_no_personal_data_imggen',
        'free': 'confirm_no_personal_data_free',
    },
    buttons: {
        btnStartSimplification: 'btnStartSimplification',
        btnStartTranslation: 'btnStartTranslation',
        btnStartTTS: 'btnStartTTS',

        btnOpenSettingsImgGen: 'btnStartImgGenSettings',
        btnStartImgGen: 'btnStartImgGen',

        btnStartFree: 'tini_ai-strt-free',
    },
    purposes: {
        simplify: '#tiny_ai-simplify',
        translate: '#tiny_ai-translate',
        tts: '#tiny_ai-text-to-speech',
    }
};
