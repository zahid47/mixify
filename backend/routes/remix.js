import express from "express";
import axios from "axios";
import { decrypt } from "../utils/crypt.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/:playlist_id", (req, res) => {
	const bread = req.query.bread;
	const access_token = decrypt(bread);

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
					const track_ids = [];

					response.data.items.forEach((item) => {
						track_names.push(item.track.name);
						track_ids.push(item.track.id);
					});

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

					track_names.forEach((remixed_track_name) => {
						search_promises.push(
							axios.get(search_url, get_search_options(remixed_track_name))
						);
					});

					Promise.all(search_promises)
						.then((search_results) => {
							const initial_remixed_tracks_URIs = search_results.map(
								(search_result) => {
									const _tracks = search_result.data.tracks.items;

									//filter out the original track
									const tracks = _tracks.filter(
										(_track) => !track_ids.includes(_track.id)
									);

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

export default router;
