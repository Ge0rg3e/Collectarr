// Dependencies
import { DELETE_LIBRARY, DELETE_POSTS_BY_LIBRARY } from '@utils/graphql/libraries';
import { createActivity } from '@utils/graphql/activities';
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
	const [deletePosts] = useMutation(DELETE_POSTS_BY_LIBRARY); // Define the deletePosts mutation
	const [deleteLibrary] = useMutation(DELETE_LIBRARY); // Define the deleteLibrary mutation

	const payload = props.payload;
	if (!payload) return props.onClose(); // If the payload is not available, close

	// Function to handle form submission
	const onSubmit = async () => {
		try {
			// Perform the deleteLibrary mutation to delete the library
			await deleteLibrary({ variables: { id: payload.id } });

			// Perform the deletePosts mutation to delete the associated posts
			await deletePosts({ variables: { id: payload.id } });

			// Create an activity log
			createActivity('actions', `He deleted a library.`, { id: payload.id });

			// Redirect to the home page
			location.replace('/');

			// Display a success toast message
			toast.success('Library deleted successfully');
		} catch (e) {
			console.log(e);
			// Display an error toast message
			toast.error('Failed to delete library');
		}
	};

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth="xs" fullWidth>
			<DialogTitle>Delete Library</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to delete this library? Please note that this action is
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
