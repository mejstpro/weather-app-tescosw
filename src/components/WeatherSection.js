import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const apiKey = 'a3a6d0155e0434da56a34f845b348467';
const iconsURL = 'https://openweathermap.org/img/wn/';

export default function WeatherSection({ town }) {
	const [userLocale, setUserLocale] = useState(navigator.languages[0]);
	const [units, setUnits] = useState('metric');

	class WeatherDay {
		constructor(dayTitle) {
			this.dayTitle = dayTitle;
			this.times = new Array(8).fill(null);
		}

		pushRecord(record) {
			const recordHour = new Date(record.dt * 1000).getHours();
			this.times[Math.floor(recordHour / 3)] = {
				hour: getLocalHour(new Date(record.dt * 1000)),
				temp: Math.round(record.main.temp),
				tempColor: this._getTempColor(record.main.temp),
				icon: record.weather.length > 0 ? record.weather[0].icon : '',
			};
		}

		getEveryNthTime(nthTime) {
			return this.times.filter((_, index) => index % nthTime === 0);
		}

		_getTempColor = (temp) => {
			const colors = ['red-dark', 'red', 'orange', 'green', 'blue-light', 'blue'];
			if (units === 'metric') {
				if (temp > 40) return colors[0];
				if (temp > 30) return colors[1];
				if (temp > 20) return colors[2];
				if (temp > 10) return colors[3];
				if (temp > 0) return colors[4];
				if (temp < 0) return colors[5];
			} else {
				if (temp > 104) return colors[0];
				if (temp > 86) return colors[1];
				if (temp > 68) return colors[2];
				if (temp > 50) return colors[3];
				if (temp > 32) return colors[4];
				if (temp < 32) return colors[5];
			}
		};
	}

	const getDayLocalTitle = (date) => {
		return date.toLocaleDateString(userLocale, {
			day: 'numeric',
			weekday: 'short',
			month: 'short',
		});
	};
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

	const { data, error, isPending } = useFetch(
		`http://api.openweathermap.org/data/2.5/forecast?lat=${town.coord.lat}&lon=${town.coord.lon}&appid=${apiKey}&units=${units}`
	);

	const days = [];

	if (data) {
		let _day = new Date(data.list[0].dt * 1000).getDay();
		let weatherDay = new WeatherDay(getDayLocalTitle(new Date(data.list[0].dt * 1000)));
		for (const record of data.list) {
			const recordDay = new Date(record.dt * 1000).getDay();
			if (recordDay !== _day) {
				days.push(weatherDay);
				weatherDay = new WeatherDay(getDayLocalTitle(new Date(record.dt * 1000)));
				_day = recordDay;
			}
			weatherDay.pushRecord(record);
		}
		days.push(weatherDay);
	}

	useEffect(() => {
		window.addEventListener('languagechange', () => {
			setUserLocale(navigator.languages[0]);
			console.log('Language change detected!');
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
			{data && !error && (
				<>
					<h2>{`${data.city.name}, ${data.city.country}`}</h2>
					<div className="weather-table">
						{days.map((day) => {
							if (day.getEveryNthTime(2).every((el) => el === null)) {
								return '';
							}
							return (
								<div className="day" key={day.dayTitle}>
									<div className="day-title">{day.dayTitle}</div>
									<div className="day-times">
										{day.getEveryNthTime(2).map((dayTime, index) => {
											if (dayTime) {
												return (
													<div className="day-time" key={index}>
														<span className="hour">{dayTime.hour}</span>
														<span className={`temp ${dayTime.tempColor}`}>{dayTime.temp}°</span>
														{dayTime.icon && (
															<span className="weather-icon">
																<img src={iconsURL + dayTime.icon + '@2x.png'} alt="weather icon" />
															</span>
														)}
													</div>
												);
											} else {
												return <div key={index} className="empty"></div>;
											}
										})}
									</div>
								</div>
							);
						})}
						{!isPending && !error && <span className="units-note">units:&nbsp;{units === 'metric' ? '°C' : '°F'}</span>}
					</div>
				</>
			)}
		</div>
	);
}
