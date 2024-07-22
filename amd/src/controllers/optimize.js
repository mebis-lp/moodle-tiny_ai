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
 * Controller for the main selection.
 *
 * @module      tiny_ai/controllers/optimize
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as Renderer from 'tiny_ai/renderer';
import BaseController from 'tiny_ai/controllers/base';
import {getAiAnswer} from 'tiny_ai/utils';
import DataManager from 'tiny_ai/datamanager';
import {constants} from 'tiny_ai/constants';
import {alert as Alert} from 'core/notification';
import * as BasedataHandler from 'tiny_ai/datahandler/base';

export default class extends BaseController {

    async init() {
        const backButton = this.footer.querySelector('[data-action="back"]');
        const generateButton = this.footer.querySelector('[data-action="generate"]');

        if (backButton) {
            backButton.addEventListener('click', async() => {
                await Renderer.renderSuggestion();
            });
        }

        // TODO Avoid code duplication, see preferences.js
        if (generateButton) {
            generateButton.addEventListener('click', async () => {
                const result = await this.generateAiAnswer();
                if (result === null) {
                    return;
                }
                await Renderer.renderSuggestion();
            });
        }
    }
}
