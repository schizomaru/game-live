import {AccessToken, client_id} from './twitch-auth.js';

async function twitchApi(href, params){
	if(!params) return false;
	const token = AccessToken.get();
	if(!token) return false;
	const url = new URL(href);
	url.search = params.toString();
	try {
		const response = await fetch(url.href, {
			headers: {
				'Client-ID': client_id,
				'Authorization': `Bearer ${token}`
			}
		});
		return await response.json();
	} catch(twitchApiError){
		console.error({twitchApiError});
	}
	return false;
}

class TwitchApiPaginator {

	constructor(href, params){
		this.href = href;
		this.params = params || new URLSearchParams();
		this.started = false;
	}

	add(k, v){
		this.params.append(k, v);
		return this;
	}

	async next(){
		let params = null;
		if(this.started){
			const cursor = this?.response?.pagination?.cursor;
			if(!cursor) return;
			params = new URLSearchParams();
			params.set('after', cursor);
		} else {
			params = this.params;
		}
		this.started = true;
		this.response = await twitchApi(this.href, params);
		return this?.response?.data;
	}

}

export default TwitchApiPaginator;