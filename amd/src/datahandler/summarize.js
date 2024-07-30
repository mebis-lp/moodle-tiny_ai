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

import DataManager from 'tiny_ai/datamanager';
import * as BasedataHandler from 'tiny_ai/datahandler/basedata';
import {getString} from 'core/str';

/**
 * Tiny AI data manager.
 *
 * @module      tiny_ai/datahandler/summarize
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const SummarizeHandler = new _SummarizeHandler();

class _SummarizeHandler {

    currentTool = null;

    getLanguageTypeOptions() {
        return {
            nospeciallanguage: BasedataHandler.getTinyAiString('keeplanguagetype'),
            simplelanguage: BasedataHandler.getTinyAiString('simplelanguage'),
            technicallanguage: BasedataHandler.getTinyAiString('technicallanguage'),
        };
    }

    getMaxWordCountOptions() {
        return {
            0: BasedataHandler.getTinyAiString('nomaxwordcount'),
            10: '10',
            20: '20',
            50: '50',
            100: '100',
            200: '200',
            300: '300'
        };
    }

    languageType = null;
    maxWordCount = 0;

    setMaxWordCount(maxWordCount) {
        this.maxWordCount = maxWordCount;
    }

    setLanguageType(languageType) {
        this.languageType = languageType;
    }

    async getPrompt() {
        let prompt = '';
        if (this.currentTool === 'summarize') {
            prompt += BasedataHandler.getTinyAiString('summarize_baseprompt');
        } else if (this.currentTool === 'describe') {
            prompt += BasedataHandler.getTinyAiString('describe_baseprompt');
        }
        if (parseInt(this.maxWordCount) === 0 && this.languageType === 'nospeciallanguage') {
            return prompt + ': ' + DataManager.getSelectionText();
        } else {
            prompt += '. ';
            if (parseInt(this.maxWordCount) !== 0) {
                prompt += ' ';
                prompt += await getString('maxwordcount_prompt', 'tiny_ai', this.maxWordCount);
                prompt += '.';
            }
            if (this.languageType !== 'nospeciallanguage') {
                prompt += ' ';
                prompt += await getString('languagetype_prompt', 'tiny_ai', this.getLanguageTypeOptions()[this.languageType]);
                prompt += '.';
            }
            prompt += '\n';
            prompt += BasedataHandler.getTinyAiString('texttouse') + ': ' + DataManager.getSelectionText();
            return prompt;
        }
    }

    setTool(currentTool) {
        this.currentTool = currentTool;
    }

    /**
     * Return the template context.
     *
     * @param {string} tool the tool to generate the context for, can be 'summarize' or 'describe'
     */
    getTemplateContext(tool) {
        const
            context = {
                modal_headline: BasedataHandler.getTinyAiString(tool + '_headline'),
                showIcon: true,
                tool: tool,
            };
        Object
            .assign(context, BasedataHandler

                .getShowPromptButtonContext()
            )
        ;
        Object
            .assign(context, BasedataHandler

                .getBackAndGenerateButtonContext()
            )
        ;

        const maxWordCountDropdownContext = {};
        maxWordCountDropdownContext.preference = 'maxWordCount';
        maxWordCountDropdownContext.dropdown_default = Object.values(this.getMaxWordCountOptions())[0];
        maxWordCountDropdownContext.dropdown_default_value = Object.keys(this.getMaxWordCountOptions())[0];
        maxWordCountDropdownContext.dropdown_description = 'MAXIMALE WORTANZAHL';
        const maxWordCountDropdownOptions = [];

        for (const [key, value] of Object.entries(this.getMaxWordCountOptions())) {
            maxWordCountDropdownOptions.push({
                optionValue: key,
                optionLabel: value,
            });
        }

        delete maxWordCountDropdownOptions[Object.keys(this.getLanguageTypeOptions())[0]];
        maxWordCountDropdownContext.dropdown_options = maxWordCountDropdownOptions;

        const languageTypeDropdownContext = {};
        languageTypeDropdownContext.preference = 'languageType';
        languageTypeDropdownContext.dropdown_default = Object.values(this.getLanguageTypeOptions())[0];
        languageTypeDropdownContext.dropdown_default_value = Object.keys(this.getLanguageTypeOptions())[0];
        languageTypeDropdownContext.dropdown_description = 'ART DER SPRACHE';
        const languageTypeDropdownOptions = [];
        for (const [key, value] of Object.entries(this.getLanguageTypeOptions())) {
            languageTypeDropdownOptions.push({
                optionValue: key,
                optionLabel: value,
            });
        }
        delete languageTypeDropdownOptions[Object.keys(this.getLanguageTypeOptions)[0]];
        languageTypeDropdownContext.dropdown_options = languageTypeDropdownOptions;


        Object.assign(context, {
            modal_dropdowns: [
                maxWordCountDropdownContext,
                languageTypeDropdownContext,
            ]
        });

        return context;
    }
}

export default SummarizeHandler;



