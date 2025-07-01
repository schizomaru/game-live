const routeMap = {};

class CommRoute {

	static on(route, cb){
		routeMap[route] = cb;
	}

	static request(route, data){
		return routeMap[route] ? routeMap[route](data) : null;
	}

	static get(route){
		return routeMap[route];
	}

}

export default CommRoute;