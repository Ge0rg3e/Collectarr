// Dependencies
import { useNavigate, useParams } from 'react-router-dom';
import { getSession } from '@utils/graphql/users';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import {
	InputAdornment,
	FormControl,
	IconButton,
	MenuItem,
	Avatar,
	Input,
	Menu
} from '@mui/material';

export default () => {
	const [userMenu, setUserMenu] = useState<null | HTMLElement>(null); // User menu
	const { content: searchContent } = useParams(); // Get content from route params
	const [search, setSearch] = useState(searchContent || ''); // Search input value
	const session = getSession(); // Get user session
	const nav = useNavigate(); // Navigation function

	// Logout function
	const onLogOut = async () => {
		localStorage.removeItem('session'); // Remove session from localStorage
		location.replace('/login'); // Redirect user to login page
		toast.success('You have been successfully logged out.'); // Success message
	};

	// Search function
	const onSearch = () => {
		if (!search.length) return;
		nav(`/search/${encodeURIComponent(search)}`); // Navigate to search page with the search term
	};

	return (
		<div className="component-header">
			<div></div>

			<div className="search">
				<FormControl fullWidth sx={{ m: 1 }}>
					<Input
						id="search-bar"
						onKeyDown={(e) => e.key === 'Enter' && onSearch()}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search...."
						value={search}
						startAdornment={
							<InputAdornment position="start">
								<i className="far fa-search" />
							</InputAdornment>
						}
					/>
				</FormControl>
			</div>

			{session ? (
				<>
					<div className="user">
						<IconButton
							aria-controls={userMenu ? 'account-menu' : undefined}
							aria-expanded={userMenu ? 'true' : undefined}
							onClick={(e) => setUserMenu(e.currentTarget)}
							aria-haspopup="true"
						>
							<Avatar>{session.username[0].toUpperCase()}</Avatar>
						</IconButton>
					</div>

					<Menu
						anchorOrigin={{
							horizontal: 'right',
							vertical: 'bottom'
						}}
						transformOrigin={{
							horizontal: 'right',
							vertical: 'top'
						}}
						onClick={() => setUserMenu(null)}
						open={userMenu ? true : false}
						anchorEl={userMenu}
						id="account-menu"
						PaperProps={{
							elevation: 0,
							sx: {
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								width: '110px',
								mt: 1.5,
								marginLeft: '-5px',
								'& .MuiAvatar-root': {
									width: 32,
									height: 32,
									ml: -0.5,
									mr: 1
								},
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: 0,
									right: 14,
									width: 10,
									height: 10,
									bgcolor: '#171c28',
									transform: 'translateY(-50%) rotate(45deg)',
									zIndex: 0
								}
							}
						}}
					>
						<MenuItem onClick={() => nav('/account')}>
							<i className="fas fa-gear" /> Account
						</MenuItem>
						<MenuItem onClick={onLogOut}>
							<i className="fas fa-right-from-bracket" /> Logout
						</MenuItem>
					</Menu>
				</>
			) : (
				<IconButton onClick={() => nav('/login')}>
					<i className="fas fa-right-to-bracket" />
				</IconButton>
			)}
		</div>
	);
};
