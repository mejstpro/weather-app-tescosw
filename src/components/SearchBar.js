import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

// assets
import searchIcon from '../assets/searchIcon.svg';

const myLocationText = 'My location';

export default function SearchBar({ setTown }) {
	const [towns, setTowns] = useState();
	const [searchInput, setSearchInput] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState('');
	const townInputEl = useRef(null);

	const { data: fetchedTowns, error: fetchError } = useFetch(window.location.href + 'data/city.list.json');

	useEffect(() => {
		if (fetchedTowns) {
			setTowns(
				// for each town add it´s full name for the user to be able to search it even by state and country
				fetchedTowns.map((town) => {
					return { ...town, fullName: town.name + ', ' + (town.state ? town.state + ', ' : '') + town.country };
				})
			);
		}
	}, [fetchedTowns]);

	const handleSearchInputChange = (e) => {
		setSearchInput(e.target.value.trimStart());
		setIsSearching(true);
		setError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!searchInput) return;

		// if user enters My location text
		if (searchInput === myLocationText) {
			handleMyLocationSearch();
			return;
		}

		// autocomplete search and search the weather
		if (hintTowns.length > 0) {
			setSearchInput(hintTowns[0].fullName);
			searchTown(hintTowns[0]);
		} else {
			setError('Cannot find place: ' + searchInput);
		}
	};

	// search the town weather
	const searchTown = (town) => {
		setIsSearching(false);
		setTown(town);
	};

	const isTownInputElOverflown = () => {
		return townInputEl.current.scrollWidth > townInputEl.current.clientWidth;
	};

	// displayed hint towns
	const hintTowns = [];
	// find first 50 towns that start with user input value
	if (towns && searchInput) {
		for (const town of towns) {
			if (town.fullName.toLowerCase().startsWith(searchInput.toLowerCase())) {
				hintTowns.push(town);
			}
			if (hintTowns.length === 50) {
				break;
			}
		}
	}

	// search weather by geolocation
	const handleMyLocationSearch = () => {
		if ('geolocation' in navigator) {
			if (towns) setSearchInput(myLocationText);
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setTown({
						coord: {
							lon: position.coords.longitude,
							lat: position.coords.latitude,
						},
					});
				},
				(error) => {
					if (error.code === 1) {
						setError('Geolocation not allowed');
					} else {
						setError('Unable to get your location');
					}
				}
			);
		} else {
			setError('Geolocation not available');
		}
	};

	return (
		<div className="search-bar-container">
			<div className={`search-bar ${error ? 'error' : ''}`}>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder={!fetchError ? (towns ? 'Search town...' : 'Loading...') : fetchError}
						onChange={handleSearchInputChange}
						value={searchInput}
						ref={townInputEl}
						disabled={towns && !fetchError ? false : true}
					/>
					{isSearching && hintTowns.length > 0 && !isTownInputElOverflown() && (
						<span className="placeholder">{searchInput + hintTowns[0].fullName.substring(searchInput.length)}</span>
					)}
					<button type="submit" disabled={towns && !fetchError ? false : true}>
						<img src={searchIcon} alt="search icon" />
					</button>
				</form>

				{isSearching && searchInput && hintTowns.length > 1 && (
					<div className="hint-box">
						{hintTowns.map((town) => (
							<span
								key={town.id}
								className="town-hint"
								onClick={() => {
									setSearchInput(town.fullName);
									searchTown(town);
								}}
							>
								{town.fullName}
							</span>
						))}
					</div>
				)}
				<footer>
					{error && <p className="error">{error}</p>}
					{!error && (
						<button className="my-location" onClick={handleMyLocationSearch}>
							{myLocationText}
						</button>
					)}
				</footer>
			</div>
		</div>
	);
}
