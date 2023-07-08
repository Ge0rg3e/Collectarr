// Dependencies
import { EDIT_LIBRARY, GET_LIBRARIES, type Libraries } from '@utils/graphql/libraries';
import { createActivity } from '@utils/graphql/activities';
import { useMutation, useQuery } from '@apollo/client';
import IconPicker from '@components/shared/iconPicker';
import { DialogProps, showDialog } from '../index';
import { createFormData } from '@utils/helpers';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import {
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Dialog
} from '@mui/material';

export default (props: DialogProps) => {
	const [editLibrary] = useMutation(EDIT_LIBRARY); // Mutation hook for editing a library

	// Get the payload from props
	const payload = props.payload;
	if (!payload) return <></>;

	// Fetch the library data
	const { data } = useQuery<Libraries>(GET_LIBRARIES, {
		variables: { id: payload.id }
	});

	// Create form
	const form = createFormData({
		defineKeys: {
			name: 'string',
			icon: 'string'
		}
	});

	// Check if data is available
	if (!data) return <></>;

	// Get the library from the data
	const library = data.libraries[0];

	useEffect(() => {
		// Set initial data
		if (form.isEmpty() && library) {
			form.setInitData(library);
		}
	}, []);

	// Function to handle form submission
	const onSubmit = async () => {
		try {
			// Perform the mutation to update the library
			await editLibrary({
				variables: {
					id: library.id,
					data: form.getData()
				}
			});

			// Create an activity log
			createActivity('actions', `He updated a library.`, {
				id: library.id,
				newData: form.getData()
			});

			// Success message
			toast.success('Library updated successfully');
		} catch {
			// Error message
			toast.error('Failed to update library');
		}
	};

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth={'xs'} fullWidth>
			<DialogTitle>Edit Library</DialogTitle>
			<DialogContent>
				<br />
				<div>
					<TextField
						onChange={({ target: { value } }) => form.update('name', value)}
						value={form.getData().name}
						variant="outlined"
						label="Name"
						fullWidth
						type="text"
					/>
				</div>
				<br />
				<div>
					<IconPicker
						onChange={(value) => form.update('icon', value)}
						value={form.getData().icon}
					/>
				</div>
				<br />
				<Button
					color="error"
					fullWidth
					variant="contained"
					startIcon={<i className="fas fa-trash" />}
					onClick={() => showDialog('delete-library', { id: library.id })}
				>
					Delete
				</Button>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button onClick={onSubmit} disabled={!form.validate() || form.isSame(library)}>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
};
