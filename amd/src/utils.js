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
 * @module      tiny_ai/utils
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// import Modal from 'core/modal';
import AiModal from './modal';
import Selectors from './selectors';
import {makeRequest} from 'local_ai_manager/make_request';
import ModalEvents from 'core/modal_events';
import Config from 'core/config';
import {getDraftItemId} from 'editor_tiny/options';

// export const handleAction = (editor) => {
//     openingSelection = editor.selection.getBookmark();
//     displayDialogue(editor);
// };

/**
 * Get the template context for the dialogue.
 *
 * @param {object} data
 * @returns {object} data
 */
const getTemplateContext = (data) => {
    return Object.assign({}, {
        'defaultprompt-simplify': "Simplify the following text:",
        'btnIdStartSimplification': Selectors.buttons.btnStartSimplification,

        'defaultprompt-translate': "Translate the following text to american english:",
        'btnIdStartTranslation': Selectors.buttons.btnStartTranslation,

        'defaultprompt-tts': "",
        'btnIdStartTTS': Selectors.buttons.btnStartTTS,

        taResult: Selectors.elements.taResult,

        spanResult: Selectors.elements.spanResult,
    }, data);
};

/**
 * Shows and handles the dialog.
 *
 * @param {*} editor
 * @param {*} data
 */
export const displayDialogue = async (editor, data = {}) => {

    const modal = await AiModal.create({
        templateContext: getTemplateContext(data)
    });

    const $root = modal.getRoot();
    const root = $root[0];

    $root.on(ModalEvents.save, () => {
        let selectedText = editor.selection.getContent();
        let newText = document.getElementById(Selectors.elements.taResult).value;
        if (selectedText) {
            editor.selection.setContent(newText);
        } else {
            editor.insertContent(newText);
        }
    });

    root.addEventListener('click', (e) => {
        hideAllSettingsSections();

        const simplifyButton = e.target.closest('#tiny_ai-simplify');
        if (simplifyButton) {
            hideAllSettingsSections();
            showSettingSection(Selectors.elements.settingsIdSimplify);
        }

        const translateButton = e.target.closest('#tiny_ai-translate');
        if (translateButton) {
            hideAllSettingsSections();
            showSettingSection(Selectors.elements.settingsIdTranslate);
        }

        const text2peechButton = e.target.closest('#tiny_ai-text-to-speech');
        if (text2peechButton) {
            hideAllSettingsSections();
            showSettingSection(Selectors.elements.settingsIdTTS);
        }

        return;
    });

    document.getElementById(Selectors.buttons.btnStartSimplification).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptSimplify).value;
        getChatResult(cmdPrompt, selectedText);
    });

    document.getElementById(Selectors.buttons.btnStartTranslation).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptTranslate).value;
        getChatResult(cmdPrompt, selectedText);
    });

    document.getElementById(Selectors.buttons.btnStartTTS).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptTTS).value;
        const options = {};
        options.itemid = getDraftItemId(editor);
        options.filename = "tts_" + Math.random().toString(16).slice(2) + ".mp3";
        getMP3(cmdPrompt, selectedText, options);
    });
};

/**
 * Get the Chat result.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 */
const getChatResult = (cmdPrompt, selectedText) => {
    let prompt = cmdPrompt + " " + selectedText;

    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");

    retrieveResult('chat', prompt).then(result => {
        document.getElementById(Selectors.elements.taResult).value = result;
    });
};

/**
 * Get the MP3.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getMP3 = (cmdPrompt, selectedText, options) => {
    let prompt = cmdPrompt + " " + selectedText;

    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    // document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");

    retrieveResult('tts', prompt, options).then(result => {
        const fileUrl = result;
        const uniqid = 'id' + Math.random().toString(16).slice(2);
        let node = selectedText + '<audio class="tiny_ai_audio" controls id="' + uniqid + '" src="' + fileUrl + '" type="audio/mpeg" ></span>';

        var audiotag = document.createElement('audio');
        audiotag.controls = 'controls';
        audiotag.src = fileUrl;
        audiotag.type = 'audio/mpeg';
        document.getElementById(Selectors.elements.spanResult).appendChild(audiotag);
        document.getElementById(Selectors.elements.taResult).value = node;

    });
};

/**
 * Hides all setting blocks
 */
const hideAllSettingsSections = () => {
    [document.getElementsByClassName(Selectors.elements.classPurposeSettings)].forEach((x) => { x.className += ' hidden';});
};

/**
 * Show the settings block of the option selected.
 *
 * @param {string} selectorID
 */
const showSettingSection = (selectorID) => {
    document.getElementById(selectorID).classList.remove("hidden");
};

/**
 * Get the async answer from the LLM.
 *
 * @param {string} purpose
 * @param {string} prompt
 * @param {array} options
 * @returns {string}
 */
const retrieveResult = async (purpose, prompt, options = []) => {
    let result = await makeRequest(purpose, prompt, JSON.stringify(options));
    return result;
};
