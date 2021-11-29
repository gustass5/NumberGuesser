import { useEffect, useState } from 'react';

interface IPlayer {
	name: string;
	score: number;
	avatar: string;
}

export function Leaderboard(props: { socket: any }) {
	const [leaderboard, setLeaderboard] = useState<IPlayer[]>([]);

	useEffect(() => {
		props.socket.on('leaderboard', (players: IPlayer[]) => {
			setLeaderboard(players);
		});
		return () => {
			props.socket.removeAllListeners('leaderboard');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [leaderboard]);
	return (
		<div className="ml-12">
			<span className="text-xl text-yellow-700 text-center">Leaderboard</span>
			<div className="flex flex-col bg-yellow-300 mt-2 max-h-96 overflow-auto">
				{leaderboard.map((player, index) => {
					return (
						<div className="flex items-center bg-yellow-400 m-2 space-x-4 rounded">
							<span
								className="ml-2"
								dangerouslySetInnerHTML={{ __html: player.avatar }}
							></span>
							<span className="truncate" key={index}>
								{player.score} - {player.name}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
