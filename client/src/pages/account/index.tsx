// Dependencies
import { UPDATE_USER, renewSession, getSession } from '@utils/graphql/users';
import { createActivity } from '@utils/graphql/activities';
import { Button, TextField } from '@mui/material';
import { createFormData } from '@utils/helpers';
import { useMutation } from '@apollo/client';
import { Navigate } from 'react-router-dom';
import Page from '@components/layout/page';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import Activity from './activity';

export default () => {
	const [editUser] = useMutation(UPDATE_USER); // Mutation hook for edit user
	const session = getSession(); // Get the current session

	if (session === null) return <Navigate to="/login" />; // Check the user session and redirect to the login page if there is no active session

	// Create form
	const form = createFormData({
		defineKeys: {
			username: 'string',
			email: 'email',
			password: null
		}
	});

	useEffect(() => {
		// Set initial data
		if (form.isEmpty() && session) {
			form.setInitData(session);
		}
	}, []);

	// Function to handle form submission
	const onSubmit = async () => {
		try {
			// Perform the mutation to update the user
			await editUser({
				variables: { id: session.id, data: form.getData() }
			});

			// Reload session
			await renewSession({ id: session.id, email: form.getData().email || session.email });

			// Create an activity log
			createActivity('actions', `Updated account details.`, { id: session.id });

			// Success
			toast.success('Account has been successfully updated!');
		} catch {
			// Error
			toast.error('An error occurred while updating the account.');
		}
	};

	return (
		<Page name="Account">
			<div className="card">
				<div className="card-header">
					<div className="card-title">Basic info</div>
				</div>

				<div className="row">
					<div className="name">Username</div>

					<div className="value">
						<TextField
							onChange={({ target: { value } }) => form.update('username', value)}
							defaultValue={session.username}
							size="small"
						/>
					</div>
				</div>

				<div className="row">
					<div className="name">Login at</div>

					<div className="value">
						{dayjs(session.loginAt).format('MMMM Do YYYY, h:mm:ss')}
					</div>
				</div>

				<div className="row">
					<div className="name">Created at</div>

					<div className="value">
						{dayjs(session.createdAt).format('MMMM Do YYYY, h:mm:ss')}
					</div>
				</div>
			</div>

			<div className="card">
				<div className="card-header">
					<div className="card-title">Security</div>
				</div>

				<div className="row">
					<div className="name">Email</div>

					<div className="value">
						<TextField
							onChange={({ target: { value } }) => form.update('email', value)}
							defaultValue={session.email}
							type="email"
							size="small"
						/>
					</div>
				</div>

				<div className="row">
					<div className="name">New Password</div>

					<div className="value">
						<TextField
							onChange={({ target: { value } }) => form.update('password', value)}
							type="password"
							size="small"
						/>
					</div>
				</div>
			</div>

			<div className="actions">
				<Button
					disabled={!form.validate() || form.isSame(session)}
					variant="contained"
					onClick={onSubmit}
				>
					Save
				</Button>
			</div>

			<Activity />
		</Page>
	);
};
