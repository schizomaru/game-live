import StorageCache from "../storage/storage-cache.js";
import TwitchApiPaginator from "./twitch-api.js";

class TwitchRequest {

	static async searchGame(term){
		const storage = StorageCache.get('twitch/game/search');
		const fromCache = storage.get(term);
		if(fromCache) return fromCache;

		const paginator = new TwitchApiPaginator('https://api.twitch.tv/helix/search/categories');
		let fromRequest = await paginator.add('query', term).add('first', 10).next();
		if(!fromRequest) return;
		
		storage.put(name, fromRequest, 60);
		return fromRequest;
	}

	static async getGame(name){
		const storage = StorageCache.get('twitch/games');
		const fromCache = storage.get(name);
		if(fromCache) return fromCache;

		const paginator = new TwitchApiPaginator('https://api.twitch.tv/helix/search/categories');
		let data = await paginator.add('query', name).add('first', 100).next();
		const fromRequest = (data || []).find((item)=>{return item.name === name;});
		if(!fromRequest) return;
		
		storage.put(name, fromRequest, 21600);
		return fromRequest;
	}

	static async getTopGames(){
		const storage = StorageCache.get('twitch/top-games');
		const fromCache = storage.get('all');
		if(fromCache) return fromCache;

		const paginator = new TwitchApiPaginator('https://api.twitch.tv/helix/games/top');
		const fromRequest = await paginator.add('first', 2).next();
		if(!fromRequest) return;
		if(!fromRequest.length) return;

		storage.put('all', fromRequest, 120);
		return fromRequest;
	}

	static async getGames(nameList){
		let list = await Promise.all(nameList.map(TwitchRequest.getGame));

		return list.filter((data)=>{
			return Boolean(data);
		});
	}

	static getUsersChunk(chunk){
		const paginator = new TwitchApiPaginator('https://api.twitch.tv/helix/users');
		for(let user_login of chunk) paginator.add('login', user_login);
		return paginator.next();
	}

	static async getUsers(userLoginList){
		const storage = StorageCache.get('twitch/users');

		let missingList = [];
		const resultList = [];

		for(let user_login of userLoginList){
			const fromCache = storage.get(user_login);
			fromCache ? resultList.push(fromCache) : missingList.push(user_login);
		}

		let chunks = [];
		while(missingList.length){
			chunks.push(TwitchRequest.getUsersChunk(missingList.splice(0, 99)));
		}
		chunks = await Promise.all(chunks);

		for(let chunk of chunks) {
			if(chunk){
				for(let fromRequest of chunk){
					storage.set(fromRequest.login, fromRequest);
					resultList.push(fromRequest);
				}
			}
		}

		return resultList;
	}

	static async getLives(gameIDList, langList){
		const paginator = new TwitchApiPaginator('https://api.twitch.tv/helix/streams');
		paginator.add('first', 100).add('type', 'live');
		for(let lang_code of langList) paginator.add('language', lang_code);
		for(let game_id of gameIDList) paginator.add('game_id', game_id);

		const langSet = new Set(langList);
		const idSet = new Set(gameIDList);

		function filter({language, game_id}){
			return langSet.has(language) && idSet.has(game_id);
		}

		const result = [];
		for(let chunk; chunk = await paginator.next();){
			chunk = chunk.filter(filter);
			if(chunk.length === 0) return result;
			for(let data of chunk)
				if(data)
					result.push(data);
		}
		return result;

	}

}

export default TwitchRequest;