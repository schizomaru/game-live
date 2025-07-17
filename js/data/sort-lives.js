import StorageSetting from "../storage/storage-setting.js";

const gameWeight = StorageSetting.get('game/weight');
const langWeight = StorageSetting.get('lang/weight');
const tagsWeight = StorageSetting.get('tags/weight');
const wordWeight = StorageSetting.get('word/weight');
const settingWeight = StorageSetting.get('settings');

function clamp(min, val, max){
	return Math.max(min, Math.min(val, max));
}

function scoreLang({live_lang}){
	return (langWeight.get(live_lang) || 50) / 100;
}


function scoreTags({live_tags}){
	let count = 1;
	let sum = count * 100;
	for(let tag of live_tags){
		const weight = tagsWeight.get(tag);
		if(weight){
			sum += (weight * 2);
			count++;
		}
	}
	return (sum / count) / 100;
}

function scoreWord({live_name}, words){
	let count = 1;
	let sum = count * 100;
	for(let [word, weight, exp] of words){
		if(exp.test(live_name)) {
			sum += (weight * 2);
			count++;
		}
	}
	return (sum / count) / 100;
}

function scoreTime({live_min}, low_score_time, delta_score_time){
	const score = (live_min - low_score_time) / delta_score_time;
	return clamp(0, score, 1);
}

function scoreView({live_viewer_count}, low_score_view, delta_score_view){
	const score = (live_viewer_count - low_score_view) / delta_score_view;
	return clamp(0, score, 1);
}

function sortLives(liveList){

	const high_score_time = settingWeight.get('time/weight/high') || 1;
	const low_score_time = settingWeight.get('time/weight/low') || 120;
	const delta_score_time = high_score_time - low_score_time;

	const high_score_view = settingWeight.get('view/weight/high') || 0;
	const low_score_view = settingWeight.get('view/weight/low') || 20;
	const delta_score_view = high_score_view - low_score_view;

	const words = [];
	for(let [word, weight] of wordWeight){
		words.push([word, weight, new RegExp(`${word}`, 'i')]);
	}

	for(let live of liveList){
		const wordScore = scoreWord(live, words);
		const tagsScore = scoreTags(live);
		const timeScore = scoreTime(live, low_score_time, delta_score_time);
		const viewScore = scoreView(live, low_score_view, delta_score_view);
		const langScore = scoreLang(live);
		const game_weight = (gameWeight.get(live.game_name) || 1) / 100;
		live.live_score = 100 * ((game_weight + tagsScore + timeScore + viewScore + wordScore + langScore) / 6);
		live.live_pts = live.live_score.toFixed(1);
	}

	return liveList.sort((a, b)=>{
		return b.live_score - a.live_score;
	});

}

export default sortLives;