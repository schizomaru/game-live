import TwitchData from '../twitch/twitch-data.js';
import sortLives from './sort-lives.js';
import StorageSetting from "../storage/storage-setting.js";

const gameWeight = StorageSetting.get('game/weight');
const langWeight = StorageSetting.get('lang/weight');

class PlataformData {

	static async getLives(){

		const gameNameList = [...gameWeight.keys()];
		const langCodeList = [...langWeight.keys()];

		if(gameNameList.length < 20){
			const topGames = await TwitchData.getTopGames();
			for(let [id, game] of topGames){
				const {game_name} = game;
				if(!gameWeight.has(game_name)) 
					gameNameList.push(game_name);
				if(gameNameList.length >= 20) break;
			}
		}

		const requestList = await Promise.all([
			TwitchData.getLives(gameNameList, langCodeList)
		]);

		let liveList = [];
		for(let request of requestList){
			for(let live of request){
				liveList.push(live);
			}
		}

		return sortLives(liveList);

	}

	static async searchGame(name){
		const requestList = await Promise.all([
			TwitchData.searchGame(name)
		]);
		const result = [];
		for(let request of requestList){
			for(let data of request){
				result.push(data);
			}
		}
		return result;
	}

	static async getGames(){

		const gameNameList = [...gameWeight.keys()].sort();
		const requestList = await Promise.all([
			TwitchData.getGames(gameNameList)
		]);

		const gameList = [];
		const gameSet = new Set();
		for(let gameMap of requestList){
			for(let [id, game] of gameMap){
				const game_weight = gameWeight.get(game.game_name);
				game = Object.assign({game_weight}, game);
				gameList.push(game);
				gameSet.add(game.game_name);
			}
		}

		if(gameSet.size < 20) {
			let topGames = await TwitchData.getTopGames();
			for(let topGame of topGames){
				if(!gameSet.has(topGame.name)) {
					const game = Object.assign({game_weight: 1, isTop: true}, topGame);
					gameList.push(game);
					gameSet.add(game.game_name);
					if(gameSet.size >= 20) return gameList;
				}
			}
		}

		return gameList;
	}

}

export default PlataformData;