import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherSection from './components/WeatherSection';

const defaultTown = {
	id: 2643743,
	name: 'London',
	state: '',
	country: 'GB',
	coord: {
		lon: -0.12574,
		lat: 51.50853,
	},
};

function App() {
	const [town, setTown] = useState(defaultTown);
	return (
		<div className="App">
			<h1>WeatherApp</h1>
			<div className="content">
				<SearchBar setTown={setTown} />
				<WeatherSection town={town} />
			</div>
		</div>
	);
}

export default App;
