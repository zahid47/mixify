import React from "react";
import { base_url } from "../utils/base_url";

export default function body() {
	return (
		<div className="container">
			<h1 className="login_text">Log In with Spotify to get started</h1>
			<h3 className="login_desc">
				Remix your playlists, relive your favorite songs!
			</h3>
			<form action={`${base_url}/login`}>
				<input className="login_btn" type="submit" value="LOG IN" />
			</form>
		</div>
	);
}
