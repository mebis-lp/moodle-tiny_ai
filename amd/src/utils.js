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
 * @package     tiny_ai
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
 * @param {Editor} editor
 * @param {object} data
 * @returns {object} data
 */
const getTemplateContext = (editor, data) => {
    return Object.assign({}, {
        'defaultprompt-simplify': "Simplify the following text:",
        'btnIdStartSimplification': Selectors.buttons.btnStartSimplification,
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
        templateContext: getTemplateContext(editor, data)
    });

    const $root = modal.getRoot();
    const root = $root[0];

    $root.on(ModalEvents.save, () => {
        let selectedText = editor.selection.getContent();
        let newText = document.getElementById(Selectors.elements.taResult).value;
        if (selectedText) {
            editor.selection.setContent(newText);
        } else {
            editor.insertContent(result);
        }
    });

    root.addEventListener('click', (e) => {
        const simplifyButton = e.target.closest('#tiny_ai-simplify');
        hideAllSettingsSections();
        if (simplifyButton) {
            showSettingSection(Selectors.elements.settingsIdSimplify);
        }

        const translateButton = e.target.closest('#tiny_ai-translate');
        if (translateButton) {
            window.console.log("Button Translate Clicked.");
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
    [document.getElementsByClassName(Selectors.elements.classPurposeSettings)].forEach(x => x.className += ' hidden');
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
    result = await makeRequest(purpose, prompt);
    return result;
}

/**
 * Get anchor element.
 *
 * @param {TinyMCE} editor
 * @param {Element} selectedElm
 * @returns {Element}
 */
const getAnchorElement = (editor, selectedElm) => {
    selectedElm = selectedElm || editor.selection.getNode();
    return editor.dom.getParent(selectedElm, 'a[href]');
};

/**
 * Handle insertion of purpose, or update of an existing one.
 *
 * @param {Element} currentForm
 * @param {TinyMCE} editor
 */
export const setLink = (currentForm, editor) => {
    const input = currentForm.querySelector(Selectors.elements.urlEntry);
    let value = input.value;

    if (value !== '') {
        const pendingPromise = new Pending('tiny_link/setLink');
        // We add a prefix if it is not already prefixed.
        value = value.trim();
        const expr = new RegExp(/^[a-zA-Z]*\.*\/|^#|^[a-zA-Z]*:/);
        if (!expr.test(value)) {
            value = 'http://' + value;
        }

        // Add the link.
        setLinkOnSelection(currentForm, editor, value).then(pendingPromise.resolve);
    }
};
