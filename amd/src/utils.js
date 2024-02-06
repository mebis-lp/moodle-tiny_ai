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
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// import Modal from 'core/modal';
import AiModal from './modal';
import Selectors from './selectors';
import {makeRequest} from 'local_ai_manager/make_request';
import ModalEvents from 'core/modal_events';

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
            showSettingSection(Selectors.elements.settingsIdSimplify);
        }

        const translateButton = e.target.closest('#tiny_ai-translate');
        if (translateButton) {
            showSettingSection(Selectors.elements.settingsIdTranslate);
        }

        const text2peechButton = e.target.closest('#tiny_ai-text-to-speech');
        if (text2peechButton) {
            window.console.log("Button T2S Clicked.");
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
 * @returns {string}
 */
const retrieveResult = async (purpose, prompt) => {
    let result = await makeRequest(purpose, prompt);
    return result;
};
