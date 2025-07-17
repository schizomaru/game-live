import DOMUtil from "../lib/dom-util.js";
import PlataformData from '../data/plataform.js';
import CommDefer from "../comm/comm-defer.js";
import StorageSetting from "../storage/storage-setting.js";
import {speak} from "../lib/speak.js";


const $liveList = document.querySelector('#lives');

let prevLives = new Map();

async function update(){

	const lives = await PlataformData.getLives();
	const nextLives = new Map();

	for(let live of lives){
		const {live_pid} = live;
		const data = Object.assign(
			{},
			live,
			{live_tags: live.live_tags.map((tag)=>{return `<a>${tag}</a>`}).join('')}
		);

		let $node = prevLives.get(live_pid);
		$node = $node
			? DOMUtil.updateNode($node, 'live-item', data)
			: DOMUtil.generateNode('live-item', data);
		$liveList.appendChild($node);

		nextLives.set(live_pid, $node);

	}

	for(let [live_pid, $node] of prevLives){
		if(!nextLives.has(live_pid)){
			$node.remove();
		}
	}

	prevLives = nextLives;

	audioNotification(lives);

	window.dispatchEvent(new CustomEvent('live-update', {detail: lives}));

	
}

async function audioNotification(lives){
	if(!StorageSetting.get('settings').has('enable/audio-notification')) return;

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

	speak(message);
}

async function loop(){
	const start = Date.now();
	await update();
	setTimeout(loop, 300000 - (Date.now() - start));
}

CommDefer.get('connected').then(loop);
