import { useState } from 'react';
import { io } from 'socket.io-client';
import { GameWindow } from '../components/GameWindow';
import { Leaderboard } from '../components/Leaderboard';

export function GamePage(props: { name: string }) {
	const [ready, setReady] = useState(false);
	const socket = io('http://localhost:8000');

	function handleReady() {
		if (ready) {
			return;
		}
		setReady(true);
		socket.emit('ready', props.name);
	}

	return (
		<div>
			<button
				className={`bg-yellow-200 py-10 px-32 rounded hover:bg-yellow-300 text-yellow-700  text-4xl ${
					ready ? 'hidden' : ''
				}`}
				onClick={handleReady}
			>
				Ready
			</button>
			<div className={`${ready ? '' : 'hidden'} flex flex-wrap content-evenly`}>
				<div className="w-72"></div>
				<div className="w-96">
					<GameWindow name={props.name} socket={socket} />
				</div>
				<div className="w-72">
					<Leaderboard socket={socket} />
				</div>
			</div>
		</div>
	);
}
