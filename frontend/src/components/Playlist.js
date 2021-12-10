import React from "react";
import { useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import mixify_icon from "../images/mixify_icon.svg";
import { base_url } from "../utils/base_url";

export default function Playlist({ playlist, bread }) {
	const [btn, setBtn] = useState(" mixify");
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
						setBtn(" ...");

						axios
							.get(`${base_url}/remix/${playlist.id}?bread=${bread}`)
							.then(() => {
								setBtn(" mixified!");
								setDisabled(true);
							})
							.catch((err) => setBtn("error, please relogin"));
					}}
				>
					{btn === " mixify" ? (
						<img className="mixify_icon" src={mixify_icon} alt="mixify-icon" />
					) : null}
					{btn}
				</button>
			</div>
			{btn === " mixified!" ? <Alert /> : <></>}
		</div>
	);
}
