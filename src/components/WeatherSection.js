import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import WeatherGraph from './WeatherGraph';
import WeatherTable from './WeatherTable';

const apiKey = 'a3a6d0155e0434da56a34f845b348467';

export default function WeatherSection({ town }) {
	const [userLocale, setUserLocale] = useState(navigator.languages[0]);
	const [units, setUnits] = useState('metric');
	const [weatherData, setWeatherData] = useState(null);

	const { data, error, isPending } = useFetch(
		`http://api.openweathermap.org/data/2.5/forecast?lat=${town.coord.lat}&lon=${town.coord.lon}&appid=${apiKey}&units=${units}`
	);

	useEffect(() => {
		const getLocalHour = (date) => {
			let time = date.toLocaleTimeString(userLocale, {
				hour: 'numeric',
				minute: '2-digit',
			});

			// if format is e.g. 8:00 AM transform to 8 AM
			if (time.includes('AM') || time.includes('PM')) {
				time = time.replace(':00', '');
			}
			return time;
		};

		const getLocalDayFull = (date) => {
			return date.toLocaleDateString(userLocale, {
				day: 'numeric',
				weekday: 'short',
				month: 'short',
			});
		};

		const getLocalDayTime = (date) => {
			let dayTime = date.toLocaleString(userLocale, {
				weekday: 'short',
				hour: 'numeric',
				minute: '2-digit',
			});

			// if format is e.g. 8:00 AM transform to 8 AM
			if (dayTime.includes('AM') || dayTime.includes('PM')) {
				dayTime = dayTime.replace(':00', '');
			}
			return dayTime;
		};

		const getTempColor = (temp) => {
			const colors = {
				redDark: 'hsl(0, 100%, 30%)',
				red: 'hsl(0, 100%, 50%)',
				orange: 'hsl(25, 100%, 50%)',
				green: 'hsl(105, 100%, 41%)',
				blueLight: 'hsl(197, 100%, 50%)',
				blue: 'hsl(227, 100%, 51%)',
			};
			if (units === 'metric') {
				if (temp >= 40) return colors.redDark;
				if (temp >= 30) return colors.red;
				if (temp >= 20) return colors.orange;
				if (temp >= 10) return colors.green;
				if (temp >= 0) return colors.blueLight;
				if (temp < 0) return colors.blue;
			} else {
				if (temp >= 104) return colors.redDark;
				if (temp >= 86) return colors.red;
				if (temp >= 68) return colors.orange;
				if (temp >= 50) return colors.green;
				if (temp >= 32) return colors.blueLight;
				if (temp < 32) return colors.blue;
			}
		};

		if (data) {
			setWeatherData({
				city: data.city,
				list: data.list.map((record) => {
					const date = new Date(record.dt * 1000);
					const _record = {
						dt: record.dt,
						dt_txt: record.dt_txt,
						localHour: getLocalHour(date),
						localDayFull: getLocalDayFull(date),
						localDayTime: getLocalDayTime(date),
						temp: Math.round(record.main.temp),
						tempColor: getTempColor(Math.round(record.main.temp)),
						icon: record.weather.length > 0 ? record.weather[0].icon : '',
					};
					return _record;
				}),
			});
		}
	}, [data, units, userLocale]);

	useEffect(() => {
		window.addEventListener('languagechange', () => {
			setUserLocale(navigator.languages[0]);
		});
	}, []);

	useEffect(() => {
		if (userLocale.toLowerCase().includes('us')) {
			setUnits('imperial');
		} else {
			setUnits('metric');
		}
	}, [userLocale]);

	return (
		<div className="weather-section">
			{error && <div className="error">{error}</div>}
			{isPending && <div className="is-pending">Loading...</div>}
			{weatherData && !error && (
				<>
					<h2>{`${weatherData.city.name}, ${weatherData.city.country}`}</h2>
					<WeatherTable weatherData={weatherData} userLocale={userLocale} units={units} />
					<WeatherGraph weatherData={weatherData} units={units} />
				</>
			)}
		</div>
	);
}
