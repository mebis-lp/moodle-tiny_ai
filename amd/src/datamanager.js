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

import SELECTORS from 'tiny_ai/selectors';

/**
 * Tiny AI data manager.
 *
 * @module      tiny_ai/datamanager
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const DataManager = new _DataManager();

class _DataManager {

    constructor() {
        this.eventEmitterElement = document.createElement('div');
    }

    currentTool = null;
    prompt = null;

    setCurrentTool(currentTool) {
        this.currentTool = currentTool;
    }

    getCurrentTool() {
        return this.currentTool;
    }

    setCurrentPrompt(prompt) {
        this.prompt = prompt;
        const promptUpdatedEvent = new CustomEvent('promptUpdated', {
            detail: {
                newPrompt: prompt
            }
        });
        this.eventEmitterElement.dispatchEvent(promptUpdatedEvent);
    }

    getCurrentPrompt() {
        return this.prompt;

    }

    getSelection() {
        return this.selection;
    }

    getSelectionText() {
        const span = document.createElement('span');
        span.innerHTML = this.selection;
        return span.textContent;
    }

    setSelection(selection) {
        this.selection = selection;
    }

    getEventEmitterElement() {
        return this.eventEmitterElement;
    }
}

export default DataManager;



