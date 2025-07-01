import DOMUtil from "../lib/dom-util.js";
import PlataformData from '../data/plataform.js';
import CommDefer from "../comm/comm-defer.js";


const $liveList = document.querySelector('#lives');

async function update(){

	const lives = await PlataformData.getLives();

	DOMUtil.updateChidlrenByTemplate(
		$liveList,
		lives.map((live)=>{
			const tags = live.live_tags.map((tag)=>{
				return `<a>${tag}</a>`;
			})
			return Object.assign({}, live, {live_tags: tags.join('')});
		}),
		'live-item'
	);

	window.dispatchEvent(new CustomEvent('live-update', {detail: lives}));

	
}

async function loop(){
	const start = Date.now();
	await update();
	setTimeout(loop, 60000 - (Date.now() - start));
}

CommDefer.get('connected').then(loop);
