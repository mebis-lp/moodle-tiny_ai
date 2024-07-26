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
 * @module      tiny_ai/controllers/suggestion
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {prefetchStrings} from 'core/prefetch';
import * as Renderer from 'tiny_ai/renderer';
import BaseController from 'tiny_ai/controllers/base';
import {insertAfterContent, replaceSelection, destroyModal} from 'tiny_ai/utils';
import {renderWarningBox} from 'local_ai_manager/warningbox';

export default class extends BaseController {

    async init() {
        const trashButton = this.footer.querySelector('[data-action="delete"]');
        const regenerateButton = this.footer.querySelector('[data-action="regenerate"]');
        const insertBelowButton = this.footer.querySelector('[data-action="insertbelow"]');
        const replaceButton = this.footer.querySelector('[data-action="replace"]');
        const insertAtCaretButton = this.footer.querySelector('[data-action="insertatcaret"]');

        if (trashButton) {
            trashButton.addEventListener('click', async() => {
                await Renderer.renderDismiss();
            });
        }

        if (regenerateButton) {
            regenerateButton.addEventListener('click', async() => {
                await Renderer.renderOptimizePrompt();
            });
        }

        if (insertBelowButton) {
            insertBelowButton.addEventListener('click', () => {
                insertAfterContent(Renderer.renderAiResultForEditor());
                destroyModal();
            });
        }

        if (replaceButton) {
            replaceButton.addEventListener('click', () => {
                replaceSelection(Renderer.renderAiResultForEditor());
                destroyModal();
            });
        }

        if (insertAtCaretButton) {
            insertAtCaretButton.addEventListener('click', () => {
                replaceSelection(Renderer.renderAiResultForEditor());
                destroyModal();
            });
        }

        const warningBoxSelector = '[data-rendertarget="warningbox"]';
        if (document.querySelector(warningBoxSelector)) {
            await renderWarningBox(warningBoxSelector);
        }
    }
}
