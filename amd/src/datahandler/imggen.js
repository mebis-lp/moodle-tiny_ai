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
import * as BasedataHandler from "./basedata";

/**
 * Tiny AI data manager.
 *
 * @module      tiny_ai/datahandler/imggen
 * @copyright   2024, ISB Bayern
 * @author      Philipp Memmel
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const ImggenHandler = new _ImggenHandler();

class _ImggenHandler {

    imggenOptions = null;

    size = null;

    async getSizesOptions(){
        await this.loadImggenOptions();
        return this.imggenOptions.sizes;
    }

    setSize = (size) => {
        this.size = size;
    }

    getOptions() {
        if (this.size === null) {
            return {};
        }
        const options = {};
        if (this.size) {
            options['sizes'] = [this.size];
        }
        return options;
    }

    async loadImggenOptions() {
        if (this.imggenOptions === null) {
            const fetchedOptions = await AiConfig.getPurposeOptions('imggen');
            this.imggenOptions = JSON.parse(fetchedOptions.options);
        }
    }

    getTemplateContext = async () => {
        const context = {
            modal_headline: BasedataHandler.getTinyAiString('imggen_headline'),
            showIcon: true,
            tool: 'imggen',
            textareatype: 'prompt',
            placeholder: BasedataHandler.getTinyAiString('imggen_placeholder'),
        };

        const modalDropdowns = [];

        const sizesOptions = await ImggenHandler.getSizesOptions();
        console.log(sizesOptions)
        if (sizesOptions !== null && Object.keys(sizesOptions).length > 0) {
            const sizesDropdownContext = {};
            sizesDropdownContext.preference = 'sizes';
            sizesDropdownContext.dropdown_default = sizesOptions[0]['displayname'];
            sizesDropdownContext.dropdown_default_value = sizesOptions[0]['key'];
            sizesDropdownContext.dropdown_description = BasedataHandler.getTinyAiString('size');
            const sizesDropdownOptions = [];
            console.log(sizesOptions)
            sizesOptions.forEach(option => {
                sizesDropdownOptions.push({
                    optionValue: option.key,
                    optionLabel: option.displayname,
                });
            });
            sizesDropdownContext.dropdown_options = sizesDropdownOptions;
            modalDropdowns.push(sizesDropdownContext);
        }

        Object.assign(context, {
            modal_dropdowns: modalDropdowns
        });
        Object.assign(context, BasedataHandler.getBackAndGenerateButtonContext())
        return context;
    }
}

export default ImggenHandler;


