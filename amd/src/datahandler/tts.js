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
 * @module      tiny_ai/datahandler/tts
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const TtsHandler = new _TtsHandler();

class _TtsHandler {

    targetLanguageOptions = {
        en: 'ENGLISCH',
        de: 'DEUTSCH',
        uk: 'UKRAINISCH',
    }

    voiceOptions = {
        'alloy': 'ALLOY',
        'echo': 'ECHO',
        'fable': 'FABLE'
    }

    targetLanguage = null;
    voice = null;

    setTargetLanguage = (targetLanguage) => {
        this.targetLanguage = targetLanguage;
    }

    setVoice = (voice) => {
        this.voice = voice;
    }

    getOptions() {
        if (this.targetLanguage === null && this.voice === null) {
            return {};
        }
        const options = {};
        options['languages'] = ['en-US'];
        options['voices'] = ['echo'];
        return options;
    }

    getPrompt() {
        // This handler handles both 'tts' and 'audiogen' tool types which basically are pretty much the same,
        // but not exactly.
        return DataManager.getCurrentTool() === 'tts' ? DataManager.getSelectionText() : '';
    }
}

export default TtsHandler;



