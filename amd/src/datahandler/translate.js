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

import * as BasedataHandler from 'tiny_ai/datahandler/basedata';
import Config from 'core/config';
import {getString} from 'core/str';

/**
 * Tiny AI data manager.
 *
 * @module      tiny_ai/datahandler/translate
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const TranslateHandler = new _TranslateHandler();

class _TranslateHandler {

    languageNameInCurrentUserLanguage = new Intl.DisplayNames([Config.language], {type: 'language'});

    targetLanguageOptions = {
        en: this.languageNameInCurrentUserLanguage.of('en'),
        de: this.languageNameInCurrentUserLanguage.of('de'),
        it: this.languageNameInCurrentUserLanguage.of('it'),
        es: this.languageNameInCurrentUserLanguage.of('es'),
        ru: this.languageNameInCurrentUserLanguage.of('ru'),
        uk: this.languageNameInCurrentUserLanguage.of('uk'),
        zh: this.languageNameInCurrentUserLanguage.of('zh'),
    };
    targetLanguage = null;


    setTargetLanguage(targetLanguage) {
        this.targetLanguage = targetLanguage;
    }

    async getPrompt(selectionText) {
        let prompt = await getString('translate_baseprompt', 'tiny_ai', this.targetLanguageOptions[this.targetLanguage]);
        prompt += ': ' + selectionText;
        return prompt;
    }

    getTemplateContext() {
        const context = {
            modal_headline: BasedataHandler.getTinyAiString('translate_headline'),
            showIcon: true,
            tool: 'translate',
        };
        const targetLanguageDropdownContext = {};
        targetLanguageDropdownContext.preference = 'targetLanguage';
        targetLanguageDropdownContext.dropdown_default = Object.values(TranslateHandler.targetLanguageOptions)[0];
        targetLanguageDropdownContext.dropdown_default_value = Object.keys(TranslateHandler.targetLanguageOptions)[0];
        targetLanguageDropdownContext.dropdown_description = BasedataHandler.getTinyAiString('targetlanguage');
        const targetLanguageDropdownOptions = [];
        for (const [key, value] of Object.entries(TranslateHandler.targetLanguageOptions)) {
            targetLanguageDropdownOptions.push({
                optionValue: key,
                optionLabel: value,
            });
        }
        targetLanguageDropdownContext.dropdown_options = targetLanguageDropdownOptions;

        Object.assign(context, {
            modal_dropdowns: [
                targetLanguageDropdownContext,
            ]
        });
        Object.assign(context, BasedataHandler.getShowPromptButtonContext());
        Object.assign(context, BasedataHandler.getBackAndGenerateButtonContext());
        return context;
    }
}

export default TranslateHandler;
