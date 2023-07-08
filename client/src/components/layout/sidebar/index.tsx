// Dependencies
import { GET_LIBRARIES, type Libraries } from '@utils/graphql/libraries';
import { useLocation, useNavigate } from 'react-router-dom';
import { showDialog } from '@components/layout/dialogs';
import { CircularProgress } from '@mui/material';
import { version } from '@/../package.json';
import { useQuery } from '@apollo/client';

// Types
type Nav = {
	icon: string;
	label: string;
	active: boolean;
	onClick: () => void;
	onDoubleClick?: () => void;
} | null;

export default () => {
	// Fetch libraries
	const { data, loading } = useQuery<Libraries>(GET_LIBRARIES);

	// Get the current location and navigation function from React Router
	const location = useLocation();
	const nav = useNavigate();

	// Display loading spinner while data is being fetched
	if (!data || loading === true) {
		return (
			<div className="loading">
				<CircularProgress />
			</div>
		);
	}

	// Function to generate navigation entries
	const getNavs = () => {
		const navs: Array<Nav> = [];

		// General
		navs.push({
			active: location.pathname === '/',
			onClick: () => nav('/'),
			icon: 'fal fa-home',
			label: 'Home'
		});

		// Space
		navs.push(null);

		// Libraries
		data.libraries.forEach((x) => {
			navs.push({
				onDoubleClick: () => showDialog('edit-library', { id: x.id }),
				active: location.pathname.includes(x.id),
				onClick: () => nav(`/library/${x.id}`),
				label: x.name,
				icon: x.icon
			});
		});

		// New Library
		navs.push({
			onClick: () => showDialog('new-library'),
			label: 'New library',
			icon: 'fal fa-plus',
			active: false
		});

		return navs;
	};

	// Generate navigation entries
	const navs = getNavs();

	return (
		<div className="component-sidebar">
			<div className="logo">
				<i className="fal fa-rectangle-history" />
				<span>Collectarr</span>
			</div>

			<div className="navs">
				{navs.map((entry, i) =>
					entry === null ? (
						<div key={i} className="space"></div>
					) : (
						<div
							className={`entry ${entry.active ? 'active' : ''}`}
							onDoubleClick={entry.onDoubleClick}
							onClick={entry.onClick}
							key={i}
						>
							<i className={entry.icon} />
							<span>{entry.label}</span>
						</div>
					)
				)}
			</div>

			<div className="footer">
				<div
					onClick={() => window.open('https://github.com/Ge0rg3e/Collectarr')}
					className="github"
				>
					<i className="fab fa-github" />
				</div>

				<div className="version">v{version}</div>
			</div>
		</div>
	);
};
