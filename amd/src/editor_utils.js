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
 * Editor instance specific utils.
 *
 * @module      tiny_ai/editor_utils
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import AiModal from 'tiny_ai/modal';
import ModalEvents from 'core/modal_events';
import {getUserId} from 'tiny_ai/options';
import {getDraftItemId as getDraftItemIdTinyCore, getContextId as getContextItemIdTinyCore} from 'editor_tiny/options';
import {getRenderer} from 'tiny_ai/utils';

export default class {

    uniqid = null;
    userId = null;
    modal = null;
    mode = null;
    editor = null;

    constructor(uniqid, editor) {
        this.uniqid = uniqid;
        this.editor = editor;
        this.userId = getUserId(editor);
    }

    /**
     * Shows and handles the dialog.
     */
    async displayDialogue() {

        // We initially render the modal without content, because we need to rerender it anyway.
        this.modal = await AiModal.create({
            templateContext: {
                classes: 'tiny_ai-modal--dialog',
                headerclasses: 'tiny_ai-modal--header'
            }
        });
        this.modal.show();
        const renderer = getRenderer(this.uniqid);

        // Unfortunately, the modal will not execute any JS code in the template, so we need to rerender the modal as a whole again.
        await renderer.renderStart();
        this.modal.getRoot().on(ModalEvents.outsideClick, event => {
            event.preventDefault();
        });
    }


    insertAfterContent(textToInsert) {
        this.editor.setContent(this.editor.getContent() + '<p>' + textToInsert + '</p>');
    }

    /**
     * Replaces a selected text with the given replacement.
     *
     * In case nothing is selected, it will be inserted at the current caret position.
     *
     * @param {strings} textReplacement the text by which the current selection will be replaced or which will be inserted
     *  at the caret (if no selection), can be HTML code
     */
    replaceSelection(textReplacement) {
        this.editor.selection.setContent(textReplacement);
    }

    getDraftItemId() {
        return getDraftItemIdTinyCore(this.editor);
    }

    getContextId() {
        return getContextItemIdTinyCore(this.editor);
    }

    getModal() {
        return this.modal;
    }

    getUserId() {
        return this.userId;
    }

}
