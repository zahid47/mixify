//TODO [optimization] get as much info as possible with /login and  /callback so we can make less api calls to spotify
//TODO switch to spotify "Client credentials" or "Implicit grant" flow because i dont need refresh token
//TODO [future] create a ML model to classify if a song X is a remix of song Y

import express from "express";
import axios from "axios";
import { Buffer } from "buffer";
import cors from "cors";
import dotenv from "dotenv";
import { randomBytes } from "crypto";
import { encrypt, decrypt } from "./utils.js";

dotenv.config();

const app = express();
const base_url = process.env.base_url;
const PORT = process.env.PORT || 8000;

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = `${base_url}/callback`;
const state = randomBytes(6).toString("hex");
const scope = "playlist-modify-public";

app.use(
	cors({
		origin: process.env.frontend_url,
		methods: ["GET"],
	})
);

app.get("/", (req, res) => {
	res.status(200).json({ msg: "welcome to mixify" });
});

app.get("/login", (req, res) => {
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

app.get("/callback", (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const error = req.query.error || null;

	//encode a js obj into a querystring https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object/1714899#1714899
	const serialize = (obj) => {
		var str = [];
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		}
		return str.join("&");
	};

	if (state === null) {
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

				res
					.status(302)
					.redirect(`http://localhost:3000/?bread=${encrypted_access_token}`);
				// res.json({ bread: encrypted_access_token });
			})
			.catch((err) => res.status(400).json({ error: "error authenticating" }));
	}
});

app.get("/playlists", (req, res) => {
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

app.get("/remix/:playlist_id", (req, res) => {
	const bread = req.query.bread;
	const access_token = decrypt(bread);

	const get_remixed_names = (names) => {
		const remixedNames = [];

		names.forEach((name) => {
			remixedNames.push(name + " remix");
		});

		return remixedNames;
	};

	const playlist_url = "https://api.spotify.com/v1/me/playlists?limit=50";

	const options = {
		headers: {
			Authorization: "Bearer " + access_token,
			"Content-Type": "application/json",
		},
	};

	///get current users playlists
	axios
		.get(playlist_url, options)
		.then((response) => {
			const playlists = response.data.items;

			//get tracks href and name of playlist with :playlist_id
			const track_url = playlists.filter(
				(playlist) => playlist.id === req.params.playlist_id
			)[0].tracks.href;

			const playlist_name = playlists.filter(
				(playlist) => playlist.id === req.params.playlist_id
			)[0].name;

			///send req to track_url to get tracks info of that playlist
			axios
				.get(track_url, options)
				.then((response) => {
					const track_names = [];

					response.data.items.forEach((item) => {
						track_names.push(item.track.name);
					});
					const remixed_track_names = get_remixed_names(track_names);

					///now search for remixed songs using spotify api
					const search_url = "https://api.spotify.com/v1/search?";

					const get_query_params_for_search = (
						query,
						type = "track",
						limit = 3,
						offset = 0
					) => {
						return { type: type, limit: limit, offset: offset, query: query };
					};

					const get_search_options = (query) => {
						return {
							headers: {
								Authorization: "Bearer " + access_token,
								"Content-Type": "application/json",
							},
							params: get_query_params_for_search(query),
						};
					};

					const search_promises = [];

					remixed_track_names.forEach((remixed_track_name) => {
						search_promises.push(
							axios.get(search_url, get_search_options(remixed_track_name))
						);
					});

					Promise.all(search_promises)
						.then((search_results) => {
							const initial_remixed_tracks_URIs = search_results.map(
								(search_result) => {
									const tracks = search_result.data.tracks.items;
									if (tracks.length > 0) {
										return tracks[Math.floor(Math.random() * tracks.length)]
											.uri;
									}
								}
							);

							//remove nulls from initial_remixed_tracks_URIs to get the actual usable remixed_tracks_URIs
							const remixed_tracks_URIs = initial_remixed_tracks_URIs.filter(
								(item) => item != null
							);

							///creating a new playlist
							const data = {
								name: `${playlist_name} mixified`,
								public: true,
								description: "created by mixify.rocks",
							};
							axios
								.post(playlist_url, data, options)
								.then((response) => {
									const new_playlist_id = response.data.id;

									const add_items_to_playlist_URL = `https://api.spotify.com/v1/playlists/${new_playlist_id}/tracks`;

									const tracks_data = {
										uris: remixed_tracks_URIs,
									};

									///adding tracks to the newly created playlist
									axios
										.post(add_items_to_playlist_URL, tracks_data, options)
										.then((response) => res.json({ success: true }))
										.catch((err) =>
											res.status(400).json({
												error: "error adding song to the new playlist",
											})
										);
								})
								.catch((err) =>
									res
										.status(400)
										.json({ error: "error creating a new playlist" })
								);
						})
						.catch((err) =>
							res.status(400).json({ error: "error searching for remixes" })
						);
				})
				.catch((err) =>
					res.status(400).json({ error: "error accessing tracks info" })
				);
		})
		.catch((err) =>
			res
				.status(400)
				.json({ error: "error accessing the playlist while trying to mixify" })
		);
});

app.get("/user", (req, res) => {
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

app.listen(PORT, () => {
	console.log(`app started on port ${PORT}`);
});
