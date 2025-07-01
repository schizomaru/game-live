const eventMap = {};
const typeMap = {};
const delegateMap = new WeakMap();

function createDelegateTypeMap($parent){
	const typeMap = {};
	delegateMap.set($parent, typeMap);
	return typeMap;
}

function onDelegate(e){
	let ok = true;
	const typeMap = delegateMap.get(this);
	if(!typeMap) return ok;
	const {target, type} = e;
	const selectorMap = typeMap[type];
	if(!selectorMap) return ok;
	const selectorList = Object.keys(selectorMap);
	for(let selector of selectorList){
		const selectorTarget = target.closest(selector);
		if(selectorTarget){
			const listeners = selectorMap[selector];
			for(let listener of listeners){
				if(listener.call(selectorTarget, e) === false) ok = false;
			}
		}
	}
	return ok;
}

class CommEvent {


	static fire(ns, data){
		let ok = true;
		const cbs = eventMap[ns];
		if(cbs)
			for(let cb of cbs)
				if(cb(data) === false)
					ok = false;
		return ok;
	}

	static on(ns, cb){
		(eventMap[ns] || (eventMap[ns] = new Set())).add(cb);
	}

	static delegate($parent, type, selector, listener){
		const typeMap = delegateMap.get($parent) || createDelegateTypeMap($parent);
		let selectorMap = typeMap[type];
		if(!selectorMap){
			selectorMap = (typeMap[type] = {});
			$parent.addEventListener(type, onDelegate);
		}
		const listenerSet = selectorMap[selector] || (selectorMap[selector] = new Set());
		listenerSet.add(listener);
	}




}

export default CommEvent;