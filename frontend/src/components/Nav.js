import React from "react";
import logo from "../images/logo.svg";

export default function Nav() {
	return (
		<div>
			<header>
				<a href="http://localhost:3000/">
					<img className="logo" src={logo} alt="mixify logo" />
				</a>
				<nav>
					<ul className="nav_links">
						<li>
							<a href="http://localhost:3000/">source</a>
						</li>
						{/* <li>
							<a href="http://localhost:3000/">Contact</a>
						</li> */}
					</ul>
				</nav>
			</header>
		</div>
	);
}
