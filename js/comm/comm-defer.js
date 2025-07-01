const map = {};

class CommDefer {

	static get(name){
		return map[name] || new CommDefer(name);
	}

	constructor(name){
		this.wait = new Promise((done)=>{
			this.done = done;
		});
		if(name) map[name] = this;
	}

	then(data){
		return this.wait.then(data);
	}

}

export default CommDefer;