import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

const PORT = 8000;

let magicNumber = 0;

let players: { name: string; score: number; avatar: string }[] = [];

let gameStarted = false;
let gameInProgress = false;

app.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

io.on('connection', socket => {
	socket.on('ready', name => {
		const avatar = createAvatar(style, { size: 56 });
		const checkedName =
			players.find(player => player.name === name) === undefined
				? name
				: name + `#${Math.floor(Math.random() * 10000).toString(36)}`;

		players = [...players, { name: checkedName, score: 0, avatar }];
		if (!gameStarted) {
			startGame();
		} else {
			socket.emit('game-announcements', 'Good luck!');
		}

		io.emit('leaderboard', players);
	});

	socket.on('guess', (args: { name: string; guess: string }) => {
		if (!gameStarted || !gameInProgress) {
			socket.emit('game-announcements', "Match hasn't started yet");
			return;
		}

		if (Number(args.guess) === magicNumber) {
			const player = players.find(pl => pl.name === args.name);
			io.emit(
				'game-announcements',
				`Winner is: ${args.name}. Number was ${magicNumber}`
			);

			if (player !== undefined) {
				players = players.filter(pl => pl.name !== args.name);
				players = [
					...players,
					{
						name: player.name,
						score: player.score + 1,
						avatar: player.avatar
					}
				];
				players = [...players.sort((a, b) => a.score - b.score)].reverse();
			}
			io.emit('leaderboard', players);
			gameInProgress = false;

			if (player !== undefined && Number(player.score) + 1 === 4) {
				io.emit(
					'game-announcements',
					`${args.name} is the ultimate champion! GG`
				);
				return;
			}

			startGame();
			return;
		}

		if (Number(args.guess) < magicNumber) {
			socket.emit('game-announcements', 'Higher');
			return;
		}

		if (Number(args.guess) > magicNumber) {
			socket.emit('game-announcements', 'Lower');

			return;
		}
	});
});

server.listen(PORT, () => {
	console.log(`listening on port:${PORT}`);
});

function startGame() {
	magicNumber = Math.floor(Math.random() * 1000);
	gameStarted = true;

	for (let i = 1; i <= 6; i++) {
		const message = i === 6 ? 'Go' : `Match starts in ${5 - i}`;
		setTimeout(() => {
			io.emit('game-announcements', message);
			if (i === 6) {
				gameInProgress = true;
			}
		}, 1000 * i);
	}
}
