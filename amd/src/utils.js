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
import {getDraftItemId} from 'editor_tiny/options';
import {getString} from 'core/str';

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
        'btnIdStartSimplification': Selectors.buttons.btnStartSimplification,

        'defaultprompt-translate': "",
        'btnIdStartTranslation': Selectors.buttons.btnStartTranslation,

        'defaultprompt-tts': "",
        'btnIdStartTTS': Selectors.buttons.btnStartTTS,

        'defaultprompt-imggen': "Generiere bitte ein Bild mit folgenden Eigenschaften: ...",
        'btnIdStartImgGen': Selectors.buttons.btnStartImgGen,
        'btnOpenSettingsImgGen': Selectors.buttons.btnOpenSettingsImgGen,

        'btnIdStartFree': Selectors.buttons.btnStartFree,

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

    $root.on(ModalEvents.save, () => {
        let selectedText = editor.selection.getContent();
        let newText = document.getElementById(Selectors.elements.taResult).value;
        if (selectedText) {
            editor.selection.setContent(newText);
        } else {
            editor.insertContent(newText);
        }
    });

    document.getElementById(Selectors.buttons.btnStartSimplification).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptSimplify).value;
        const options = {};
        options.confirmationpersonaldata = document.getElementById(Selectors.confirmation.simplification).checked;
        getChatResult(cmdPrompt, selectedText, options);
    });

    document.getElementById(Selectors.buttons.btnStartTranslation).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptTranslate).value;
        const options = {};
        options.language = document.getElementById(Selectors.elements.translationOutputlanguage).value;
        options.translation = true;
        options.confirmationpersonaldata = document.getElementById(Selectors.confirmation.translation).checked;

        let cmdPromptend;

        if (options.translation) {
            cmdPromptend = 'Translate the following text to ' + options.language;
        }

        if (cmdPrompt) {
            cmdPromptend += " " + cmdPrompt;
        }

        getChatResult(cmdPromptend, selectedText, options);
    });

    document.getElementById(Selectors.buttons.btnStartTTS).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptTTS).value;
        const options = {};
        options.itemid = getDraftItemId(editor);
        options.filename = "tts_" + Math.random().toString(16).slice(2) + ".mp3";
        options.language = document.getElementById(Selectors.elements.ttsOutputlanguage).value;
        options.voice = document.getElementById(Selectors.elements.ttsOutputVoice).value;
        options.confirmationpersonaldata = document.getElementById(Selectors.confirmation.tts).checked;
        getMP3(cmdPrompt, selectedText, options);
    });

    document.getElementById(Selectors.buttons.btnStartImgGen).addEventListener('click', () => {
        let selectedText = editor.selection.getContent();
        let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptImgGen).value;
        const options = {};
        options.itemid = getDraftItemId(editor);
        options.filename = "imggen_" + Math.random().toString(16).slice(2) + ".png";
        options.imagesize = document.getElementById(Selectors.elements.imggenwidth).value;
        options.imagesize += "x" + document.getElementById(Selectors.elements.imggenheight).value;
        options.confirmationpersonaldata = document.getElementById(Selectors.confirmation.imggen).checked;
        getIMG(cmdPrompt, selectedText, options);
    });

    document.getElementById(Selectors.buttons.btnStartFree).addEventListener('click', () => {
        let prompt = document.getElementById(Selectors.elements.freerompt).value;
        const options = {};
        options.confirmationpersonaldata = document.getElementById(Selectors.confirmation.free).checked;
        getChatResult(prompt, "", options);
    });

};

/**
 * Get the Chat result.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getChatResult = async (cmdPrompt, selectedText, options) => {

    let prompt = cmdPrompt + ": " + selectedText;
    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.previewWrapperId).classList.add("hidden");

    if (!options.confirmationpersonaldata){
        const StrPleaseWait = await getString('not_confirmed', 'tiny_ai').then((string) => { return string; }).catch();
        document.getElementById(Selectors.elements.taResult).innerHTML = StrPleaseWait;
        return;
    }

    const StrPleaseWait = await getString('results_please_wait', 'tiny_ai').then((string) => { return string; }).catch();
    document.getElementById(Selectors.elements.taResult).value = StrPleaseWait;

    retrieveResult('chat', prompt, options).then(requestresult => {

        // Early exit if an error occured. Print out the error message to the output textarea.
        if (requestresult.string == 'error') {
            document.getElementById(Selectors.elements.taResult).value = requestresult.result;
            return;
        }

        document.getElementById(Selectors.elements.taResult).value = requestresult.result;
    });
};

/**
 * Get the MP3.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getMP3 = async (cmdPrompt, selectedText, options) => {
    let prompt = cmdPrompt + " " + selectedText;

    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    // document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.spanResult).classList.add("hidden");
    document.getElementById(Selectors.elements.previewWrapperId).classList.remove("hidden");

    if (!options.confirmationpersonaldata) {
        const StrPleaseWait = await getString('not_confirmed', 'tiny_ai').then((string) => { return string; }).catch();
        document.getElementById(Selectors.elements.previewSectionId).innerHTML = StrPleaseWait;
        return;
    }

    const StrPleaseWait = await getString('results_please_wait', 'tiny_ai').then((string) => { return string; }).catch();
    document.getElementById(Selectors.elements.previewSectionId).innerHTML = StrPleaseWait;

    retrieveResult('tts', prompt, options).then(requestresult => {

        // Early exit if an error occured. Print out the error message to the output textarea.
        if (requestresult.string == 'error') {
            document.getElementById(Selectors.elements.previewSectionId).innerHTML = requestresult.result;
            return;
        }

        const fileUrl = requestresult.result;

        // Add the audio tag to the textarea, that is inserted later to the main editor.
        let node = selectedText + '<audio class="tiny_ai_audio" controls src="' + fileUrl + '" type="audio/mpeg" ></span>';
        document.getElementById(Selectors.elements.taResult).value = node;

        // Finally generate the preview audio tag.
        var audiotag = document.createElement('audio');
        audiotag.controls = 'controls';
        audiotag.src = fileUrl;
        audiotag.type = 'audio/mpeg';
        document.getElementById(Selectors.elements.previewSectionId).innerHTML = "";
        document.getElementById(Selectors.elements.previewSectionId).appendChild(audiotag);

    });
};

/**
 * Get the IMG.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getIMG = async (cmdPrompt, selectedText, options) => {
    let prompt = cmdPrompt;

    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    // document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.spanResult).classList.add("hidden");
    document.getElementById(Selectors.elements.previewWrapperId).classList.remove("hidden");

    if (!options.confirmationpersonaldata) {
        const StrPleaseWait = await getString('not_confirmed', 'tiny_ai').then((string) => { return string; }).catch();
        document.getElementById(Selectors.elements.previewSectionId).innerHTML = StrPleaseWait;
        return;
    }

    const StrPleaseWait = await getString('results_please_wait', 'tiny_ai').then((string) => { return string; }).catch();
    document.getElementById(Selectors.elements.previewSectionId).innerHTML = StrPleaseWait;

    retrieveResult('imggen', prompt, options).then(requestresult => {

        // Early exit if an error occured. Print out the error message to the output textarea.
        if (requestresult.string == 'error') {
            document.getElementById(Selectors.elements.previewSectionId).innerHTML = requestresult.result;
            return;
        }

        const fileUrl = requestresult.result;

        // Add the img tag to the textarea, that is inserted later to the main editor.
        let node = selectedText + '<img class="tiny_ai_img" src="' + fileUrl + '" ></span>';
        document.getElementById(Selectors.elements.taResult).value = node;

        // Finally generate the preview img tag.
        var img = document.createElement('img');
        img.src = fileUrl;
        document.getElementById(Selectors.elements.previewSectionId).innerHTML = "";
        document.getElementById(Selectors.elements.previewSectionId).appendChild(img);
    });
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
