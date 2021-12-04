import React from "react";
import { useState } from "react";

function Alert() {
	const [display, setDisplay] = useState("alert");

	return (
		<div className={display}>
			Check Spotify for your newly created playlist!
			<span className="closebtn" onClick={() => setDisplay("alert hide")}>
				&times;
			</span>
		</div>
	);
}

export default Alert;
