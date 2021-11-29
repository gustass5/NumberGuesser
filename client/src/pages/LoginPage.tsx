import React, { useState } from 'react';

export function LoginPage(props: {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>, name: string) => void;
}) {
	const [name, setName] = useState('');

	return (
		<div className="space-y-10">
			<span
				id="game-title"
				className="text-7xl font-sans font-bold text-yellow-800"
			>
				Number Guesser
			</span>
			<form
				className="space-y-2"
				onSubmit={event => props.handleSubmit(event, name)}
				style={{ display: 'flex', flexDirection: 'column' }}
			>
				<label
					className="mb-2 text-xl text-center text-yellow-700"
					htmlFor="name"
				>
					Enter name
				</label>
				<input
					className="outline-none"
					onChange={event => setName(event.target.value)}
					id="username"
					type="type"
				/>
				<input
					className="p-3 rounded bg-yellow-300 text-yellow-700 cursor-pointer hover:bg-yellow-200"
					id="play-button"
					type="submit"
					value="Play"
				/>
			</form>
		</div>
	);
}
