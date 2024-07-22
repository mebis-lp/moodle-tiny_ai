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

import {constants} from '../constants';
import * as BasedataHandler from 'tiny_ai/datahandler/basedata';
import {getAiConfig} from 'local_ai_manager/config';
import {getMode} from 'tiny_ai/utils';


/**
 * Tiny AI data handler for start page.
 *
 * @module      tiny_ai/datahandler/start
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const StartHandler = new _StartHandler();

class _StartHandler {

    aiConfig = null;

    async init() {
        this.aiConfig = await getAiConfig();
    }

    getPurposeConfig = (tool) => {
        if (this.aiConfig === null) {
            throw new Error('Coding error: init function was not called before accessing this.getPurposeConfig!');
        }
        const toolPurpose = constants.toolPurposeMapping[tool];
        return this.aiConfig.purposes.filter(purpose => purpose['purpose'] === toolPurpose)[0];
    }

    // TODO Test if this logic is correct
    isToolDisabled = (tool) => {
        if (!this.aiConfig.tenantenabled && this.aiConfig.role !== 'role_basic') {
            return true;
        }
        if (this.aiConfig.userlocked) {
            return true;
        }
        const purposeInfo = this.getPurposeConfig(tool);
        if (!purposeInfo.isconfigured && this.aiConfig.role !== 'role_basic') {
            return true;
        }
        if (purposeInfo.limitreached) {
            return true;
        }
        return false;
    }

    // TODO Test if this logic is correct
    isToolHidden = (tool) => {
        if (this.aiConfig.role !== 'role_basic') {
            return false;
        }
        if (!this.aiConfig.tenantenabled) {
            return true;
        }
        const purposeInfo = this.getPurposeConfig(tool);
        if (!purposeInfo.isconfigured) {
            return true;
        }
        if (purposeInfo.limitreached) {
            return true;
        }
        return false;
    }

    getTemplateContext() {
        let toolButtons = [];

        switch (getMode()) {
            case 'selection':
                if (!this.isToolHidden('summarize')) {
                    toolButtons.push({
                        tool: BasedataHandler.getTinyAiString('toolname_summarize'),
                        description: BasedataHandler.getTinyAiString('toolname_summarize_extension'),
                        customicon: true,
                        iconname: 'shorten',
                        disabled: this.isToolDisabled('summarize'),
                        action: 'loadsummarize'
                    });
                }
                if (!this.isToolHidden('translate')) {
                    toolButtons.push({
                        tool: BasedataHandler.getTinyAiString('toolname_translate'),
                        description: BasedataHandler.getTinyAiString('toolname_translate_extension'),
                        iconname: 'language',
                        iconstyle: 'solid',
                        disabled: this.isToolDisabled('translate'),
                        action: 'loadtranslate'
                    });
                }
                if (!this.isToolHidden('describe')) {
                    toolButtons.push({
                        tool: BasedataHandler.getTinyAiString('toolname_describe'),
                        description: BasedataHandler.getTinyAiString('toolname_describe_extension'),
                        customicon: true,
                        iconname: 'extend',
                        disabled: this.isToolDisabled('describe'),
                        action: 'loaddescribe'
                    });
                }
                if (!this.isToolHidden('tts')) {
                    toolButtons.push({
                        tool: BasedataHandler.getTinyAiString('toolname_tts'),
                        description: BasedataHandler.getTinyAiString('toolname_tts_extension'),
                        iconstyle: 'solid',
                        iconname: 'microphone',
                        disabled: this.isToolDisabled('tts'),
                        action: 'loadtts'
                    });
                }
                break;
            case 'general':
                if (!this.isToolHidden('tts')) {
                    toolButtons.push({
                        tool: BasedataHandler.getTinyAiString('toolname_audiogen'),
                        iconstyle: 'solid',
                        iconname: 'microphone',
                        disabled: this.isToolDisabled('audiogen'),
                        action: 'loadaudiogen'
                    });
                }
                if (!this.isToolHidden('imggen')) {
                    toolButtons.push({
                        tool: BasedataHandler.getTinyAiString('toolname_imggen'),
                        iconstyle: 'solid',
                        iconname: 'image',
                        disabled: this.isToolDisabled('imggen'),
                        action: 'loadimggen'
                    });
                }
        }

        const templateContext = {
            showIcon: true,
            modal_headline: BasedataHandler.getTinyAiString('mainselection_heading'),
            action: 'loadfreeprompt',
            modal_buttons: toolButtons,
        };
        Object.assign(templateContext, BasedataHandler.getInputContext());
        return templateContext;
    }
}

export default StartHandler;
