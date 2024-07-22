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
import TtsHandler from 'tiny_ai/datahandler/tts';
import ImggenHandler from 'tiny_ai/datahandler/imggen';
import {alert as Alert} from 'core/notification';
import * as BasedataHandler from 'tiny_ai/datahandler/basedata';

export default class extends BaseController {


    async init() {
        const modalFooter = document.querySelector(SELECTORS.modalFooter);
        const backButton = modalFooter.querySelector('[data-action="back"]');
        const generateButton = modalFooter.querySelector('[data-action="generate"]');

        switch (DataManager.getCurrentTool()) {
            case 'summarize':
            case 'describe':
                SummarizeHandler.setTool(DataManager.getCurrentTool());
                const maxWordCountElement = this.baseElement.querySelector('[data-preference="maxWordCount"]');
                const languageTypeElement = this.baseElement.querySelector('[data-preference="languageType"]');
                SummarizeHandler.setMaxWordCount(maxWordCountElement.querySelector('[data-dropdown="select"]').dataset.value);
                SummarizeHandler.setLanguageType(languageTypeElement.querySelector('[data-dropdown="select"]').dataset.value);
                const currentPromptSummarize = await SummarizeHandler.getPrompt();
                DataManager.setCurrentPrompt(currentPromptSummarize)
                maxWordCountElement.addEventListener('dropdownSelectionUpdated', async(event) => {
                    SummarizeHandler.setMaxWordCount(event.detail.newValue);
                    const currentPrompt = await SummarizeHandler.getPrompt();
                    DataManager.setCurrentPrompt(currentPrompt)
                });
                languageTypeElement.addEventListener('dropdownSelectionUpdated', async(event) => {
                    SummarizeHandler.setLanguageType(event.detail.newValue);
                    const currentPrompt = await SummarizeHandler.getPrompt();
                    DataManager.setCurrentPrompt(currentPrompt);
                });
                break;
            case 'translate':
                const targetLanguageElement = this.baseElement.querySelector('[data-preference="targetLanguage"]');
                TranslateHandler.setTargetLanguage(targetLanguageElement.querySelector('[data-dropdown="select"]').dataset.value)
                const currentPromptTranslate = await TranslateHandler.getPrompt();
                DataManager.setCurrentPrompt(currentPromptTranslate);
                targetLanguageElement.addEventListener('dropdownSelectionUpdated', async(event) => {
                    TranslateHandler.setTargetLanguage(event.detail.newValue);
                    const currentPromptTranslate = await TranslateHandler.getPrompt();
                    DataManager.setCurrentPrompt(currentPromptTranslate);
                });
                break;
            case 'tts':
            case 'audiogen':
                const ttsTargetLanguageElement = this.baseElement.querySelector('[data-preference="targetLanguage"]');
                const voiceElement = this.baseElement.querySelector('[data-preference="voice"]');
                const genderElement = this.baseElement.querySelector('[data-preference="gender"]');
                if (ttsTargetLanguageElement) {
                    TtsHandler.setTargetLanguage(ttsTargetLanguageElement.querySelector('[data-dropdown="select"]').dataset.value)
                    ttsTargetLanguageElement.addEventListener('dropdownSelectionUpdated', event => {
                        TtsHandler.setTargetLanguage(event.detail.newValue);
                        DataManager.setCurrentOptions(TtsHandler.getOptions());
                    });
                }
                if (voiceElement) {
                    TtsHandler.setVoice(voiceElement.querySelector('[data-dropdown="select"]').dataset.value)
                    voiceElement.addEventListener('dropdownSelectionUpdated', event => {
                        TtsHandler.setVoice(event.detail.newValue);
                        DataManager.setCurrentOptions(TtsHandler.getOptions());
                    });
                }
                if (genderElement) {
                    TtsHandler.setGender(genderElement.querySelector('[data-dropdown="select"]').dataset.value)
                    genderElement.addEventListener('dropdownSelectionUpdated', event => {
                        TtsHandler.setGender(event.detail.newValue);
                        DataManager.setCurrentOptions(TtsHandler.getOptions());
                    });
                }
                DataManager.setCurrentPrompt(TtsHandler.getPrompt());
                DataManager.setCurrentOptions(TtsHandler.getOptions());
                break;
            case 'imggen':
                const sizesElement = this.baseElement.querySelector('[data-preference="sizes"]');

                if (sizesElement) {
                    ImggenHandler.setSize(sizesElement.querySelector('[data-dropdown="select"]').dataset.value)
                    sizesElement.addEventListener('dropdownSelectionUpdated', event => {
                        ImggenHandler.setSize(event.detail.newValue);
                        DataManager.setCurrentOptions(ImggenHandler.getOptions());
                    });
                }
                DataManager.setCurrentPrompt('');
                DataManager.setCurrentOptions(ImggenHandler.getOptions());
                break;
        }

        if (backButton) {
            backButton.addEventListener('click', async () => {
                await Renderer.renderStart(constants.modalModes.selection);
            });
        }

        if (generateButton) {
            generateButton.addEventListener('click', async () => {
                if (DataManager.getCurrentPrompt() === null || DataManager.getCurrentPrompt().length === 0) {
                    await Alert(BasedataHandler.getTinyAiString('generalerror'), BasedataHandler.getTinyAiString('error_nopromptgiven'));
                    return;
                }
                await Renderer.renderLoading();
                const result = await getAiAnswer(DataManager.getCurrentPrompt(), constants.toolPurposeMapping[DataManager.getCurrentTool()],
                    DataManager.getCurrentOptions());
                if (result === null) {
                    this.callRendererFunction();
                    return;
                }
                DataManager.setCurrentAiResult(result);
                console.log(result)
                await Renderer.renderSuggestion();
            });
        }
    }
}
