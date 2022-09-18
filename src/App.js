import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherTable from './components/WeatherTable';

const defaultTown = {
	id: 5128638,
	name: 'New York',
	state: 'NY',
	country: 'US',
	coord: {
		lon: -75.499901,
		lat: 43.000351,
	},
};

function App() {
	const [town, setTown] = useState(defaultTown);
	return (
		<div className="App">
			<h1>WeatherApp</h1>
			<div className="content">
				<SearchBar setTown={setTown} />
				<WeatherTable town={town} />
			</div>
		</div>
	);
}

export default App;
