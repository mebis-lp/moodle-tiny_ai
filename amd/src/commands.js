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
    buttonName,
    buttonTitle,
    icon,
} from './common';
import {displayDialogue} from './utils';

/**
 * Handle the action for your plugin.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 */
// const handleAction = (editor) => {
//     displayDialogue(editor);

//     // TODO Handle the action.
//     // window.console.log(editor);
// };

/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const [
        buttonImage,
    ] = await Promise.all([
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the AI Toolbar Button.
        editor.ui.registry.addToggleButton(buttonName, {
            icon,
            tooltip: buttonTitle,
            onAction: () => displayDialogue(editor),
        });

        // Register the menu item.
        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: buttonTitle,
            onAction: () => displayDialogue(editor),
        });

        // editor.on('init', () => onInit(editor));
        // editor.on('BeforeGetContent', format => onBeforeGetContent(format));
        // editor.on('submit', () => onSubmit());

    };
};
