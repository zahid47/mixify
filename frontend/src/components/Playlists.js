//TODO make the mixify btn do some animation and say "mixified" after it remixes a playlist
//TODO account for very long playlist names

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
								<td>{playlist.name}</td>
								<td>
									<button
										className="mixify_btn"
										onClick={() => {
											axios
												.get(
													`http://localhost:8000/remix/${playlist.id}?bread=${bread}`
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
