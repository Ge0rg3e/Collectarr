// Dependencies
import { CREATE_POST, GET_POSTS_BY_ID, Posts } from '@utils/graphql/posts';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Poster, { refetchPosters } from '@components/shared/poster';
import { createActivity } from '@utils/graphql/activities';
import { useQuery, useMutation } from '@apollo/client';
import { getSession } from '@utils/graphql/users';
import Page from '@components/layout/page';
import { toast } from 'react-hot-toast';
import { Button } from '@mui/material';
import { useEffect } from 'react';

export default () => {
	const [createPost] = useMutation(CREATE_POST); // Use the useMutation hook to declare the CREATE_POST mutation
	const session = getSession(); // Get the current session
	const { id } = useParams(); // Get the parameter from the URL
	const nav = useNavigate(); // Get the navigation function from React Router

	if (session === null) return <Navigate to="/login" />; // Redirect to the login page if there is no session

	// Query data using GET_POSTS_BY_ID
	const { data } = useQuery<Posts>(GET_POSTS_BY_ID, {
		variables: { id }
	});

	// Function to create a new post
	const onCreatePost = async () => {
		try {
			// Perform the mutation to create the post
			await createPost({
				variables: { library: id }
			});

			// Create an activity log
			createActivity('actions', 'He created a new post.', { id }, () => {
				// Reload page
				location.reload();

				// Success
				toast.success('Post created successfully');
			});
		} catch {
			// Error
			toast.error('Failed to create post');
		}
	};
	// Refetch posters on data change
	useEffect(() => refetchPosters(), [data]);

	// If data is null, return
	if (!data) return <></>;

	return (
		<Page name="Library">
			<Button startIcon={<i className="fas fa-plus" />} onClick={onCreatePost}>
				Create new post
			</Button>

			<div className="entrys">
				{data.posts.map((entry, i) => (
					<div onClick={() => nav(`/post/${entry.id}`)} className={`entry`} key={i}>
						<Poster
							id={entry.id}
							action={{
								icon: 'far fa-arrow-up-right-from-square',
								onClick: () => nav(`/post/${entry.id}`)
							}}
						/>

						<div className="content">
							<div className="title">{entry.title}</div>
							<div className="tags">{JSON.parse(entry.tags).join(', ')}</div>
						</div>
					</div>
				))}
			</div>
		</Page>
	);
};
