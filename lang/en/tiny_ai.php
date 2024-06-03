<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Plugin strings are defined here.
 *
 * @package     tiny_ai
 * @category    string
 * @copyright   2024, ISB Bayern
 * @author      Dr. Peter Mayer
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['additional_prompt'] = 'Additional Propmt';
$string['ai:view'] = 'View the AI button';
$string['errorwithcode'] = 'An error occured with error code {$a}';
$string['modaltitle'] = 'Select Purpose';
$string['more_options'] = 'More Options';
$string['nopurposesconfigured'] = 'No KI tools have been configured. Talk to your ByCS admin.';
$string['pluginname'] = 'Tiny AI Button';
$string['preview_heading'] = 'Preview';
$string['purposesinglepromptnotdefined'] = 'Your ByCS admin has not configured an AI tool for the purpose "singleprompt"';
$string['purposetranslatenotdefined'] = 'Your ByCS admin has not configured an AI tool for the purpose "translate"';
$string['purposettsnotdefined'] = 'Your ByCS admin has not configured an AI tool for the purpose "tts"';
$string['purposeimggennotdefined'] = 'Your ByCS admin has not configured an AI tool for the purpose "imggen"';
$string['prompt'] = 'Prompt';
$string['results_heading'] = 'Result';
$string['results_please_wait'] = 'Please wait! This may take a few seconds.';

$string['defaultprompt-simplify'] = 'Simplify the following text:';
$string['simplify'] = 'Simplify';
$string['startSimplification'] = 'Start Simplification';

$string['defaultprompt-translate'] = 'Translate the following text to {$a}:';
$string['startTranslation'] = 'Start Translation';
$string['translate'] = 'Translate';
$string['additional_prompt_translation'] = 'Additional prompt to give some more instructions.';

$string['defaultprompt-tts'] = '';

$string['outputlanguage'] = 'Outputlanguage';
$string['startTTS']='Get Audio';
$string['text-to-speech'] = 'Text to Speech';
$string['voice'] = 'Voice';

$string['defaultprompt-imggen'] = 'Create an image with these specs: ...';
$string['height'] = 'Height';
$string['image_generation'] = 'Imagegeneration';
$string['startimggen'] = 'Get Image';
$string['width'] = 'Width';

$string['freemode'] = 'Free pompting';
$string['startfree'] = 'Start output';

$string['confirm_no_userdata'] = 'Confirm that the prompt contains no personal data.';
$string['not_confirmed'] = 'Please confirm that no personal data is contained in the prompt before continuing';
