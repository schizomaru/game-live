import { AccessToken as TwitchAccessToken } from "../twitch/twitch-auth.js";
import CommDefer from "../comm/comm-defer.js";

if(TwitchAccessToken.get()){
	CommDefer.get('connected').done();
} else {
	const authItemTemplate = document.querySelector('template[data-name="auth-item"]').innerHTML;

	function connect(){
		TwitchAccessToken.request();
	}

	document.querySelectorAll('#games, #lives').forEach(($node)=>{
		$node.innerHTML = authItemTemplate;
		$node.querySelector('button[data-plataform]').addEventListener('click', connect);
	});
}


