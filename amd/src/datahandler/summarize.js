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

import {makeRequest} from 'local_ai_manager/make_request';
import DataManager from 'tiny_ai/datamanager';
import {exception as displayException} from 'core/notification';
import {getString} from 'core/str';


/**
 * Tiny AI data manager.
 *
 * @module      tiny_ai/datamanager
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const SummarizeHandler = new _SummarizeHandler();

class _SummarizeHandler {

    languageTypeOptions = {
        nospeciallanguage: 'KEINE VERAENDERUNG DER SPRACHE',
        simplelanguage: 'EINFACHE SPRACHE',
        technicallanguage: 'FACHSPRACHE',
    }

    maxWordCountOptions = {
        0: 'KEIN MAXIMUM',
        10: '10',
        20: '20',
        50: '50',
        100: '100',
        200: '200',
        300: '300'
    };
    languageType = null;
    maxWordCount = 0;

    setMaxWordCount = (maxWordCount) => {
        this.maxWordCount = maxWordCount;
    }

    setLanguageType = (languageType) => {
        this.languageType = languageType;
    }

    getPrompt() {
        let prompt = 'Vereinfache den Text nachfolgenden Text.';
        if (parseInt(this.maxWordCount) !== 0) {
            prompt += ' Der Text darf aus höchstens ' + this.maxWordCount + ' Wörter bestehen.';
        }
        if (this.languageType !== 'nospeciallanguage') {
            prompt += ' Der Text muss in ' + this.languageTypeOptions[this.languageType] + ' verfasst sein.';
        }
        return prompt + '\nDer zu vereinfachende Text lautet:' + DataManager.getSelectionText();
    }

    async getAiAnswer() {
        let result = null;
        try {
            result = await makeRequest('singleprompt', this.getPrompt());
        } catch (exception) {
            displayException(exception);
        }
        if (result.code !== 200) {
            const errorString = await getString('errorwithcode', 'tiny_ai', result.code);
            await alert(errorString, result.result);
            return null;
        }
        console.log(result)
        return result.result;
    }

}

export default SummarizeHandler;



