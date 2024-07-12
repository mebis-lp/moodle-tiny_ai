import {makeRequest} from 'local_ai_manager/make_request';
import * as AiConfig from 'local_ai_manager/config';

export const testSimplify = async() => {
    const aiConfig = await AiConfig.getAiConfig();
    const ttsOptions = await AiConfig.getPurposeOptions('tts');
    const receivedOptions = JSON.parse(ttsOptions.options);
    console.log(receivedOptions);

    // openai: nur voices
    // google synthesize: gender und languages

    const options = {};
    if (receivedOptions.hasOwnProperty('gender') && receivedOptions.gender.length > 0) {
        options['gender'] = [receivedOptions.gender[0].key];
    }
    //options['voices'] = [receivedOptions.voices[3].key];
    options['languages'] = ['en-US']
    options['itemid'] = 3;
    options['filename'] = 'test.mp3';
    console.log(options);
    const result = makeRequest('tts', 'Dieser Satz kein Verb, hallihallo', JSON.stringify(options))
    console.log(result)
}


