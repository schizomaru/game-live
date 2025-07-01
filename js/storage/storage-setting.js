import CommScheduler from "../comm/comm-schedule.js";

const instancesMap = {};

class StorageSetting extends Map {

	static get(name){
		return instancesMap[name] || new StorageSetting(name);
	}

	#storageKey;
	#schedule;

	constructor(name){
		super();
		instancesMap[name] = this;
		this.#storageKey = `setting/${name}`;
		this.#schedule = ()=>{this.save();};
		this.load();
	}

	get storageKey(){
		return this.#storageKey;
	}

	set(key, value){
		const result = super.set(key, value);
		CommScheduler.scheduleCall(this.#schedule);
		return result;
	}

	delete(key){
		const result = super.delete(key);
		CommScheduler.scheduleCall(this.#schedule);
		return result;
	}

	save(){
		const data = [];
		const now = Date.now();
		for(let [key, value] of this) 
			data.push([key, value]);
		localStorage.setItem(this.storageKey, JSON.stringify(data));
	}

	load(){
		const json = localStorage.getItem(this.storageKey);
		if(!json) return;
		const list = JSON.parse(json);
		const now = Date.now();
		for(let [key, value] of list)
			super.set(key, value);
		CommScheduler.scheduleCall(this.#schedule);
	}


}

export default StorageSetting;