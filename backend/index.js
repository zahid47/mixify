//TODO create a ML model(!!!) to classify if song Y is a remix of song X

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

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
		origin: process.env.FRONTEND_URL,
		methods: ["GET"],
	})
);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 3600000,
		},
	})
);

app.get("/", (req, res) => {
	res.status(200).json({ msg: "welcome to mixify v1.0" });
});

app.use("/login", login);
app.use("/callback", callback);
app.use("/user", user);
app.use("/playlists", playlists);
app.use("/remix", remix);

app.listen(PORT, () => {
	console.log(`app started on port ${PORT}`);
});
