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
 * Controller for dismiss page.
 *
 * @module      tiny_ai/controllers/dismiss
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {prefetchStrings} from 'core/prefetch';
import BaseController from 'tiny_ai/controllers/base';
import * as Renderer from 'tiny_ai/renderer';

export default class extends BaseController {

    async init() {
        const cancelButton = this.baseElement.querySelector('[data-action="canceldismiss"]');
        const dismissButton = this.baseElement.querySelector('[data-action="dismiss"]');

        if (cancelButton) {
            cancelButton.addEventListener('click', async(event) => {
                await Renderer.renderSuggestion();
            });
        }
        if (dismissButton) {
            dismissButton.addEventListener('click', async(event) => {
                await this.callRendererFunction();
            });
        }
    }
}