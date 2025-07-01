import CommScheduler from "../comm/comm-schedule.js";

const instanceMap = {};

const HOUR_MS = 1000 * 60 * 60;

class StorageCache extends Map {

	static get(name){
		return instanceMap[name] || new StorageCache(name);
	}

	#storageKey;
	#schedule;
	#expire;

	constructor(name, expire){
		super();
		instanceMap[name] = this;
		this.#storageKey = `cache/${name}`;
		this.#schedule = ()=>{this.save();};
		this.#expire = expire || 60;
		this.load();
	}

	get storageKey(){
		return this.#storageKey;
	}

	set(key, value){
		return this.put(key, value, 1);
	}

	put(key, value, expireMinutes){
		const result = super.set(key, {
			value,
			expire: Math.round(Date.now() + (HOUR_MS * expireMinutes))
		});
		CommScheduler.scheduleCall(this.#schedule);
		return result;
	}

	get(k, v){
		const r = super.get(k);
		return r ? r.value : null;
	}

	delete(key){
		const result = super.delete(key);
		CommScheduler.scheduleCall(this.#schedule);
		return result;
	}

	save(){
		const data = [];
		const now = Date.now();
		for(let [key, entry] of this) 
			if(entry.expire > now)
				data.push([entry.expire, key, entry.value]);
		localStorage.setItem(this.storageKey, JSON.stringify(data));
	}

	load(){
		const json = localStorage.getItem(this.storageKey);
		if(!json) return;
		const list = JSON.parse(json);
		const now = Date.now();
		for(let [expire, key, value] of list)
			if(expire > now)
				super.set(key, {value, expire});
		CommScheduler.scheduleCall(this.#schedule);
	}


}

export default StorageCache;