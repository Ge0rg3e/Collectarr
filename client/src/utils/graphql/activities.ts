// Dependencies
import { getSession } from './users';
import { gql } from '@apollo/client';
import { conn } from '.';

// Types
export interface Activity {
	id: string;
	type: string;
	message: string;
	payload: string;
	created_at: Date;
}

export interface Activities {
	activities: Activity[];
}

// Utils
export const createActivity = (
	type: 'auth' | 'actions',
	message: string,
	payload = {},
	afterFinish?: () => void
) => {
	const session = getSession();

	conn.mutate({
		mutation: gql`
			mutation CreateActivity($type: String!, $message: String!, $payload: String!) {
				insert_activities_one(
					object: { type: $type, message: $message, payload: $payload }
				) {
					id
				}
			}
		`,
		variables: {
			payload: JSON.stringify({ session: session || null, ...payload }),
			message,
			type
		}
	})
		.then(() => (afterFinish ? afterFinish() : null))
		.catch(() => (afterFinish ? afterFinish() : null));
};

// Schemas
export const GET_ACTIVITIES = gql`
	query GetActivities {
		activities {
			id
			type
			message
			payload
			created_at
		}
	}
`;

export const GET_ACTIVITIES_FOR_USER = gql`
	query GetActivitiesForUser($type: String!, $where: String!) {
		activities(where: { type: { _eq: $type }, payload: { _ilike: $where } }) {
			id
			type
			message
			payload
			created_at
		}
	}
`;
