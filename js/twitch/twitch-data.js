import TwitchRequest from './twitch-reques.js';


const GAME_SRC_RATIO = 3 / 4;
const LIVE_SRC_RATIO = 16 / 9;

function resize(url, ratio, dimension, value){
	let width = value;
	let height = value;
	(dimension === 'width') ? (height = Math.round(width / ratio)) : (width = Math.round(height * ratio));
	return url
	.replace('{width}', width)
	.replace('{height}', height)
	.replace(/-\d+x\d+./, `-${width}x${height}.`);
}

function slugify(name){
	name = name.toLowerCase();
	name = name.replace(/\W+/, '-');
	return name;
}

function translateGame({id, name, box_art_url}){
	return {
		game_pid: `twitch-game:${id}`,
		from: 'twitch',
		game_id: id,
		game_name: name,
		game_src: resize(box_art_url, GAME_SRC_RATIO, 'height', 200),
		game_href: `https://www.twitch.tv/directory/category/${slugify(name)}`
	};
}

function translateUser({id, login, display_name, profile_image_url}){
	return {
		user_pid:`twitch-user:${id}`,
		from: 'twitch',
		user_id: id,
		user_slug: login,
		user_name: display_name,
		user_href: `https://www.twitch.tv/${login}`,
		user_src: resize(profile_image_url, 1, 'width', 50)
	}
}

function translateLive({id, title, tags, viewer_count, started_at, language, thumbnail_url, is_mature}){
	const minutes = (Date.now() - (new Date(started_at)).getTime()) / 60000;
	return {
		live_pid: `twitch-live:${id}`,
		from: 'twitch',
		live_id: id,
		live_name: title,
		live_tags: tags,
		live_viewer_count: viewer_count,
		live_started_at: started_at,
		live_min: minutes,
		live_minutes: minutes.toFixed(0),
		live_lang: language,
		live_src: resize(thumbnail_url, LIVE_SRC_RATIO, 'width', 480) + `?ts=${Date.now()}`,
		live_is_mature: is_mature
	}
}


class TwitchData {

	static async getGames(gameNameList){
		const gameList = await TwitchRequest.getGames(gameNameList);

		return (gameList || []).reduce((acc, game)=>{
			return acc.set(game.id, translateGame(game));
		}, new Map());
	}

	static async searchGame(term){
		const gameList = await TwitchRequest.searchGame(term);
		return (gameList || []).map(translateGame);
	}

	static async getTopGames(){
		const gameList = await TwitchRequest.getTopGames();
		return (gameList || []).reduce((acc, game)=>{
			switch(game.name){
				case 'Just Chatting':
				case 'IRL':
					return acc;
			}
			return acc.set(game.id, translateGame(game));
		}, new Map());
	}

	static async getLives(gameNameList, langCodeList){

		const gameMap = await TwitchData.getGames(gameNameList);

		let liveList = await TwitchRequest.getLives(
			[...gameMap.keys()], langCodeList
		);

		const userList = await TwitchRequest.getUsers(liveList.map(({user_login})=>{return user_login}));

		const userMap = userList.reduce((acc, user)=>{
			return acc.set(user.id, translateUser(user));
		}, new Map());

		return liveList
		.map((live)=>{
			const user = userMap.get(live.user_id);
			const game = gameMap.get(live.game_id);
			live = translateLive(live);
			live = Object.assign(live, user, game);
			return live;
		});
	}

}

export default TwitchData;
