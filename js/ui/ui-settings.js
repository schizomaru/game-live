import StorageSetting from "../storage/storage-setting.js";

const settingWeight = StorageSetting.get('settings');
const $settings = document.querySelector('#settings');


function checkboxSetup($node){
	const settingKey = $node.dataset.setting;
	$node.checked = settingWeight.has(settingKey);

	$node.onchange = ()=>{
		$node.checked
			? settingWeight.set(settingKey, '1')
			: settingWeight.delete(settingKey);
	}
}

function numberSetup($node){
	const settingKey = $node.dataset.setting;
	$node.value = settingWeight.get(settingKey);

	$node.oninput = ()=>{
		settingWeight.set(settingKey, Number($node.value));
	}
}

function inputSetup($node){
	const settingKey = $node.dataset.setting;
	$node.value = settingWeight.get(settingKey);

	$node.oninput = ()=>{
		settingWeight.set(settingKey, $node.value);
	}
}



$settings.querySelectorAll('[data-setting]').forEach(($node)=>{
	switch($node.type){
		case 'checkbox': return checkboxSetup($node);
		case 'range':
		case 'number': return numberSetup($node);
	}
	return inputSetup($node);
})