import StorageSetting from "../storage/storage-setting.js";

const generalSettings = StorageSetting.get('general');

async function speak(message){
	let voices = speechSynthesis.getVoices();
	if(voices.length === 0){
		await new Promise((done)=>{
			speechSynthesis.addEventListener('voiceschanged', done);
		});
		voices = speechSynthesis.getVoices();
	}

	let utterance = new SpeechSynthesisUtterance(message);
	const voiceIndex = generalSettings.has('voice-index') ? generalSettings.get('voice-index') : 4;
	utterance.voice = voices[voiceIndex];
	speechSynthesis.cancel();
	speechSynthesis.speak(utterance);
}

export {speak};

