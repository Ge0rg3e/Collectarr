// Dependencies
import { gql } from '@apollo/client';

// Types
export interface Library {
	id: string;
	name: string;
	icon: string;
	created_at: Date;
}

export interface Libraries {
	libraries: Library[];
}

// Schemas
export const NEW_LIBRARY = gql`
	mutation NewLibrary($name: String!, $icon: String!) {
		insert_libraries_one(object: { name: $name, icon: $icon }) {
			id
		}
	}
`;

export const EDIT_LIBRARY = gql`
	mutation UpdateLibrary($id: uuid!, $data: libraries_set_input!) {
		update_libraries_by_pk(pk_columns: { id: $id }, _set: $data) {
			icon
			name
			id
		}
	}
`;

export const GET_LIBRARY = gql`
	query GetLibrary($id: uuid!) {
		libraries(where: { id: { _eq: $id } }) {
			icon
			name
			id
		}
	}
`;

export const GET_LIBRARIES = gql`
	query GetLibraries {
		libraries {
			id
			name
			icon
		}
	}
`;

export const DELETE_LIBRARY = gql`
	mutation DeleteLibrary($id: uuid!) {
		delete_libraries(where: { id: { _eq: $id } }) {
			affected_rows
		}
	}
`;

export const DELETE_POSTS_BY_LIBRARY = gql`
	mutation DeletePostsByLibrary($id: uuid!) {
		delete_posts(where: { library: { _eq: $id } }) {
			affected_rows
		}
	}
`;
