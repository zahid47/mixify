import React from "react";
import { useState } from "react";
import axios from "axios";
import mixify_icon from "../images/mixify_icon.svg";

export default function Playlist({ playlist, bread }) {
	const [btn, setBtn] = useState("mixify");
	const [disabled, setDisabled] = useState(false);
	return (
		<div>
			<div className="column name">
				<p>{playlist.name}</p>
			</div>
			<div className="column text-align-right">
				<button
					disabled={disabled}
					className="btn"
					onClick={() => {
						setBtn("...");
						axios
							.get(
								`https://mixify-api.herokuapp.com/remix/${playlist.id}?bread=${bread}`
							)
							.then(() => {
								setBtn("mixified!");
								setDisabled(true);
							});
					}}
				>
					{btn === "mixify" ? (
						<img src={mixify_icon} alt="mixify-icon" />
					) : null}
					{btn}
				</button>
			</div>
		</div>
	);
}
