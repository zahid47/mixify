import express from "express";
import { randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const base_url = process.env.base_url;
const client_id = process.env.client_id;
const redirect_uri = `${base_url}/callback`;
const state = randomBytes(6).toString("hex");
const scope = "playlist-modify-public";

router.get("/", (req, res) => {
	const login_url = "https://accounts.spotify.com/authorize?";

	const params = new URLSearchParams();
	params.append("response_type", "code");
	params.append("client_id", client_id);
	params.append("scope", scope);
	params.append("redirect_uri", redirect_uri);
	params.append("state", state);

	const final_login_url = login_url + params.toString();

	res.redirect(final_login_url);
});

export default router;
