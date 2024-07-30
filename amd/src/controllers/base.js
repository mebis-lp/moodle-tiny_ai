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

import * as Renderer from 'tiny_ai/renderer';
import DataManager from 'tiny_ai/datamanager';
import {exception as displayException} from 'core/notification';
import * as BasedataHandler from '../datahandler/basedata';
import {getAiAnswer, errorAlert} from 'tiny_ai/utils';
import {constants} from 'tiny_ai/constants';

/**
 * Base controller class providing some basic functionalities.
 *
 * All tiny_ai controllers should inherit from this class.
 *
 * @module      tiny_ai/controllers/base
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
export default class {

    baseElement = null;
    footer = null;

    constructor(baseSelector) {
        this.baseElement = document.querySelector(baseSelector);
        if (this.baseElement === null) {
            // Sometimes (for example we display an error message before we even finish rendering the modal) we do not have
            // a base element. In this case there is nothing to do, so we avoid console errors by early exiting.
            return;
        }
        this.footer = this.baseElement.parentElement.parentElement.querySelector('[data-region="footer"]');
    }

    async generateAiAnswer() {
        if (DataManager.getCurrentPrompt() === null || DataManager.getCurrentPrompt().length === 0) {
            await errorAlert(BasedataHandler.getTinyAiString('error_nopromptgiven'));
            return null;
        }
        await Renderer.renderLoading();
        let result = null;
        try {
            result = await getAiAnswer(DataManager.getCurrentPrompt(), constants.toolPurposeMapping[DataManager.getCurrentTool()],
                DataManager.getCurrentOptions());
        } catch (exception) {
            displayException(exception);
        }

        if (result === null) {
            this.callRendererFunction();
            return null;
        }
        DataManager.setCurrentAiResult(result);
    }

    callRendererFunction() {
        if (DataManager.getCurrentTool() === 'freeprompt') {
            Renderer.renderStart();
            return;
        }
        const toolNameWithUppercaseLetter =
            DataManager.getCurrentTool().charAt(0).toUpperCase() + DataManager.getCurrentTool().slice(1);
        Renderer['render' + toolNameWithUppercaseLetter]();
    }
}
