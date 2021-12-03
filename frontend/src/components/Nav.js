import React from "react";
import logo from "../images/logo.svg";

export default function Nav() {
	return (
		<div>
			<header>
				<a href="/">
					<img className="logo" src={logo} alt="mixify logo" />
				</a>
				<nav>
					<ul className="nav_links">
						<li>
							<a href="https://github.com/zahid47/mixify">source</a>
						</li>
						{/* <li>
							<a href="/">Contact</a>
						</li> */}
					</ul>
				</nav>
			</header>
		</div>
	);
}
