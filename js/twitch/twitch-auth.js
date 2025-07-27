import StorageSetting from '../storage/storage-setting.js';

const settings = StorageSetting.get('plataform/twitch');

const client_id = 'ks06teefgouzmbw14f42f5whrri4kf';

class AccessToken {

	static get(){
		return settings.get('access-token');
	}

	static request(){
		const oauhtURL = new URL('https://id.twitch.tv/oauth2/authorize');
		const {searchParams} = oauhtURL;
		searchParams.set('client_id', client_id);
		searchParams.set('redirect_uri', `${location.protocol}//${location.host}${location.pathname}`);
		searchParams.set('response_type', 'token');
		location.href = oauhtURL.href;
	}

	static check(){
		if(location.hash){
			try {
				const authResponseParams = new URLSearchParams(location.hash.substring(1));
				const access_token = authResponseParams.get('access_token');
				if(access_token){
					settings.set('access-token', access_token);
					return true;
				}
			} catch(error){}
		}
		return false;
	}

}

AccessToken.check();

export {AccessToken, client_id};
