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
import {getDraftItemId as getDraftItemIdTinyCore} from 'editor_tiny/options';
import {getRenderer} from 'tiny_ai/utils';

export default class {

    uniqid = null;
    component = null;
    userId = null;
    contextId = null;
    modal = null;
    editor = null;

    constructor(uniqid, component, contextId, userId, editor = null) {
        this.uniqid = uniqid;
        this.component = component;
        this.editor = editor;
        this.contextId = contextId;
        this.userId = userId;
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
            },
            scrollable: false
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
        // By sending draft item id 0 we state that we do not have a draft item area yet.
        return this.editor !== null ? getDraftItemIdTinyCore(this.editor) : 0;
    }

    getComponent() {
        return this.component;
    }

    getContextId() {
        return this.contextId;
    }

    getUserId() {
        return this.userId;
    }

    getModal() {
        return this.modal;
    }

}
