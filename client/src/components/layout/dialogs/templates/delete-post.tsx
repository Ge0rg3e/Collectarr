// Dependencies
import { createActivity } from '@utils/graphql/activities';
import { deletePoster } from '@components/shared/poster';
import { DELETE_POST } from '@utils/graphql/posts';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { DialogProps } from '..';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material';

export default (props: DialogProps) => {
	const [deletePost] = useMutation(DELETE_POST); // Define the deletePost mutation
	const { id } = useParams(); // Get the post ID from the URL parameters

	// Function to handle form submission
	const onSubmit = async () => {
		// If the ID is not available, close
		if (!id) return props.onClose();

		try {
			// Perform the deletePost mutation to delete the post
			await deletePost({ variables: { id } });

			// Delete the associated poster
			await deletePoster(id);

			// Create an activity log
			createActivity('actions', `He deleted a post.`, { id });

			// Redirect to the home page
			location.replace('/');

			// Display a success toast message
			toast.success('Post deleted successfully');
		} catch {
			// Display an error toast message
			toast.error('Failed to delete post');
		}
	};

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth="xs" fullWidth>
			<DialogTitle>Delete Post</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to delete this post? Please note that this action is
					irreversible.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>No</Button>
				<Button onClick={onSubmit}>Yes</Button>
			</DialogActions>
		</Dialog>
	);
};
