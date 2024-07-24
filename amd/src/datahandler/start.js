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
        console.log(tool)
        const toolPurpose = constants.toolPurposeMapping[tool];
        return this.aiConfig.purposes.filter(purpose => purpose['purpose'] === toolPurpose)[0];
    }

    isTinyAiDisabled() {
        if (!this.aiConfig.tenantenabled) {
            return 'TENANT NICHT AKTIV, BYCS ADMIN MUSS AKTIVIEREN';
        }
        if (!this.aiConfig.userconfirmed) {
            return 'NICHT BESTÄTIGT, HIER IST DER LINK: /local/ai_manager/confirm_ai_usage.php';
        }
        if (this.aiConfig.userlocked) {
            return 'IHR NUTZER WURDE DURCH DEN BYCS ADMIN GESPERRT';
        }
        return '';
    }

    isToolDisabled(tool) {
        if (this.isTinyAiDisabled()) {
            return this.isTinyAiDisabled();
        }
        const purposeInfo = this.getPurposeConfig(tool);
        if (!purposeInfo.isconfigured) {
            return 'FÜR DIESEN ZWECK IST KEIN KI-TOOL HINTERLEGT, BITTE MIT DEM BYCS ADMIN SPRECHEN';
        }
        if (purposeInfo.limitreached) {
            return 'SIE HABEN BEREITS DAS LIMIT DER KI-NUTZUNG IM ENTSPRECHENDEN ZEITRAUM ERREICHT.'
                + ' BITTE WARTEN, BIS DER COUNTER ZURÜCKGESETZT WIRD';
        }

        if (getMode() === constants.modalModes.selection) {
            return ['audiogen', 'imggen'].includes(tool) ? 'DIESES TOOL IST NUR VERFÜGBAR, WENN TEXT MARKIERT WURDE' : '';
        } else if (getMode() === constants.modalModes.general) {
            return ['summarize', 'translate', 'describe', 'tts'].includes(tool) ? 'DIESES TOOL IST NUR VERFÜGBAR, WENN KEIN TEXT MARKIERT WURDE' : '';
        }
    }

    // TODO Test if this logic is correct
    isToolHidden(tool) {
        const purposeInfo = this.getPurposeConfig(tool);
        // If the tenant is not allowed the plugin is being disabled completely, so we do not need
        // to check this case here.
        if (this.aiConfig.role === 'role_basic') {
            if (!this.aiConfig.tenantenabled) {
                return true;
            }
            if (!purposeInfo.isconfigured) {
                return true;
            }
        }
        return false;
    }

    getTemplateContext() {
        let toolButtons = [];

        if (!this.isToolHidden('summarize')) {
            toolButtons.push({
                toolname: 'summarize',
                tool: BasedataHandler.getTinyAiString('toolname_summarize'),
                description: BasedataHandler.getTinyAiString('toolname_summarize_extension'),
                customicon: true,
                iconname: 'shorten',
                disabled: this.isToolDisabled('summarize').length > 0,
                action: 'loadsummarize'
            });
        }
        if (!this.isToolHidden('translate')) {
            toolButtons.push({
                toolname: 'translate',
                tool: BasedataHandler.getTinyAiString('toolname_translate'),
                description: BasedataHandler.getTinyAiString('toolname_translate_extension'),
                iconname: 'language',
                iconstyle: 'solid',
                disabled: this.isToolDisabled('translate').length > 0,
                action: 'loadtranslate'
            });
        }
        if (!this.isToolHidden('describe')) {
            toolButtons.push({
                toolname: 'describe',
                tool: BasedataHandler.getTinyAiString('toolname_describe'),
                description: BasedataHandler.getTinyAiString('toolname_describe_extension'),
                customicon: true,
                iconname: 'extend',
                disabled: this.isToolDisabled('describe').length > 0,
                action: 'loaddescribe'
            });
        }
        if (!this.isToolHidden('tts')) {
            toolButtons.push({
                toolname: 'tts',
                tool: BasedataHandler.getTinyAiString('toolname_tts'),
                description: BasedataHandler.getTinyAiString('toolname_tts_extension'),
                iconstyle: 'solid',
                iconname: 'microphone',
                disabled: this.isToolDisabled('tts').length > 0,
                action: 'loadtts'
            });
        }
        if (!this.isToolHidden('audiogen')) {
            toolButtons.push({
                toolname: 'audiogen',
                tool: BasedataHandler.getTinyAiString('toolname_audiogen'),
                iconstyle: 'solid',
                iconname: 'microphone',
                disabled: this.isToolDisabled('audiogen').length > 0,
                action: 'loadaudiogen'
            });
            console.log(this.isToolDisabled('audiogen'));
        }
        if (!this.isToolHidden('imggen')) {
            toolButtons.push({
                toolname: 'imggen',
                tool: BasedataHandler.getTinyAiString('toolname_imggen'),
                iconstyle: 'solid',
                iconname: 'image',
                disabled: this.isToolDisabled('imggen').length > 0,
                action: 'loadimggen'
            });
        }
        // We sort the not disabled tools to the top while keeping the groups "disabled tools" and "not disabled tools" in the same order inside the groups.
        toolButtons.sort((a, b) => {
            if (a.disabled && !b.disabled) {
                return 1;
            } else if (b.disabled && !a.disabled) {
                return -1;
            } else {
                return 0;
            }
        })

        const templateContext = {
            showIcon: true,
            modal_headline: BasedataHandler.getTinyAiString('mainselection_heading'),
            action: 'loadfreeprompt',
            modal_buttons: toolButtons,
            freeprompthidden: true
        };
        Object.assign(templateContext, BasedataHandler.getInputContext());
        if (this.isTinyAiDisabled()) {
            templateContext.input[0].disabled = true;
            templateContext.input[0].hasError = true;
            templateContext.input[0].errorMessage = this.isTinyAiDisabled();
        }
        if (this.isToolDisabled('freeprompt')) {
            templateContext.input[0].disabled = true;
        }
        return templateContext;
    }
}

export default StartHandler;
