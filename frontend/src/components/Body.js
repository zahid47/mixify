import React from "react";

export default function body() {
	return (
		<div className="container">
			<h1 className="login_text">Log In with Spotify to get started</h1>
			<form action="http://localhost:8000/login">
				<input className="login_btn" type="submit" value="LOG IN" />
			</form>
		</div>
	);
}
