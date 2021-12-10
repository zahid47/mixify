import axios from "axios";
import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Body from "./components/Body";
import Playlists from "./components/Playlists";
import Welcome from "./components/Welcome";
import { base_url } from "./utils/base_url";
import ReactGa from "react-ga";
import ga_code from "./utils/ga_code";

function App() {
	const [bread, setBread] = useState(null);
	const [username, setUsername] = useState("user");
	const [playlists, setPlaylists] = useState({
		playlists: [],
		error: {},
	});

	useEffect(() => {
		const update_bread = () => {
			const search = window.location.search;
			const params = new URLSearchParams(search);
			const bread = params.get("bread") || null;
			setBread(bread);
		};

		const fetch_playlists = () => {
			axios
				.get(`${base_url}/playlists?bread=${bread}`)
				.then((response) => {
					const _playlists = response.data;
					setPlaylists({ playlists: _playlists });
				})
				.catch((err) => setPlaylists({ error: err }));
		};

		const fetch_username = () => {
			axios
				.get(`${base_url}/user?bread=${bread}`)
				.then((response) => {
					const _username = response.data.username;
					setUsername(_username);
				})
				.catch((err) => console.log(err));
		};

		ReactGa.initialize(ga_code);
		ReactGa.pageview("/");

		update_bread();

		if (bread !== null) {
			fetch_playlists();
			fetch_username();
		}
	}, [bread, username]);

	return (
		<>
			<Nav />
			{bread !== null ? (
				<>
					<Welcome username={username} />
					<Playlists bread={bread} playlists={playlists.playlists} />
				</>
			) : (
				<>
					<Body />
				</>
			)}
			<Footer />
		</>
	);
}

export default App;
