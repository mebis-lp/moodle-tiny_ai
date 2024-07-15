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
 * @module      tiny_ai/controllers/start
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {prefetchStrings} from 'core/prefetch';
import Log from 'core/log';
import BaseController from 'tiny_ai/controllers/base';
import * as Renderer from 'tiny_ai/renderer';
import DataManager from 'tiny_ai/datamanager';

export default class extends BaseController {

    async init() {
        const summarizeButton = this.baseElement.querySelector('[data-action="loadsummarize"]');
        const translateButton = this.baseElement.querySelector('[data-action="loadtranslate"]');
        const describeButton = this.baseElement.querySelector('[data-action="loaddescribe"]');
        const ttsButton = this.baseElement.querySelector('[data-action="loadtts"]');
        const audiogenButton = this.baseElement.querySelector('[data-action="loadaudiogen"]');
        const imggenButton = this.baseElement.querySelector('[data-action="loadimggen"]');

        if (summarizeButton) {
            summarizeButton.addEventListener('click', async(event) => {
                DataManager.setCurrentTool('summarize');
                await Renderer.renderSummarize();
            });
        }
        if (translateButton) {
            translateButton.addEventListener('click', async(event) => {
                DataManager.setCurrentTool('translate');
                await Renderer.renderTranslate();
            });
        }
        if (describeButton) {
            describeButton.addEventListener('click', async(event) => {
                DataManager.setCurrentTool('describe');
                await Renderer.renderDescribe();
            });
        }
        if (ttsButton) {
            ttsButton.addEventListener('click', async(event) => {
                DataManager.setCurrentTool('tts');
                await Renderer.renderTts();
            });
        }
        if (audiogenButton) {
            audiogenButton.addEventListener('click', async(event) => {
                DataManager.setCurrentTool('audiogen');
                await Renderer.renderAudiogen();
            });
        }
        if (imggenButton) {
            imggenButton.addEventListener('click', async(event) => {
                DataManager.setCurrentTool('imggen');
                await Renderer.renderImggen();
            });
        }
    }
}
