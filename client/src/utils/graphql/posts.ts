// Dependencies
import { gql } from '@apollo/client';

// Types
export interface Post {
	id: string;
	library: string;
	title: string;
	description: string;
	tags: string;
	created_at: Date;
	info: string | null;
	pageGradient: boolean;
}

export interface Posts {
	posts: Post[];
}

// Schemas
export const GET_POST = gql`
	query GetPost($id: uuid!) {
		posts(where: { id: { _eq: $id } }) {
			pageGradient
			description
			created_at
			title
			info
			tags
			id
		}
	}
`;

export const GET_POSTS_BY_ID = gql`
	query GetPosts($id: uuid!) {
		posts(where: { library: { _eq: $id } }) {
			title
			tags
			id
		}
	}
`;

export const DELETE_POST = gql`
	mutation DeletePost($id: uuid!) {
		delete_posts(where: { id: { _eq: $id } }) {
			affected_rows
		}
	}
`;

export const CREATE_POST = gql`
	mutation CreatePost($library: uuid!) {
		insert_posts_one(object: { library: $library }) {
			id
		}
	}
`;

export const SEARCH_WHERE_TAG = gql`
	query SearchWhereTag($content: String!) {
		posts(where: { tags: { _ilike: $content } }) {
			title
			tags
			id
		}
	}
`;

export const SEARCH_WHERE_TITLE = gql`
	query SearchWhereTitle($content: String!) {
		posts(where: { title: { _ilike: $content } }) {
			title
			tags
			id
		}
	}
`;

export const EDIT_POST = gql`
	mutation UpdatePost($id: uuid!, $data: posts_set_input!) {
		update_posts_by_pk(pk_columns: { id: $id }, _set: $data) {
			pageGradient
			description
			title
			info
			tags
			id
		}
	}
`;
