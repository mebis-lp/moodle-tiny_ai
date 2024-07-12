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
 * Tiny AI utils library.
 *
 * @module      tiny_ai/utils
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// import Modal from 'core/modal';
import AiModal from './modal';
import Selectors from './selectors';
import {makeRequest} from 'local_ai_manager/make_request';
import {getPurposeConfig} from 'local_ai_manager/config';
import ModalEvents from 'core/modal_events';
import {getDraftItemId} from 'editor_tiny/options';
import {getString} from 'core/str';
import {alert, exception as displayException} from 'core/notification';
import {renderInfoBox} from 'local_ai_manager/render_infobox';
import {getContextId} from 'editor_tiny/options';
import {getUserId} from 'tiny_ai/options';
import {renderUserQuota} from 'local_ai_manager/userquota';
import {constants} from 'tiny_ai/constants';
import {selectionbarSource, toolbarSource, menubarSource} from 'tiny_ai/common';
import * as Renderer from 'tiny_ai/renderer';
import Templates from 'core/templates';


let userId = null;
let modal = null;

export const init = async (editor) => {
    userId = getUserId(editor)
}

/**
 * Shows and handles the dialog.
 *
 * @param {string} source the different sources from where the modal is being created, defined in common module
 */
export const displayDialogue = async (source) => {
    let mode;
    if (source === selectionbarSource) {
        mode = constants.modalModes.selection;
    } else if (source === toolbarSource || source === menubarSource) {
        mode = constants.modalModes.general;
    }

    await Renderer.init();

    // We initially render the modal without content, because we need to rerender it anyway.
    modal = await AiModal.create({
        templateContext: {
            classes: 'tiny_ai-modal--dialog',
            headerclasses: 'tiny_ai-modal--header'
        }
    });
    // Unfortunately, the modal will not execute any JS code in the template, so we need to rerender the modal as a whole again.
    await Renderer.renderStart(mode);
};

/**
 * Re-renders the content auf the modal once it has been created.
 *
 * @param bodyComponentTemplate the name of the body template to use (without the prefix 'tiny_ai/components/')
 * @param footerComponentTemplate the name of the footer template to use (without the prefix 'tiny_ai/components/')
 * @param templateContext the template context being used for all partial templates
 * @returns {Promise<void>} the async promise
 */
export const renderModalContent = async (bodyComponentTemplate, footerComponentTemplate, templateContext) => {
    const result = await Promise.all([
        Templates.renderForPromise('tiny_ai/components/moodle-modal-header-title', templateContext),
        Templates.renderForPromise('tiny_ai/components/' + bodyComponentTemplate, templateContext),
        Templates.renderForPromise('tiny_ai/components/' + footerComponentTemplate, templateContext)
    ]);
    if (templateContext.hasOwnProperty('modal_headline')) {
        // If there is no headline specified, we keep the old one.
        modal.setTitle(result[0].html);
    }
    modal.setBody(result[1].html);
    modal.setFooter(result[2].html);
    result.forEach((item) => {
        Templates.runTemplateJS(item.js);
    })
    await insertInfoBox();
    await insertUserQuotaBox();
};

export const insertInfoBox = async () => {
    // TODO extract used purposes
    const infoBoxSelector = '[data-rendertarget="infobox"]';
    if (document.querySelector(infoBoxSelector)) {
        await renderInfoBox('tiny_ai', userId, infoBoxSelector, ['singleprompt', 'tts', 'imggen']);
    }
};

export const insertUserQuotaBox = async () => {
    const usageBoxSelector = '[data-rendertarget="usageinfo"]';
    if (document.querySelector(usageBoxSelector)) {
        await renderUserQuota(usageBoxSelector, ['singleprompt', 'tts', 'imggen']);
    }
};

