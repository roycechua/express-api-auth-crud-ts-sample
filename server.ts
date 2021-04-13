if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

import express, { Application, NextFunction, Request, Response } from "express";
import User from "./api/models/userModel";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";

import userRoutes from "./api/routes/userRoutes";

// Create express app
const app: Application = express();
// Get app port
const port = process.env.PORT || 3000;

// Connect to mongodb
const option = {
	// socketTimeoutMS: 30000,
	// keepAlive: true,
	// reconnectTries: 30000,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
};
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";
mongoose
	.connect(mongoURI, option)
	.then(() => {
		console.log("mongodb connection successful");
	})
	.catch((err) => console.error(err.message));

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
	if (
		req.headers &&
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "JWT"
	) {
		jwt.verify(
			req.headers.authorization.split(" ")[1],
			"RESTFULAPIs",
			(err, decode) => {
				// @ts-ignore
				if (err) req.user = undefined;
				// @ts-ignore
				req.user = decode;
				next();
			}
		);
	} else {
		// @ts-ignore
		req.user = undefined;
		next();
	}
});

app.use("/", userRoutes);

app.use((req : Request, res : Response) => {
	res.status(404).send({ url: req.originalUrl + ' not found' })
});

try {
	app.listen(port, (): void => {
		console.log(`Connected successfully on port ${port}`);
	});
} catch (error) {
	console.error(`Error occured: ${error.message}`);
}

export default app;