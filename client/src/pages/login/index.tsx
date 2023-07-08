// Dependencies
import { Navigate, useNavigate } from 'react-router-dom';
import { createFormData } from '@utils/helpers';
import { getSession } from '@utils/graphql/users';
import { Auth } from '@utils/graphql/users';
import Page from '@components/layout/page';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { createActivity } from '@/utils/graphql/activities';

export default () => {
	const session = getSession(); // Get the current session
	const nav = useNavigate(); // Get the navigation function from React Router

	if (session !== null) return <Navigate to="/" />; // Redirect to the home page if there is an active session

	// Create form
	const form = createFormData({
		defineKeys: {
			email: 'email',
			password: 'string'
		}
	});

	// Initialize state for loading
	const [loading, setLoading] = useState(false);

	// Form submit handler
	const onSubmit = async () => {
		setLoading(true); // Set loading state to true during form submission
		try {
			const res = await Auth(form.getData()); // Call the Auth function with form data

			if (res !== null) {
				// If authentication is successful, store session data in local storage
				localStorage.setItem(
					'session',
					JSON.stringify({
						createdAt: res.created_at,
						username: res.username,
						loginAt: new Date(),
						email: res.email,
						id: res.id
					})
				);

				// Create an activity log
				createActivity(
					'auth',
					'Logged in.',
					{
						email: res.email
					},
					() => {
						nav('/'); // Redirect to the home page
					}
				);
			} else {
				// Create an activity log
				createActivity('auth', 'Tried to login.', {
					email: form.getData().email
				});

				toast.error('Email or password is invalid'); // Display an error toast if authentication fails
				setLoading(false); // Reset loading state
			}
		} catch {
			toast.error('An error has occurred'); // Display an error toast if an error occurs during authentication
			setLoading(false); // Reset loading state
		}
	};

	return (
		<Page name="Login" hideLayout>
			<div className="form">
				<TextField
					onChange={({ target: { value } }) => form.update('email', value)}
					variant="outlined"
					label="Email"
					type="email"
				/>
				<TextField
					onChange={({ target: { value } }) => form.update('password', value)}
					variant="outlined"
					label="Password"
					type="password"
				/>

				<LoadingButton
					disabled={!form.validate()}
					variant="contained"
					onClick={onSubmit}
					loading={loading}
					fullWidth
				>
					Submit
				</LoadingButton>
			</div>
		</Page>
	);
};
