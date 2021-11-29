import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

export function GameWindow(props: { name: string; socket: any }) {
	const [history, setHistory] = useState<string[]>([]);
	const [currentValue, setCurrentValue] = useState('');

	const refDiv = useRef<HTMLDivElement>(null);

	function handleSubmit(event: any) {
		event.preventDefault();
		if (currentValue === '') {
			return;
		}
		setHistory([...history, currentValue]);
		updateScroll();
		props.socket.emit('guess', { name: props.name, guess: currentValue });
		setCurrentValue('');
	}

	function handleChange(event: any) {
		event.stopPropagation();
		setCurrentValue(event.target.value);
	}

	useEffect(() => {
		props.socket.on('game-announcements', (message: string) => {
			setHistory([...history, message]);
			updateScroll();
		});
		return () => {
			props.socket.removeAllListeners('game-announcements');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history]);

	function updateScroll() {
		if (refDiv.current !== null) {
			refDiv.current.scrollTop = refDiv.current.scrollHeight;
		}
	}

	function getStyle(row: string) {
		if (row === 'Higher') {
			return 'text-green-500';
		}

		if (row === 'Lower') {
			return 'text-red-500';
		}

		if (row.includes('Winner') || row.includes('GG')) {
			return 'text-green-500 font-bold';
		}

		return 'black';
	}

	return (
		<div>
			<div className="text-xl text-center text-yellow-700 mb-2 ">
				Guess the number (From 0 to 1000)
			</div>
			<div
				ref={refDiv}
				className="flex flex-col h-96 bg-yellow-300 text-yellow-700rounded over px-3 overflow-x-auto"
			>
				{history.map((row, index) => {
					return (
						<span className={getStyle(row)} key={index}>
							{row}
						</span>
					);
				})}
			</div>
			<form className="flex flex-col" onSubmit={handleSubmit}>
				<input
					className="outline-none"
					id="number"
					type="number"
					onChange={handleChange}
					value={currentValue}
					autoComplete="off"
				/>
				<input
					className="p-2 rounded bg-yellow-200 text-yellow-700 my-2 cursor-pointer hover:bg-yellow-300"
					id="submit-btn"
					type="submit"
					value="Guess"
				/>
			</form>
		</div>
	);
}
