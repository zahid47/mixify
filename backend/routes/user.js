import express from "express";
import axios from "axios";
import { decrypt } from "../utils/crypt.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
	const bread = req.query.bread;
	const access_token = decrypt(bread);

	const options = {
		headers: {
			Authorization: "Bearer " + access_token,
			"Content-Type": "application/json",
		},
	};

	//get current users name
	const user_url = "https://api.spotify.com/v1/me";
	axios
		.get(user_url, options)
		.then((response) => {
			const username = response.data.display_name;
			res.json({ username: username });
		})
		.catch((err) => res.status(400).json({ error: "error getting the user" }));
});

export default router;
