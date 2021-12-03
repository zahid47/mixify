//TODO make the mixify btn do some animation and say "mixified" after it remixes a playlist
//TODO account for very long playlist names
//TODO show full playlist name onHover

import React from "react";
import axios from "axios";

export default function Playlists({ playlists, bread }) {
	return (
		<div className="playlists">
			<table>
				<tbody>
					{playlists.map((playlist) => {
						return (
							<tr key={playlist.id}>
								<td className="playlist_name" title={playlist.name}>
									{playlist.name}
								</td>
								<td>
									<button
										className="mixify_btn"
										onClick={() => {
											axios
												.get(
													`https://mixify-api.herokuapp.com/remix/${playlist.id}?bread=${bread}`
												)
												.then(() => {});
										}}
									>
										mixify
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
