import React from "react";

export default function Welcome({ username }) {
	return (
		<div>
			<h1 className="welcome_text">welcome, {username}</h1>
		</div>
	);
}
