const iconsURL = 'https://openweathermap.org/img/wn/';

export default function WeatherTable({ weatherData, units }) {
	class WeatherDay {
		constructor(dayTitle) {
			this.dayTitle = dayTitle;
			this.times = new Array(8).fill(null);
		}

		pushRecord(record) {
			const recordHour = new Date(record.dt * 1000).getHours();
			this.times[Math.floor(recordHour / 3)] = record;
		}

		getEveryNthTime(nthTime) {
			return this.times.filter((_, index) => index % nthTime === 0);
		}
	}

	const days = [];

	if (weatherData) {
		let _day = new Date(weatherData.list[0].dt * 1000).getDay();
		let weatherDay = new WeatherDay(weatherData.list[0].localDayFull);
		for (const record of weatherData.list) {
			const recordDay = new Date(record.dt * 1000).getDay();
			if (recordDay !== _day) {
				days.push(weatherDay);
				weatherDay = new WeatherDay(record.localDayFull);
				_day = recordDay;
			}
			weatherDay.pushRecord(record);
		}
		days.push(weatherDay);
	}

	return (
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
											<span className="hour">{dayTime.localHour}</span>
											<span className="temp" style={{ color: dayTime.tempColor }}>
												{dayTime.temp}°
											</span>
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
			{weatherData && <span className="units-note">units:&nbsp;{units === 'metric' ? '°C' : '°F'}</span>}
		</div>
	);
}
