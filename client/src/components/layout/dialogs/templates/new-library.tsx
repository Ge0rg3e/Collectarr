// Dependencies
import { createActivity } from '@utils/graphql/activities';
import { NEW_LIBRARY } from '@utils/graphql/libraries';
import IconPicker from '@components/shared/iconPicker';
import { createFormData } from '@utils/helpers';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { DialogProps } from '../index';
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
	const [newLibrary] = useMutation(NEW_LIBRARY); // Define the newLibrary mutation

	// Create form
	const form = createFormData({
		defineKeys: {
			name: 'string',
			icon: 'string'
		}
	});

	useEffect(() => {
		// Set initial data
		if (form.isEmpty()) {
			form.setInitData({
				icon: 'fas fa-rectangle-history',
				name: ''
			});
		}
	}, []);

	// Function to handle form submission
	const onSubmit = async () => {
		try {
			// Perform the mutation to create the library
			const { data } = await newLibrary({
				variables: { ...form.getData() }
			});

			// Get id
			const id = data.insert_libraries_one.id;

			// Create an activity log
			createActivity('actions', `He created a library.`, {
				id,
				data: form.getData()
			});

			// Redirect to the library page if an ID is returned, otherwise redirect to the home page
			window.location.replace(id ? `/library/${id}` : '/');

			// Success
			toast.success('Library created successfully!');
		} catch {
			// Error
			toast.error('An error occurred while creating the library.');
		}
	};

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth={'xs'} fullWidth>
			<DialogTitle>New Library</DialogTitle>
			<DialogContent>
				<br />
				<div>
					<TextField
						onChange={({ target: { value } }) => form.update('name', value)}
						variant="outlined"
						label="Name"
						type="text"
						fullWidth
					/>
				</div>
				<br />
				<div>
					<IconPicker
						onChange={(value) => form.update('icon', value)}
						value={form.getData().icon}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button onClick={onSubmit} disabled={!form.validate()}>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
};
