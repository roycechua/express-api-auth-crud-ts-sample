import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { UserDocument } from "../models/userModel";
import { NextFunction, Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
	let newUser = new User(req.body);
	newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
	newUser.save(function (err, user) {
		if (err) return res.status(400).send({ message: err });
		// @ts-ignore
		user.hash_password = undefined;
		return res.json(user);
	});
};

export const sign_in = async (req: Request, res: Response) => {
	User.findOne(
		{
			email: req.body.email,
		},
		function (err: Error, user: UserDocument) {
			if (err) throw err;
			// @ts-ignore
			if (!user || !user.comparePassword(req.body.password)) {
				return res.status(401).json({
					message: "Authentication Failed. Invalid user or password.",
				});
			}
			return res.json({
				token: jwt.sign(
					{
						email: user.email,
						fullName: user.fullName,
						_id: user._id,
					},
					"RESTFULAPIs"
				),
			});
		}
	);
};

export const loginRequired = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// @ts-ignore
	if (req.user) {
		next();
	} else {
		return res.status(401).json({ message: "Unauthorized user!!" });
	}
};

export const profile = (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	if (req.user) {
		// @ts-ignore
		res.send(req.user);
		next();
	} else {
		return res.status(401).json({ message: 'Invalid token '});
	}
};
