//TODO move to the implicit grant flow as we dont need the refresh token

import express from "express";
import axios from "axios";
import { Buffer } from "buffer";
import dotenv from "dotenv";
import { encrypt } from "../utils/crypt.js";
import { serialize } from "../utils/serialize.js";

dotenv.config();

const router = express.Router();
const base_url = process.env.BASE_URL;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = `${base_url}/callback`;
const frontend_url = process.env.FRONTEND_URL;

router.get("/", (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const error = req.query.error || null;

	if (state === null) {
		res.status(400).json({ error: "state missing" });
	} else if (state !== req.session.state) {
		res.status(400).json({ error: "state mismatch" });
	} else if (error != null) {
		res.status(400).json({ error: error });
	} else {
		const auth_url = "https://accounts.spotify.com/api/token";

		const data = {
			grant_type: "authorization_code",
			code: code,
			redirect_uri: redirect_uri,
		};

		const options = {
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
				"Content-Type": "application/x-www-form-urlencoded",
			},
			json: true,
		};

		//making the post req to get access_token
		axios
			.post(auth_url, serialize(data), options)
			.then((response) => {
				const access_token = response.data.access_token;
				const encrypted_access_token = encrypt(access_token);
				// res.json({ access_token: access_token });
				// res.json({ encrypted_access_token: encrypted_access_token });
				res
					.status(302)
					.redirect(`${frontend_url}/?bread=${encrypted_access_token}`);
			})
			.catch((err) => res.status(400).json({ error: "error authenticating" }));
	}
});
export default router;
