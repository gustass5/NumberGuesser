import React from 'react';
import { LoginPage } from './pages/LoginPage';
import { GamePage } from './pages/GamePage';

import { useState } from 'react';

function App() {
	const [loggedIn, setLogin] = useState(false);
	const [name, setName] = useState('');

	function handleSubmit(event: React.FormEvent<HTMLFormElement>, name: string) {
		event.preventDefault();
		if (name === '') {
			return;
		}
		setName(name);
		setLogin(true);
	}

	if (!loggedIn) {
		return (
			<LoginPage
				handleSubmit={(event, name) => {
					handleSubmit(event, name);
				}}
			/>
		);
	}

	return <GamePage name={name} />;
}

export default App;
