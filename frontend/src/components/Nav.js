import React from "react";
import logo from "../images/logo.svg";

export default function Nav() {
	return (
		<div>
			<header className="header">
				<a className="nav_item" href="/">
					<img className="logo" src={logo} alt="mixify logo" />
				</a>
				<nav>
					<ul className="nav_links">
						<li>
							<a
								className="nav_item"
								href="https://github.com/zahid47/mixify"
								target="_blank"
								rel="noreferrer"
							>
								source
							</a>
						</li>
					</ul>
				</nav>
			</header>
		</div>
	);
}
