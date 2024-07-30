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

$string['additional_prompt'] = 'Zusätzlicher Prompt';
$string['aigenerating'] = 'KI generiert...';
$string['aisuggestion'] = 'KI-Vorschlag';
$string['aiwarning'] = 'Vertraue nicht blind KI-generierten Inhalten...';
$string['ai:view'] = 'Die AI-Schaltfläche anzeigen';
$string['audiogen_headline'] = 'Audio aus Text generieren';
$string['audiogen_placeholder'] = 'Text eingeben oder einfügen, der in Audio umgewandelt werden soll';
$string['back'] = 'Zurück';
$string['backbutton_tooltip'] = 'Zurück zur vorherigen Seite';
$string['cancel'] = 'Abbrechen';
$string['deletebutton_tooltip'] = 'Aktuelles Ergebnis verwerfen und zurück zur Einstellungsseite';
$string['describe_headline'] = 'Ausführliche Beschreibung des markierten Texts';
$string['describe_baseprompt'] = 'Beschreibe den nachfolgenden Text';
$string['dismiss'] = 'Verwerfen';
$string['dismisssuggestion'] = 'Möchtest du den KI-Vorschlag verwerfen?';
$string['errorwithcode'] = 'Ein Fehler ist aufgetreten, Fehlercode: {$a}';
$string['error_nopromptgiven'] = 'Kein Prompt angegeben. Bitte einen Prompt eintippen oder einfügen.';
$string['error_tiny_ai_notavailable'] = 'Die KI-Funktionen stehen Ihnen nicht zur Verfügung.';
$string['freepromptbutton_tooltip'] = 'Generiere KI-Antwort';
$string['freeprompt_placeholder'] = 'Gib der KI eine beliebige Anweisung...';
$string['gender'] = 'Geschlecht';
$string['generalerror'] = 'Ein Fehler ist aufgetreten';
$string['generate'] = 'Jetzt generieren';
$string['generatebutton_tooltip'] = 'KI eine Antwort generieren lassen';
$string['generating'] = 'Die KI-Antwort wird generiert...';
$string['hideprompt'] = 'Prompt ausblenden';
$string['imggen_headline'] = 'Bildgenerierung';
$string['imggen_placeholder'] = 'Beschreibung des Bilds hier eingeben oder einfügen';
$string['insertatcaret'] = 'Bei Cursor einfügen';
$string['insertatcaret_tooltip'] = 'Aktuelles Ergebnis an der Cursor-Position einfügen';
$string['insertbelow'] = 'Unten einfügen';
$string['insertbelow_tooltip'] = 'Aktuelles Ergebnis an den Editor-Inhalt anhängen';
$string['keeplanguagetype'] = 'Sprache unverändert lassen';
$string['languagetype'] = 'Art der Sprache';
$string['languagetype_prompt'] = 'Der Text muss {$a} nutzen';
$string['mainselection_heading'] = 'Wobei soll dir die KI helfen?';
$string['maxwordcount'] = 'Maximale Wortanzahl';
$string['maxwordcount_prompt'] = 'Der Text darf nicht mehr als {$a} Wörter beinhalten';
$string['more_options'] = 'Mehr Optionen';
$string['nomaxwordcount'] = 'Keine Beschränkung';
$string['nopurposesconfigured'] = 'Es wurden keine KI-Tools konfiguriert. Wenden Sie sich an Ihren ByCS-Admin.';
$string['pluginname'] = 'KI-Tools';
$string['prompt'] = 'Prompt';
$string['purposesinglepromptnotdefined'] = 'Ihr ByCS-Admin hat kein KI-Tool für den Zweck "singleprompt" konfiguriert.';
$string['purposetranslatenotdefined'] = 'Ihr ByCS-Admin hat kein KI-Tool für den Zweck "translate" konfiguriert.';
$string['purposettsnotdefined'] = 'Ihr ByCS-Admin hat kein KI-Tool für den Zweck "tts" konfiguriert.';
$string['purposeimggennotdefined'] = 'Ihr ByCS-Admin hat kein KI-Tool für den Zweck "imggen" konfiguriert.';
$string['regeneratebutton_tooltip'] = 'Prompt verbessern und erneut generieren';
$string['replaceselection'] = 'Auswahl ersetzen';
$string['replaceselection_tooltip'] = 'Auswahl mit dem aktuellen Ergebnis ersetzen';
$string['results_heading'] = 'Ergebnis';
$string['results_please_wait'] = 'Bitte warten! Dies kann ein paar Sekunden dauern.';
$string['reworkprompt'] = 'Prompt überarbeiten';
$string['selectionbarbuttontitle'] = 'KI-Funktionen auf markierten Text anwenden';
$string['showprompt'] = 'Prompt anzeigen';
$string['showpromptbutton_tooltip'] = 'Prompt anzeigen/ausblenden';
$string['simplelanguage'] = 'Einfache Sprache';
$string['size'] = 'Größe';
$string['summarize_headline'] = 'Zusammenfassen des markierten Texts';
$string['summarize_baseprompt'] = 'Fasse den folgenden Text zusammen';
$string['targetlanguage'] = 'Ausgabesprache';
$string['technicallanguage'] = 'Fachsprache';
$string['texttouse'] = 'Der Text lautet';
$string['toolbarbuttontitle'] = 'KI-Funktionen';
$string['toolname_audiogen'] = 'Audiogenerierung';
$string['toolname_describe'] = 'Ausführliche Beschreibung';
$string['toolname_describe_extension'] = 'des markierten Textes';
$string['toolname_imggen'] = 'Bildgenerierung';
$string['toolname_summarize'] = 'Zusammenfassen';
$string['toolname_summarize_extension'] = 'des markierten Textes';
$string['toolname_translate'] = 'Übersetzen';
$string['toolname_translate_extension'] = 'des markierten Textes';
$string['toolname_tts'] = 'Audio erstellen';
$string['toolname_tts_extension'] = 'aus dem markierten Text';
$string['translate_headline'] = 'Übersetzen des markierten Texts';
$string['translate_baseprompt'] = 'Übersetze den folgenden Text in die Sprache {$a} und gib dabei ausschließlich den übersetzten Text aus';
$string['tts_headline'] = 'Audio aus markiertem Text generieren';
$string['voice'] = 'Stimme';
