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
 * @category    admin
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// import Modal from 'core/modal';
import AiModal from './modal';

export const handleAction = (editor) => {
    openingSelection = editor.selection.getBookmark();
    displayDialogue(editor);
};

/**
 * Get the template context for the dialogue.
 *
 * @param {Editor} editor
 * @param {object} data
 * @returns {object} data
 */
const getTemplateContext = (editor, data) => {
    // const permissions = getPermissions(editor);

    // const canShowFilePicker = typeof getFilePicker(editor, 'h5p') !== 'undefined';
    // const canUpload = (permissions.upload && canShowFilePicker) ?? false;
    // const canEmbed = permissions.embed ?? false;
    // const canUploadAndEmbed = canUpload && canEmbed;

    return Object.assign({}, {
        // elementid: editor.id,
        // canUpload,
        // canEmbed,
        // canUploadAndEmbed,
        // showOptions: false,
        // fileURL: data?.url ?? '',
    }, data);
};

export const displayDialogue = async (editor, data = {}) => {

    const modal = await AiModal.create({
        templateContext: getTemplateContext(editor, data),
    });

    const $root = modal.getRoot();
    const root = $root[0];
    // $root.on(ModalEvents.save, (event, modal) => {
    //     handleDialogueSubmission(editor, modal, data);
    // });

    root.addEventListener('click', (e) => {
        const simplifyButton = e.target.closest('#tiny_ai-simplify');
        if (simplifyButton) {
            window.console.log("Button Simplify Clicked.");
        }

        const translateButton = e.target.closest('#tiny_ai-translate');
        if (translateButton) {
            window.console.log("Button Translate Clicked.");
        }

        const text2peechButton = e.target.closest('#tiny_ai-text-to-speech');
        if (text2peechButton) {
            window.console.log("Button T2S Clicked.");
        }
    });
};
