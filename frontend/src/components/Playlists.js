import React from "react";
import Playlist from "./Playlist";

export default function Playlists({ playlists, bread }) {
	return (
		<>
			{playlists !== undefined ? (
				<div className="wrapper">
					<div className="row">
						{playlists.map((playlist) => {
							return (
								<Playlist playlist={playlist} bread={bread} key={playlist.id} />
							);
						})}
					</div>
				</div>
			) : (
				<div>
					<h3 className="login_desc">
						You either don't have any public playlist (make a public playlist on
						Spotify!) or your token was expired, please{" "}
						<a
							className="relogin"
							href="https://mixify-api.herokuapp.com/login"
						>
							relogin
						</a>
					</h3>
				</div>
			)}
		</>
	);
}
