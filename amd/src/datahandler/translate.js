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
import BaseHandler from 'tiny_ai/datahandler/base';
import {getTranslateHandler} from 'tiny_ai/utils';
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

export default class extends BaseHandler {

    languageNameInCurrentUserLanguage = new Intl.DisplayNames([Config.language], {type: 'language'});
    // English will always be added to the front of the list. All other languages can be defined here.
    // The user's current language will be shown right after English, if it is contained in this list.
    targetLanguageCodes = [
        'de', 'fr', 'it', 'es', 'cs', 'zh', 'ru', 'uk', 'el', 'la', 'tr', 'ro', 'pl', 'bg', 'ar', 'sq',
        'bs', 'sr', 'hr', 'ku', 'fa', 'ps', 'sk', 'hu'
    ];
    targetLanguageOptions = [];
    targetLanguage = null;

    constructor(uniqid) {
        super(uniqid);
        this.initTargetLanguages();
    }

    setTargetLanguage(targetLanguage) {
        this.targetLanguage = targetLanguage;
    }

    async getPrompt(selectionText) {
        const selectedLanguageEntry =
            this.targetLanguageOptions.filter(languageEntry => languageEntry.key === this.targetLanguage)[0];
        let prompt = await getString('translate_baseprompt', 'tiny_ai', selectedLanguageEntry.value);
        prompt += ': ' + selectionText;
        return prompt;
    }

    getTemplateContext() {
        const translateHandler = getTranslateHandler(this.uniqid);
        const context = {
            modal_headline: BasedataHandler.getTinyAiString('translate_headline'),
            showIcon: true,
            tool: 'translate',
        };
        const targetLanguageDropdownContext = {};
        targetLanguageDropdownContext.preference = 'targetLanguage';
        targetLanguageDropdownContext.dropdown_default = translateHandler.targetLanguageOptions[0].value;
        targetLanguageDropdownContext.dropdown_default_value = translateHandler.targetLanguageOptions[0].key;
        targetLanguageDropdownContext.dropdown_description = BasedataHandler.getTinyAiString('targetlanguage');
        const targetLanguageDropdownOptions = [];
        translateHandler.targetLanguageOptions.forEach(languageEntry => {
            targetLanguageDropdownOptions.push({
                optionValue: languageEntry.key,
                optionLabel: languageEntry.value,
            });
        });
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

    initTargetLanguages() {
        const firstLanguages = [
            {
                key: 'en',
                value: this.languageNameInCurrentUserLanguage.of('en')
            }
        ];
        if (Config.language !== 'en' && this.targetLanguageCodes.includes(Config.language)) {
            firstLanguages.push(
                {
                    key: Config.language,
                    value: this.languageNameInCurrentUserLanguage.of(Config.language)
                }
            );
            // Remove current user's language from the list.
            const index = this.targetLanguageCodes.indexOf(Config.language);
            this.targetLanguageCodes.splice(index, 1);
        }
        this.targetLanguageCodes.forEach(languageCode => {
            this.targetLanguageOptions[languageCode] = this.languageNameInCurrentUserLanguage.of(languageCode);
        });

        const sortedLanguages = Object
            .entries(this.targetLanguageOptions)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([key, value]) => ({'key': key, 'value': value}));
        this.targetLanguageOptions = [...firstLanguages, ...sortedLanguages];
    }
}
