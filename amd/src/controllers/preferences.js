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
 * @module      tiny_ai/controllers/translate
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {prefetchStrings} from 'core/prefetch';
import {constants} from 'tiny_ai/constants';
import * as Renderer from 'tiny_ai/renderer';
import SELECTORS from 'tiny_ai/selectors';
import BaseController from 'tiny_ai/controllers/base';
import DataManager from 'tiny_ai/datamanager';
import SummarizeHandler from 'tiny_ai/datahandler/summarize';
import TranslateHandler from 'tiny_ai/datahandler/translate';
import {getAiAnswer} from 'tiny_ai/utils';

export default class extends BaseController {


    async init() {
        const modalFooter = document.querySelector(SELECTORS.modalFooter);
        const backButton = modalFooter.querySelector('[data-action="back"]');
        const generateButton = modalFooter.querySelector('[data-action="generate"]');
console.log(DataManager.getCurrentTool())
        switch(DataManager.getCurrentTool()) {
            case 'summarize':
            case 'describe':
                SummarizeHandler.setTool(DataManager.getCurrentTool());
                const maxWordCountElement = this.baseElement.querySelector('[data-preference="maxWordCount"]');
                const languageTypeElement = this.baseElement.querySelector('[data-preference="languageType"]');
                SummarizeHandler.setMaxWordCount(maxWordCountElement.querySelector('[data-dropdown="select"]').dataset.value);
                SummarizeHandler.setLanguageType(languageTypeElement.querySelector('[data-dropdown="select"]').dataset.value);
                DataManager.setCurrentPrompt(SummarizeHandler.getPrompt())
                maxWordCountElement.addEventListener('dropdownSelectionUpdated', event => {
                    SummarizeHandler.setMaxWordCount(event.detail.newValue);
                    DataManager.setCurrentPrompt(SummarizeHandler.getPrompt())
                    console.log(DataManager.getCurrentPrompt())
                });
                languageTypeElement.addEventListener('dropdownSelectionUpdated', event => {
                    SummarizeHandler.setLanguageType(event.detail.newValue);
                    DataManager.setCurrentPrompt(SummarizeHandler.getPrompt())
                });
                break;
            case 'translate':
                const targetLanguageElement = this.baseElement.querySelector('[data-preference="targetLanguage"]');
                TranslateHandler.setTargetLanguage(targetLanguageElement.querySelector('[data-dropdown="select"]').dataset.value)
                DataManager.setCurrentPrompt(TranslateHandler.getPrompt());
                targetLanguageElement.addEventListener('dropdownSelectionUpdated', event => {
                    TranslateHandler.setTargetLanguage(event.detail.newValue);
                    DataManager.setCurrentPrompt(TranslateHandler.getPrompt())
                });
                break;
        }

        if (backButton) {
            backButton.addEventListener('click', async() => {
                await Renderer.renderStart(constants.modalModes.selection);
            });
        }

        if (generateButton) {
            generateButton.addEventListener('click', async() => {
                await Renderer.renderLoading();
                const result = await getAiAnswer(DataManager.getCurrentPrompt(),'singleprompt');
                if (result === null) {
                    this.callRendererFunction();
                    return;
                }
                DataManager.setCurrentAiResult(result);
                await Renderer.renderSuggestion();
            });
        }

    }
}
