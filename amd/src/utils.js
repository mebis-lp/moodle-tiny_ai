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

import AiModal from 'tiny_ai/modal';
import ModalEvents from 'core/modal_events';
import {getUserId} from 'tiny_ai/options';
import {constants} from 'tiny_ai/constants';
import {selectionbarSource, toolbarSource, menubarSource} from 'tiny_ai/common';
import * as Renderer from 'tiny_ai/renderer';
import DataManager from 'tiny_ai/datamanager';
import {exception as displayException} from 'core/notification';
import {getString} from 'core/str';
import {makeRequest} from 'local_ai_manager/make_request';


let userId = null;
let modal = null;
let editor = null;

export const init = async (editorObject) => {
    editor = editorObject;
    userId = getUserId(editor);
}

/**
 * Shows and handles the dialog.
 *
 * @param {string} source the different sources from where the modal is being created, defined in common module
 */
export const displayDialogue = async (source) => {
    let mode;
    if (source === selectionbarSource) {
        mode = constants.modalModes.selection;
    } else if (source === toolbarSource || source === menubarSource) {
        mode = constants.modalModes.general;
    }


    // We initially render the modal without content, because we need to rerender it anyway.
    modal = await AiModal.create({
        templateContext: {
            classes: 'tiny_ai-modal--dialog',
            headerclasses: 'tiny_ai-modal--header'
        }
    });

    if (mode === constants.modalModes.selection) {
        console.log(editor)
        DataManager.setSelection(editor.selection.getContent());
    }
    await Renderer.init(modal, userId);
    // Unfortunately, the modal will not execute any JS code in the template, so we need to rerender the modal as a whole again.
    await Renderer.renderStart(mode);
    modal.getRoot().on(ModalEvents.outsideClick, event => {
        event.preventDefault();
    });
};

export const getAiAnswer = async(prompt, purpose) => {
    let result = null;
    try {
        result = await makeRequest(purpose, prompt);
    } catch (exception) {
        displayException(exception);
    }
    if (result.code !== 200) {
        const errorString = await getString('errorwithcode', 'tiny_ai', result.code);
        await alert(errorString, result.result);
        return null;
    }
    return result.result;
}

export const insertAfterContent = (textToInsert) => {
    editor.setContent(editor.getContent() + '<p>' + textToInsert + '</p>');
}

export const replaceSelection = (textToReplace) => {
    editor.selection.setContent(textToReplace);
}

export const destroyModal = () => {
    modal.destroy();
}
