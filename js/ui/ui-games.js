import CommDefer from "../comm/comm-defer.js";
import CommEvent from '../comm/comm-event.js';
import DOMUtil from "../lib/dom-util.js";
import PlataformData from '../data/plataform.js';
import StorageSetting from "../storage/storage-setting.js";

const gameWeight = StorageSetting.get('game/weight');
const $gameForm = document.querySelector('#add-game-form');
const $gameList = document.querySelector('#game-list');
const $gameSearch = $gameForm.querySelector('#game-search');
const $gameSuggest = $gameForm.querySelector('#game-suggest');

async function update(){
	const games = await PlataformData.getGames();
	DOMUtil.updateChidlrenByTemplate($gameList, games, 'game-item');
}

$gameSearch.addEventListener('input', async ()=>{
	const prev = $gameSearch.value.trim();
	const results = await PlataformData.searchGame(prev);
	const next = $gameSearch.value.trim();
	if(prev !== next) return;
	$gameSuggest.innerHTML = results.map(({game_name})=>{
		return `<option value="${game_name}"></option>`;
	}).join("\n");
});

$gameForm.addEventListener('submit', ()=>{
	const gameName = $gameSearch.value;
	gameWeight.set(gameName, 50);
	$gameSearch.value = '';
	update();
});

CommEvent.delegate($gameList, 'click', '.game-delete', function(){
	const gameName = this.closest('.game-item').dataset.name;
	gameWeight.delete(gameName);
	update();
});

CommEvent.delegate($gameList, 'change', '.game-weight', function(){
	const gameName = this.closest('.game-item').dataset.name;
	gameWeight.set(gameName, this.value);
	update();
});

CommDefer.get('connected').then(update);