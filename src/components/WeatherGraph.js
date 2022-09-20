import { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function WeatherGraph({ weatherData, units }) {
	const [data, setData] = useState(null);
	const [options, setOptions] = useState(null);

	const configureOptions = useCallback(() => {
		const minDataShowTemp = () => {
			let min = weatherData.list[0].temp;
			weatherData.list.forEach((record) => {
				if (record.temp < min) min = record.temp;
			});
			if (units === 'metric') {
				min = Math.round((min - 5) / 5) * 5;
				return min > 0 ? 0 : min;
			} else {
				min = Math.round((min - 5) / 5) * 5;
				return min > 32 ? 32 : min;
			}
		};

		const maxDataShowTemp = () => {
			let max = weatherData.list[0].temp;
			weatherData.list.forEach((record) => {
				if (record.temp > max) max = record.temp;
			});
			max = Math.round((max + 5) / 5) * 5;
			return max;
		};

		setOptions({
			responsive: true,
			layout: {
				padding: 20,
			},
			scales: {
				y: {
					min: minDataShowTemp(),
					max: maxDataShowTemp(),
				},
			},
			elements: {
				point: {
					radius: window.innerWidth > 1400 ? 6 : 3,
				},
				line: {
					borderColor: '#000',
					borderWidth: 2,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		});
	}, [units, weatherData]);

	useEffect(() => {
		window.addEventListener('resize', () => configureOptions());
	}, [configureOptions]);

	useEffect(() => {
		setData({
			labels: weatherData.list.map((record) => record.localDayTime),
			datasets: [
				{
					label: 'Temperature',
					data: weatherData.list.map((record) => record.temp),
					backgroundColor: weatherData.list.map((record) => record.tempColor),
				},
			],
		});
		configureOptions();
	}, [weatherData, configureOptions]);

	return (
		<div className="weather-graph">
			<h3>Temperature graph</h3>
			{data && options && <Line data={data} options={options} />}
		</div>
	);
}
