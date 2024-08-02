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
import {alert as Alert, exception as displayException} from 'core/notification';
import {getString} from 'core/str';
import {makeRequest} from 'local_ai_manager/make_request';
import * as BasedataHandler from 'tiny_ai/datahandler/basedata';
import $ from 'jquery';
import Log from 'core/log';
import EditorUtils from 'tiny_ai/editor_utils';

const objectStore = {};

export const init = async (uniqid, editor) => {
    if (!objectStore.hasOwnProperty(uniqid)) {
        objectStore[uniqid] = {};
        // The order in which these objects are being created is actually pretty important, because Renderer
        // object depends on DataManager object.
        objectStore[uniqid].editorUtils = new EditorUtils(uniqid, editor);
        objectStore[uniqid].datamanager = new DataManager(uniqid);
        objectStore[uniqid].renderer = new Renderer(uniqid);
        await objectStore[uniqid].renderer.init();
    }
};

export const getAiAnswer = async (prompt, purpose, options = {}) => {
    let result = null;
    try {
        result = await makeRequest(purpose, prompt, options);
    } catch (exception) {
        await displayException(exception);
        return;
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

export const errorAlert = async (message, title = null) => {
    if (title === null) {
        title = BasedataHandler.getTinyAiString('generalerror');
    }
    const alertModal = await Alert(title, message);
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

export const getEditorUtils = (uniqid) => {
    return objectStore[uniqid].editorUtils;
};

export const getRenderer = (uniqid) => {
    return objectStore[uniqid].renderer;
};

export const getDatamanager = (uniqid) => {
    return objectStore[uniqid].datamanager;
};

export const getCurrentModalUniqId = (element) => {
    return element.closest('[data-tiny_ai_uniqid]').dataset['tiny_ai_uniqid'];
};
