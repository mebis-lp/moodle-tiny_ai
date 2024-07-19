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
import * as AiConfig from 'local_ai_manager/config';

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

    ttsOptions = null;

    targetLanguage = null;
    voice = null;
    gender = null;

    async getTargetLanguageOptions(){
        await this.loadTtsOptions();
        console.log(this.ttsOptions.languages)
        return this.ttsOptions.languages;
    }

    async getVoiceOptions() {
        await this.loadTtsOptions();
        console.log(this.ttsOptions.voices);
        return this.ttsOptions.voices;
    }

    async getGenderOptions() {
        await this.loadTtsOptions();
        return this.ttsOptions.gender;
    }

    setTargetLanguage = (targetLanguage) => {
        this.targetLanguage = targetLanguage;
    }

    setVoice = (voice) => {
        this.voice = voice;
    }

    setGender = (gender) => {
        this.gender = gender;
    }

    getOptions() {
        if (this.targetLanguage === null && this.voice === null) {
            return {};
        }
        const options = {};
        if (this.targetLanguage) {
            options['languages'] = [this.targetLanguage];
        }
        if (this.voice) {
            options['voices'] = [this.voice];
        }
        if (this.gender) {
            options['gender'] = [this.gender];
        }
        return options;
    }

    getPrompt() {
        // This handler handles both 'tts' and 'audiogen' tool types which basically are pretty much the same,
        // but not exactly.
        return DataManager.getCurrentTool() === 'tts' ? DataManager.getSelectionText() : '';
    }

    async loadTtsOptions() {
        if (this.ttsOptions === null) {
            const fetchedOptions = await AiConfig.getPurposeOptions('tts');
            this.ttsOptions = JSON.parse(fetchedOptions.options);
        }
    }
}



export default TtsHandler;



