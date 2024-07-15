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
 * @module      tiny_ai/controllers/summarize_options
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {prefetchStrings} from 'core/prefetch';
import {constants} from 'tiny_ai/constants';
import * as Renderer from 'tiny_ai/renderer';
import SELECTORS from 'tiny_ai/selectors';

export default class {

    constructor(baseSelector) {
        this.baseElement = document.querySelector(baseSelector);
    }

    async init() {
        const modalFooter = document.querySelector(SELECTORS.modalFooter);
        const backButton = modalFooter.querySelector('[data-action="back"]');
        const generateButton = modalFooter.querySelector('[data-action="generate"]');

        if (backButton) {
            backButton.addEventListener('click', async() => {
                await Renderer.renderStart(constants.modalModes.selection);
            });
        }

        if (generateButton) {
            generateButton.addEventListener('click', async() => {
                await Renderer.renderLoading();
                // TODO remove again, just a delay until we have a real AI interaction
                await new Promise(resolve => setTimeout(resolve, 1000));
                //await aiAnswer = makeRequest(...)
                await Renderer.renderSuggestion("BLINDTEXT");


            });
        }
    }
}
