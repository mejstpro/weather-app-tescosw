import React from 'react';
import { useFetch } from '../hooks/useFetch';

const apiKey = 'a3a6d0155e0434da56a34f845b348467';

export default function WeatherSection({ town }) {
	const { data, error, isPending } = useFetch(
		`http://api.openweathermap.org/data/2.5/forecast?lat=${town.coord.lat}&lon=${town.coord.lon}&appid=${apiKey}`
	);

	if (data) {
		console.log('Fetched data: ', data);
	}

	return (
		<div className="weather-section">
			{error && <p className="error">{error}</p>}
			{isPending && <p className="is-pending">Loading...</p>}
			{data && <h2>{`${data.city.name}, ${data.city.country}`}</h2>}
		</div>
	);
}
