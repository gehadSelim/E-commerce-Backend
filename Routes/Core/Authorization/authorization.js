const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
	try {
		const nonSecurePaths = ["/public/uploads/"];
		console.log(request.path.substring(0, 16));
		if (nonSecurePaths.includes(request.path.substring(0, 16))) {
			console.log("hi");
			next();
		} else {
			const token = request.get("authorization").split(" ")[1];
			const decodedToken = jwt.verify(token, process.env.SECRETKEY);
			request.role = decodedToken.role;
			request.id = decodedToken.id;
			next();
		}
	} catch (error) {
		console.log(error);
		error.message = "Not Authenticatedd";
		error.status = 401;
		next(error);
	}
};

module.exports.checkAdmin = (request, response, next) => {
	if (request.role == "admin") next();
	else {
		let error = new Error("Not Authorized");
		error.status = 403;
		next(error);
	}
};

module.exports.checkUser = (request, response, next) => {
	if (request.role == "user") next();
	else {
		let error = new Error("Not Authorized");
		error.status = 403;
		next(error);
	}
};

module.exports.checkAdminAndUser = (request, response, next) => {
	if (request.role == "admin" || request.role == "user") next();
	else {
		let error = new Error("Not Authorized");
		error.status = 403;
		next(error);
	}
};
