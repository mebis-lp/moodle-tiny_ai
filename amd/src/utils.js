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
import {getPurposeConfig} from 'local_ai_manager/config';
import ModalEvents from 'core/modal_events';
import {getDraftItemId} from 'editor_tiny/options';
import {getString} from 'core/str';
import {alert, exception as displayException} from 'core/notification';
import {renderInfoBox} from 'local_ai_manager/render_infobox';
import {getContextId} from 'editor_tiny/options';

/**
 * Define the purposes for the actions available in tiny_ai.
 *
 * @type {{imggen: string, freeprompt: string, tts: string, simplify: string, translate: string}}
 */
const purposes = {
    simplify: 'singleprompt',
    translate: 'singleprompt',
    imggen: 'imggen',
    tts: 'tts',
    freeprompt: 'singleprompt',
};

/**
 * Get the template context for the dialogue.
 *
 * @param {object} data
 * @returns {object} data
 */
const getTemplateContext = async(data) => {
    const purposeConfig = await getPurposeConfig();
    Object.keys(purposes).forEach(action => {
        const templatekey = 'show' + action;
        data[templatekey] = purposeConfig[purposes[action]] !== null;
    });
    // We remove all purposes which we are not using in tiny_ai.
    const filteredPurposeConfigArray = Object.keys(purposes).filter(action => purposeConfig[purposes[action]] !== null);
    // If there are no purposes left the tenant has not configured any purpose we need. We show a message in this case.
    data.noactionsavailable = filteredPurposeConfigArray.length === 0;

    return Object.assign({
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
        templateContext: await getTemplateContext(data)
    });
    await renderInfoBox('[data-content="local_ai_manager_infobox"]');

    const $root = modal.getRoot();

    $root.on(ModalEvents.save, () => {
        const selectedText = editor.selection.getContent();
        const newText = document.getElementById(Selectors.elements.taResult).value;
        if (selectedText) {
            editor.selection.setContent(newText);
        } else {
            editor.insertContent(newText);
        }
    });

    const simplifyButton = document.getElementById(Selectors.buttons.btnStartSimplification);
    if (simplifyButton) {
        simplifyButton.addEventListener('click', () => {
            const selectedText = stripHtmlTags(editor.selection.getContent());
            let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptSimplify).value;
            const options = {};
            // TODO Bad place to insert this, should be done in retrieve result, but passing the context id around is also nasty.
            //  We probably should make a class out of this module.
            options.contextid = getContextId(editor);
            getSinglePromptResult(cmdPrompt, selectedText, options);
        });
    }

    const translateButton = document.getElementById(Selectors.buttons.btnStartTranslation);
    if (translateButton) {
        translateButton.addEventListener('click', () => {
            const selectedText = stripHtmlTags(editor.selection.getContent());
            let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptTranslate).value;
            const options = {};
            options.contextid = getContextId(editor);
            options.language = document.getElementById(Selectors.elements.translationOutputlanguage).value;
            options.translation = true;

            let cmdPromptend;

            if (options.translation) {
                cmdPromptend = 'Translate the following text to ' + options.language;
            }

            if (cmdPrompt) {
                cmdPromptend += " " + cmdPrompt;
            }

            getSinglePromptResult(cmdPromptend, selectedText, options);
        });
    }

    const ttsButton = document.getElementById(Selectors.buttons.btnStartTTS);
    if (ttsButton) {
        ttsButton.addEventListener('click', () => {
            const selectedText = stripHtmlTags(editor.selection.getContent());
            let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptTTS).value;
            const options = {};
            options.itemid = getDraftItemId(editor);
            options.filename = "tts_" + Math.random().toString(16).slice(2) + ".mp3";
            options.language = document.getElementById(Selectors.elements.ttsOutputlanguage).value;
            options.voice = document.getElementById(Selectors.elements.ttsOutputVoice).value;
            options.contextid = getContextId(editor);
            getMP3(cmdPrompt, selectedText, options);
        });
    }

    const imggenButton = document.getElementById(Selectors.buttons.btnStartImgGen);
    if (imggenButton) {
        imggenButton.addEventListener('click', () => {
            const selectedText = stripHtmlTags(editor.selection.getContent());
            let cmdPrompt = document.getElementById(Selectors.elements.cmdPromptImgGen).value;
            const options = {};
            options.itemid = getDraftItemId(editor);
            options.filename = "imggen_" + Math.random().toString(16).slice(2) + ".png";
            options.imagesize = document.getElementById(Selectors.elements.imggenwidth).value;
            options.imagesize += "x" + document.getElementById(Selectors.elements.imggenheight).value;
            options.contextid = getContextId(editor);
            getIMG(cmdPrompt, selectedText, options);
        });
    }

    const freePromptButton = document.getElementById(Selectors.buttons.btnStartFree);
    if (freePromptButton) {
        freePromptButton.addEventListener('click', () => {
            let prompt = document.getElementById(Selectors.elements.freerompt).value;
            const options = {};
            options.contextid = getContextId(editor);
            getSinglePromptResult(prompt, "", options);
        });
    }

};

/**
 * Get the Chat result.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getSinglePromptResult = async(cmdPrompt, selectedText, options) => {

    const prompt = cmdPrompt + ": " + selectedText;
    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.previewWrapperId).classList.add("hidden");

    const StrPleaseWait = await getString('results_please_wait', 'tiny_ai');
    document.getElementById(Selectors.elements.taResult).value = StrPleaseWait;

    const requestresult = await retrieveResult('singleprompt', prompt, options);

    if (requestresult === null) {
        document.getElementById(Selectors.elements.taResult).value = '';
        return;
    }

    document.getElementById(Selectors.elements.taResult).value = requestresult.result;
};

/**
 * Get the MP3.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getMP3 = async(cmdPrompt, selectedText, options) => {
    const prompt = cmdPrompt + " " + selectedText;

    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    // document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.spanResult).classList.add("hidden");
    document.getElementById(Selectors.elements.previewWrapperId).classList.remove("hidden");

    const StrPleaseWait = await getString('results_please_wait', 'tiny_ai');
    document.getElementById(Selectors.elements.previewSectionId).innerHTML = StrPleaseWait;

    const requestresult = await retrieveResult(purposes.tts, prompt, options);
    if (requestresult === null) {
        return;
    }
    const fileUrl = requestresult.result;

    // Add the audio tag to the textarea, that is inserted later to the main editor.
    const node = selectedText + '<audio class="tiny_ai_audio" controls src="' + fileUrl + '" type="audio/mpeg"/>';
    document.getElementById(Selectors.elements.taResult).value = node;

    // Finally generate the preview audio tag.
    const audiotag = document.createElement('audio');
    audiotag.controls = 'controls';
    audiotag.src = fileUrl;
    audiotag.type = 'audio/mpeg';
    document.getElementById(Selectors.elements.previewSectionId).innerHTML = "";
    document.getElementById(Selectors.elements.previewSectionId).appendChild(audiotag);

};

/**
 * Get the IMG.
 * @param {string} cmdPrompt
 * @param {string} selectedText
 * @param {object} options
 */
const getIMG = async(cmdPrompt, selectedText, options) => {
    const prompt = cmdPrompt;

    // Shows the results box. This should happen before the real result is shown,
    // in order to inform the user, that we are working on it.
    // document.getElementById(Selectors.elements.spanResult).classList.remove("hidden");
    document.getElementById(Selectors.elements.spanResult).classList.add('hidden');
    document.getElementById(Selectors.elements.previewWrapperId).classList.remove('hidden');

    const StrPleaseWait = await getString('results_please_wait', 'tiny_ai');
    document.getElementById(Selectors.elements.previewSectionId).innerHTML = StrPleaseWait;

    const requestresult = await retrieveResult(purposes.imggen, prompt, options);
    if (retrieveResult === null) {
        return;
    }

    const fileUrl = requestresult.result;

    // Add the img tag to the textarea, that is inserted later to the main editor.
    const node = selectedText + '<img class="tiny_ai_img" src="' + fileUrl + '" />';
    document.getElementById(Selectors.elements.taResult).value = node;

    // Finally generate the preview img tag.
    const img = document.createElement('img');
    img.src = fileUrl;
    document.getElementById(Selectors.elements.previewSectionId).innerHTML = '';
    document.getElementById(Selectors.elements.previewSectionId).appendChild(img);
};

/**
 * Get the async answer from the LLM.
 *
 * @param {string} purpose
 * @param {string} prompt
 * @param {object} options
 * @returns {string}
 */
const retrieveResult = async(purpose, prompt, options = {}) => {
    options.component = 'tiny_ai';
    console.log(options)
    let result;
    try {
        result = await makeRequest(purpose, prompt, JSON.stringify(options));
    } catch (error) {
        displayException(error);
    }
    if (result.code !== 200) {
        const errorString = await getString('errorwithcode', 'tiny_ai', result.code);
        await alert(errorString, result.result);
        return null;
    }

    return result;
};

const stripHtmlTags = (html) => {
    // Place selected content into a temporary span and extract the plain text from it to strip HTML tags.
    const span = document.createElement('span');
    span.innerHTML = html;
    return span.textContent;
};
