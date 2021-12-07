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

	//get current users playlists
	const playlist_url = "https://api.spotify.com/v1/me/playlists?limit=50";
	axios
		.get(playlist_url, options)
		.then((response) => {
			const playlists = response.data.items.map((playlist) => {
				return {
					id: playlist.id,
					name: playlist.name,
				};
			});
			res.json(playlists);
		})
		.catch((err) =>
			res.status(400).json({ error: "error accessing playlists" })
		);
});

export default router;
