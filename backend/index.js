//TODO [far future] create a ML model (LOL) to classify if a song X is a remix of song Y
//TODO implement refresh tokens thing (use axios interceptors)
//TODO use sessions to store bread
//TODO account for state missmatch so we dont get XSRF-ed lol (first need to set up sessions)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import login from "./routes/login.js";
import callback from "./routes/callback.js";
import user from "./routes/user.js";
import playlists from "./routes/playlists.js";
import remix from "./routes/remix.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
	cors({
		origin: process.env.frontend_url,
		methods: ["GET"],
	})
);

app.get("/", (req, res) => {
	res.status(200).json({ msg: "welcome to mixify" });
});

app.use("/login", login);
app.use("/callback", callback);
app.use("/user", user);
app.use("/playlists", playlists);
app.use("/remix", remix);

app.listen(PORT, () => {
	console.log(`app started on port ${PORT}`);
});
