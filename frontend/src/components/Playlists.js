import React from "react";
import { base_url } from "../utils/base_url";
import Playlist from "./Playlist";

export default function Playlists({ playlists, bread }) {
	return (
		<>
			{playlists === undefined ? (
				<div>
					<h3 className="login_desc">
						Your token was expired, please{" "}
						<a className="relogin" href={`${base_url}/login`}>
							relogin
						</a>
					</h3>
				</div>
			) : playlists.length < 1 ? (
				<div>
					<h3 className="login_desc">
						You don't have any public playlist.
						<br />
						Please create one in Spotify and reload this page.
					</h3>
				</div>
			) : (
				<div className="wrapper">
					<div className="row">
						{playlists.map((playlist) => {
							return (
								<>
									<Playlist
										playlist={playlist}
										bread={bread}
										key={playlist.id}
									/>
									<hr />
								</>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}
