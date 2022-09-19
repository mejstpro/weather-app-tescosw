import { useEffect, useRef, useState } from 'react';

import _towns from '../data/city.list.json';

import searchIcon from '../assets/searchIcon.svg';

export default function SearchBar({ setTown }) {
	const [towns, setTowns] = useState([]);
	const [searchInput, setSearchInput] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState('');
	const townInput = useRef(null);

	useEffect(() => {
		setTowns(
			_towns.map((town) => {
				return { ...town, fullName: town.name + ', ' + (town.state ? town.state + ', ' : '') + town.country };
			})
		);
	}, []);

	const handleSearchInputChange = (e) => {
		setSearchInput(e.target.value.trimStart());
		setIsSearching(true);
		setError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!searchInput) return;
		if (hintTowns.length > 0) {
			setSearchInput(hintTowns[0].fullName);
			searchTown(hintTowns[0]);
		} else {
			setError('Cannot find place: ' + searchInput);
		}
	};

	const searchTown = (town) => {
		setIsSearching(false);
		setTown(town);
	};

	function isTownInputOverflown() {
		return townInput.current.scrollWidth > townInput.current.clientWidth;
	}

	const hintTowns = [];
	if (searchInput) {
		for (const town of towns) {
			if (town.fullName.toLowerCase().startsWith(searchInput.toLowerCase())) {
				hintTowns.push(town);
			}
			if (hintTowns.length === 50) {
				break;
			}
		}
	}

	return (
		<div className="search-bar-container">
			<div className={`search-bar ${error ? 'error' : ''}`}>
				{towns && (
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Search town..."
							onChange={handleSearchInputChange}
							value={searchInput}
							ref={townInput}
						/>
						{isSearching && hintTowns.length > 0 && !isTownInputOverflown() && (
							<span className="placeholder">{searchInput + hintTowns[0].fullName.substring(searchInput.length)}</span>
						)}
						<button type="submit">
							<img src={searchIcon} alt="search icon" />
						</button>
					</form>
				)}

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
				<p className="error">{error}</p>
			</div>
		</div>
	);
}
