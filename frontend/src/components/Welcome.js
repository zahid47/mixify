import React from "react";

export default function Welcome({ username }) {
	return (
		<div>
			<h1 className="welcome_text">Welcome, {username}</h1>
			{/* <p className="welcome_desc">Not seeing your playlist? Make sure its public!</p> */}
		</div>
	);
}
