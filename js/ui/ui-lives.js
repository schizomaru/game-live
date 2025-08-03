import DOMUtil from "../lib/dom-util.js";
import PlataformData from '../data/plataform.js';
import CommDefer from "../comm/comm-defer.js";
import StorageSetting from "../storage/storage-setting.js";
import StorageCache from "../storage/storage-cache.js";
import {speak} from "../lib/speak.js";

const $liveList = document.querySelector('#lives');
const LOOP_MINUTES = 5;
const CACHE_MINUTES = LOOP_MINUTES * 3;

let prevLiveNodeMap = new Map();

const prevLiveDataMap = StorageCache.get('prevLives');


async function update(){

	const lives = await PlataformData.getLives();
	const newLiveDataSet = new Set();
	const nextLiveNodeMap = new Map();

	for(let live of lives){
		const {live_pid} = live;
		const data = Object.assign(
			{},
			live,
			{live_tags: live.live_tags.map((tag)=>{return `<a>${tag}</a>`}).join('')}
		);

		if(!prevLiveDataMap.has(live_pid)){
			newLiveDataSet.add(data);
		}
		prevLiveDataMap.put(live_pid, data, CACHE_MINUTES);


		let $node = prevLiveNodeMap.get(live_pid);
		$node = $node
			? DOMUtil.updateNode($node, 'live-item', data)
			: DOMUtil.generateNode('live-item', data);
		$liveList.appendChild($node);

		nextLiveNodeMap.set(live_pid, $node);

	}

	for(let [live_pid, $node] of prevLiveNodeMap){
		if(!prevLiveNodeMap.has(live_pid)){
			$node.remove();
		}
	}

	prevLiveNodeMap = nextLiveNodeMap;

	audioNotification(newLiveDataSet);

	window.dispatchEvent(new CustomEvent('live-update', {detail: lives}));
	
}

async function audioNotification(lives){
	const volume = StorageSetting.get('settings').get('audio-notification-volume') || 0;
	if(volume <= 0) return;

	const gameMap = new Map();

	for(let live of lives){
		const {game_name, user_name} = live;
		let info = gameMap.get(game_name);
		info
			? (info.count++)
			: (info = {count:1, user_name});
		gameMap.set(game_name, info);
	}

	const message = [...gameMap]
	.map((pair)=>{
		const [game_name, info] = pair;
		const {user_name, count} = info;
		return count > 1
			? `${count} channels are playing ${game_name}`
			: `${user_name} channel is playing ${game_name}`;
	}).join('; ');

	speak(message, volume);
}

async function loop(){
	const start = Date.now();
	await update();
	setTimeout(loop, (LOOP_MINUTES * 60000) - (Date.now() - start));
}

CommDefer.get('connected').then(loop);
