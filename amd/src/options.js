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
 * Options helper for the Moodle tiny_ai plugin.
 *
 * @module      tiny_ai/options
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from './common';

// Helper variables for the option names.
const my_custom_option1Name = getPluginOptionName(pluginName, 'my_custom_option1');
const my_custom_option2Name = getPluginOptionName(pluginName, 'my_custom_option2');

/**
 * Options registration function.
 *
 * @param {tinyMCE} editor
 */
export const register = (editor) => {
    const registerOption = editor.options.register;

    // For each option, register it with the editor.
    // Valid type are defined in https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editoroptions/
    registerOption(my_custom_option1Name, {
        processor: 'string',
    });
    registerOption(my_custom_option2Name, {
        processor: 'string',
    });
};

/**
 * Fetch the my_custom_option1 value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the my_custom_option1 option
 */
export const getMy_custom_option1 = (editor) => editor.options.get(my_custom_option1Name);

/**
 * Fetch the my_custom_option2 value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the my_custom_option2 option
 */
export const getMy_custom_option2 = (editor) => editor.options.get(my_custom_option2Name);
