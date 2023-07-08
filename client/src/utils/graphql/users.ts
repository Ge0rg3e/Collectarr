// Dependencies
import { gql } from '@apollo/client';
import { conn } from '.';

// Types
type Session = {
	username: string;
	createdAt: Date;
	loginAt: Date;
	email: string;
	id: string;
} | null;

// Utils
export const Auth = async (params: { email: string; password: string }) => {
	const res = await conn.query({
		query: gql`
			query Auth($email: String!, $password: String!) {
				users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
					created_at
					username
					email
					id
				}
			}
		`,
		variables: params
	});

	// Check for errors in the response and return null if errors exist
	if (res.errors) return null;

	// Return the first user from the response data, if it exists; otherwise, return null
	return res.data.users.length > 0 ? res.data.users[0] : null;
};

export const getSession = () => {
	// Retrieve the session data from localStorage and parse it as a Session object
	const data: Session = JSON.parse(localStorage.getItem('session') || 'null');

	// If the session data is null, return null indicating no session
	if (data === null) return null;

	// Extract the loginAt value from the session data and convert it to a Date object
	const loginAt = new Date(data.loginAt);
	const now = new Date();

	// Calculate the difference in milliseconds between the current time and the login time
	const diff = now.getTime() - loginAt.getTime();

	// Calculate the number of days difference
	const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

	// If the session has expired (more than 10 days), remove the session data from localStorage and return null
	if (daysDiff > 10) {
		localStorage.removeItem('session');
		return null;
	}

	// Return the session data
	return data;
};

export const renewSession = async (params: { email: string; id: string }) => {
	const res = await conn.query({
		query: gql`
			query RenewSession($email: String!, $id: uuid!) {
				users(where: { email: { _eq: $email }, id: { _eq: $id } }) {
					created_at
					username
					email
					id
				}
			}
		`,
		variables: params
	});

	// Check for errors in the response and return null if errors exist
	if (res.errors) return null;

	// Check if a user exists in the response data, if not, return
	const user = res.data.users.length > 0 ? res.data.users[0] : null;
	if (user === null) return;

	// Get the current session
	const oldSession = getSession();
	if (!oldSession) return;

	// Update the session with the new user information and store it in localStorage
	localStorage.setItem(
		'session',
		JSON.stringify({
			...oldSession,
			username: user.username,
			email: user.email
		})
	);
};

// Schemas
export const UPDATE_USER = gql`
	mutation UpdateUser($id: uuid!, $data: users_set_input!) {
		update_users_by_pk(pk_columns: { id: $id }, _set: $data) {
			created_at
			username
			email
			id
		}
	}
`;
