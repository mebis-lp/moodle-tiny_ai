// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands helper for the Moodle tiny_ai plugin.
 *
 * @module      tiny_ai/commands
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {
    component,
    toolbarButtonName,
    selectionbarButtonName,
    icon
} from 'tiny_ai/common';
import {prefetchStrings} from 'core/prefetch';
import {getString} from 'core/str';
import {getContextId as getContextItemIdTinyCore} from 'editor_tiny/options';
import {constants} from 'tiny_ai/constants';
import {getUserId} from 'tiny_ai/options';
import EditorUtils from 'tiny_ai/editor_utils';
import * as Utils from 'tiny_ai/utils';


/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    prefetchStrings('tiny_ai', ['toolbarbuttontitle', 'selectionbarbuttontitle']);
    const [
        buttonImage,
        toolbarButtonTitle,
        selectionbarButtonTitle
    ] = await Promise.all([
        getButtonImage('icon', component),
        getString('toolbarbuttontitle', 'tiny_ai'),
        getString('selectionbarbuttontitle', 'tiny_ai')
    ]);

    return (editor) => {
        // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        const contextId = getContextItemIdTinyCore(editor);
        // Generate a uniq id for every editor being loaded on this side.
        const uniqid = Math.random().toString(16).slice(2);

        const onActionCallback = async() => {
            // Ideally, we do this initiating earlier and not just in this callback, but we need to execute
            // async calls and these cannot be done outside during loading phase of tiny.
            if (!Utils.editorUtilsExist(uniqid)) {
                await Utils.init(uniqid, constants.modalModes.editor);
                const editorUtils = new EditorUtils(uniqid, 'tiny_ai', contextId, getUserId(editor), editor);
                Utils.setEditorUtils(uniqid, editorUtils);
            }
            await injectSelectedElements(editor, Utils.getDatamanager(uniqid));
            Utils.getEditorUtils(uniqid).displayDialogue();
        };

        // Register the AI Toolbar Button.
        editor.ui.registry.addButton(toolbarButtonName, {
            icon,
            tooltip: toolbarButtonTitle,
            onAction: onActionCallback
        });

        // Register the menu item.
        editor.ui.registry.addMenuItem(toolbarButtonName, {
            icon,
            text: toolbarButtonTitle,
            onAction: onActionCallback
        });

        editor.ui.registry.addButton(selectionbarButtonName, {
            icon,
            tooltip: selectionbarButtonTitle,
            onAction: onActionCallback
        });
    };
};

export const injectSelectedElements = async(editor, datamanager) => {
    const selectedEditorContentHtml = editor.selection.getContent({format: 'html'});
    const parser = new DOMParser();
    const editorDom = parser.parseFromString(selectedEditorContentHtml, 'text/html');
    const images = editorDom.querySelectorAll('img');

    if (images.length > 0 && images[0].src) {
        // If there are more than one we just use the first one.
        const image = images[0];
        // This should work for both external and data urls.
        const fetchResult = await fetch(image.src);
        const data = await fetchResult.blob();
        datamanager.setSelectionImg(data);
    }
    datamanager.setSelection(editor.selection.getContent());
};
