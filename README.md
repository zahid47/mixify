# mixify

An app that takes your Spotify playlist and creates another one with remixes of the same songs.

https://mixify.rocks

### Environment Variables Required:
#### Backend:
- `CLIENT_ID` (Spotify client id)
- `CLIENT_SECRET` (Spotify client secret)
- `PASSWORD` (password for encryption and decryption, use a random string of characters)
- `SESSION_SECRET` (session secret (duh!), use a random string of characters)
- `BASE_URL` (backend url, default: http://localhost:8000)
- `FRONTEND_URL` (frontend url, default: http://localhost:3000)
- `PORT` (port for express server, default: 8000)

#### Frontend:
- ga_code (google analytics ID, rename src/utils/`ga_code_example.js` to `ga_code.js` and insert your own ID there)

### Install
```
cd backend
npm install
```
```
cd frontend
npm install
```
### Run
```
cd backend
npm dev
```
```
cd frontend
npm dev
```

Idea by [Divide-By-0](https://github.com/Divide-By-0/app-ideas-people-would-use)
