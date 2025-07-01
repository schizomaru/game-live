import CommEvent from './comm-event.js';
import CommDefer from './comm-defer.js';


let nextQueue = null;
let left = 0;

function flip(){
	const current = nextQueue;
	nextQueue = {
		event: new Map(),
		calls: new Set(),
		defer: new CommDefer()
	}
	return current;
}

flip();

function loop(){
	const now = Date.now();
	const {event, calls, defer} = flip();
	defer.done(now);
	for(let cb of calls) cb(now);
	for(let [ns, data] of event) CommEvent.fire(ns, data);
	(left-- > 0) ? requestAnimationFrame(loop) : (left = 0);
}

function schedule(){
	switch(left){
		case 0: requestAnimationFrame(loop);
		case 1: left++;
	}
}

class CommScheduler {

	static next(){
		return nextQueue.defer.wait;
	}

	static scheduleCall(cb){
		nextQueue.calls.add(cb);
		schedule();
	}

	static scheduleEvent(ns, data){
		nextQueue.event.set(ns, data);
		schedule();
	}

}

export default CommScheduler;