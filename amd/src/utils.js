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

import ModalEvents from 'core/modal_events';
import Renderer from 'tiny_ai/renderer';
import DataManager from 'tiny_ai/datamanager';
import ImggenHandler from 'tiny_ai/datahandler/imggen';
import OptimizeHandler from 'tiny_ai/datahandler/optimize';
import StartHandler from 'tiny_ai/datahandler/start';
import SummarizeHandler from 'tiny_ai/datahandler/summarize';
import TranslateHandler from 'tiny_ai/datahandler/translate';
import TtsHandler from 'tiny_ai/datahandler/tts';
import IttHandler from 'tiny_ai/datahandler/itt';
import {alert as moodleAlert, exception as displayException} from 'core/notification';
import {getString} from 'core/str';
import {makeRequest} from 'local_ai_manager/make_request';
import * as BasedataHandler from 'tiny_ai/datahandler/basedata';
import $ from 'jquery';
import Log from 'core/log';

const objectStore = {};

export const init = async(uniqid, mode) => {
    if (!objectStore.hasOwnProperty(uniqid)) {
        objectStore[uniqid] = {};
        // The order in which these objects are being created is actually pretty important, because Renderer
        // object depends on DataManager object.
        objectStore[uniqid].datamanager = new DataManager(uniqid);
        await BasedataHandler.init();
        objectStore[uniqid].imggenhandler = new ImggenHandler(uniqid);
        objectStore[uniqid].optimizehandler = new OptimizeHandler(uniqid);
        objectStore[uniqid].starthandler = new StartHandler(uniqid);
        await objectStore[uniqid].starthandler.init();
        objectStore[uniqid].summarizehandler = new SummarizeHandler(uniqid);
        objectStore[uniqid].translatehandler = new TranslateHandler(uniqid);
        objectStore[uniqid].ttshandler = new TtsHandler(uniqid);
        objectStore[uniqid].itthandler = new IttHandler(uniqid);
        objectStore[uniqid].renderer = new Renderer(uniqid, mode);
    }
};

export const getAiAnswer = async(prompt, purpose, options = {}) => {
    let result = null;
    const contextid = options.contextid;
    delete options.contextid;
    const component = options.component;
    delete options.component;

    try {
        result = await makeRequest(purpose, prompt, component, contextid, options);
    } catch (exception) {
        await displayException(exception);
        return null;
    }
    // In case the user cancels the request because precheck fails, makeRequest will properly return,
    // but will have result null. This means we just do nothing, because the user interrupted the sending
    // of the prompt.
    if (result === null) {
        return null;
    }
    if (result.code !== 200) {
        const alertTitle = await getString('errorwithcode', 'tiny_ai', result.code);
        const parsedResult = JSON.parse(result.result);
        if (parsedResult.debuginfo) {
            Log.error(parsedResult.debuginfo);
        }
        await errorAlert(parsedResult.message, alertTitle);
        return null;
    }
    return result.result;
};

export const errorAlert = async(message, title = null) => {
    if (title === null) {
        title = BasedataHandler.getTinyAiString('generalerror');
    }
    const alertModal = await moodleAlert(title, message);
    alertModal.getRoot().on(ModalEvents.hidden, () => {
        document.querySelectorAll('button[data-action]').forEach(button => {
            $(button).tooltip('hide');
        });
    });
};

export const stripHtmlTags = (textWithTags) => {
    // Place selected content into a temporary span and extract the plain text from it to strip HTML tags.
    const span = document.createElement('span');
    span.innerHTML = textWithTags;
    return span.textContent;
};

export const setEditorUtils = (uniqid, editorUtils) => {
    objectStore[uniqid].editorUtils = editorUtils;
};

export const getEditorUtils = (uniqid) => {
    return objectStore[uniqid].editorUtils;
};

export const getRenderer = (uniqid) => {
    return objectStore[uniqid].renderer;
};

export const getDatamanager = (uniqid) => {
    return objectStore[uniqid].datamanager;
};

export const getImggenHandler = (uniqid) => {
    return objectStore[uniqid].imggenhandler;
};

export const getOptimizeHandler = (uniqid) => {
    return objectStore[uniqid].optimizehandler;
};

export const getStartHandler = (uniqid) => {
    return objectStore[uniqid].starthandler;
};

export const getSummarizeHandler = (uniqid) => {
    return objectStore[uniqid].summarizehandler;
};

export const getTranslateHandler = (uniqid) => {
    return objectStore[uniqid].translatehandler;
};

export const getTtsHandler = (uniqid) => {
    return objectStore[uniqid].ttshandler;
};

export const getIttHandler = (uniqid) => {
    return objectStore[uniqid].itthandler;
};

export const getCurrentModalUniqId = (element) => {
    return element.closest('[data-tiny_instance_uniqid]').dataset.tiny_instance_uniqid;
};

export const copyTextToClipboard = (text) => {
    const clipboardItemData = {
        'text/plain': text
    };
    navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
};

export const copyFileToClipboard = async(url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    if (!ClipboardItem.supports(blob.type)) {
        return false;
    }

    const clipboardItemData = {
        [blob.type]: blob
    };
    navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
    return true;
};

export const downloadFile = (url, filename = null) => {
    const link = document.createElement('a');
    link.href = url;
    if (!filename) {
        filename = url.split('/').pop();
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadTextAsFile = (text) => {
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    downloadFile(url, 'airesult.txt');
    URL.revokeObjectURL(url);
};
