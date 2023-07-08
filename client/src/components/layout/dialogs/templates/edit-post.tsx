// Dependencies
import Poster, { refetchPosters, uploadPoster } from '@components/shared/poster';
import { EDIT_POST, GET_POST, Posts } from '@utils/graphql/posts';
import { createActivity } from '@utils/graphql/activities';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { createFormData } from '@utils/helpers';
import { DialogProps, showDialog } from '..';
import { useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'react-hot-toast';
import {
	TextareaAutosize,
	FormControlLabel,
	DialogContent,
	DialogActions,
	Autocomplete,
	DialogTitle,
	TextField,
	Button,
	Switch,
	Dialog,
	Tabs,
	Box,
	Tab,
	Chip
} from '@mui/material';

// Define the tabs
const tabs = [
	{
		icon: 'fal fa-rectangle-history',
		label: 'General'
	},
	{
		icon: 'fal fa-image',
		label: 'Poster'
	},
	{
		icon: 'fal fa-info',
		label: 'Information'
	}
];

export default (props: DialogProps) => {
	const inputFile = useRef<HTMLInputElement>(null); // Ref to input file
	const [editPost] = useMutation(EDIT_POST); // Mutation hook for editing a post
	const { id } = useParams(); // Get the post ID from URL parameters

	// Fetch the post data
	const { data } = useQuery<Posts>(GET_POST, {
		variables: { id }
	});

	// Create form
	const form = createFormData({
		defineKeys: {
			title: 'string',
			tags: 'string', // JSON array
			description: 'string',
			pageGradient: 'boolean',
			info: null
		}
	});

	const [tab, setTab] = useState('general'); // Current tab

	// Check if data is available
	if (!data) return <></>;

	const post = data.posts[0];

	useEffect(() => {
		// Set initial data
		if (form.isEmpty() && post) {
			form.setInitData(post);
		}
	}, []);

	// Function to handle form submission
	const onSubmit = async () => {
		console.log(form.getData());

		try {
			// Perform the mutation to update the post
			await editPost({
				variables: {
					id: post.id,
					data: form.getData()
				}
			});

			// Create an activity log
			createActivity('actions', `He updated a post.`, {
				id: post.id,
				newData: form.getData()
			});

			// Success
			toast.success('Post updated successfully');
		} catch {
			// Error
			toast.error('Failed to update post');
		}
	};

	// Function to handle poster change
	const onChangePoster = () => {
		if (!inputFile.current) return false;
		inputFile.current.click();
	};

	// Function to handle poster upload
	const onUploadPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			// Upload the poster file
			await uploadPoster(post.id, file);

			// Refresh the list of posters
			refetchPosters();

			// Create an activity log
			createActivity('actions', 'Changed the poster of a post.', { id: post.id });

			// Success
			toast.success('Poster uploaded successfully');
		}
	};

	return (
		<Dialog
			className="dialog-edit-post"
			onClose={props.onClose}
			open={props.open}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Edit Post</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						flexGrow: 1,
						columnGap: '20px',
						display: 'flex',
						height: '100%',
						width: '100%'
					}}
				>
					<Tabs
						onChange={(_, v) => setTab(v)}
						orientation="vertical"
						value={tab}
						sx={{
							borderRight: 1
						}}
					>
						{tabs.map((tab, i) => (
							<Tab
								icon={<i className={tab.icon} />}
								value={tab.label.toLowerCase()}
								iconPosition="start"
								label={tab.label}
								key={i}
							/>
						))}
					</Tabs>

					<div className={`tab-content tab-${tab}`}>
						{tab === 'general' && (
							<>
								<TextField
									onChange={({ target: { value } }) =>
										form.update('title', value)
									}
									value={form.getData().title}
									label="Title"
									type="text"
									fullWidth
								/>

								<Autocomplete
									onChange={(_, value) =>
										form.update('tags', JSON.stringify(value))
									}
									value={
										form.getData().tags ? JSON.parse(form.getData().tags) : []
									}
									options={[]}
									multiple
									freeSolo
									renderInput={(params) => (
										<TextField {...params} variant="outlined" label="Tags" />
									)}
								/>

								<div>
									<TextareaAutosize
										onChange={({ target: { value } }) =>
											form.update('description', value)
										}
										value={form.getData().description}
										placeholder="Your description"
										maxRows={20}
										minRows={2}
									/>
								</div>

								<FormControlLabel
									control={
										<Switch defaultChecked={form.getData().pageGradient} />
									}
									onChange={(_, c) => form.update('pageGradient', c)}
									label={
										<>
											Page gradient generation{' '}
											<Chip label="BETA" size="small"></Chip>
										</>
									}
								/>

								<Button
									color="error"
									fullWidth
									variant="contained"
									startIcon={<i className="fas fa-trash" />}
									onClick={() => showDialog('delete-post')}
								>
									Delete
								</Button>
							</>
						)}

						{tab === 'poster' && (
							<>
								<Poster id={post.id} />

								<Button
									startIcon={<i className="fas fa-upload" />}
									onClick={onChangePoster}
									variant="contained"
									fullWidth
								>
									UPLOAD
								</Button>

								<input
									accept=".png, .jpg, .jpeg"
									onChange={onUploadPoster}
									ref={inputFile}
									type="file"
									hidden
								/>
							</>
						)}

						{tab === 'information' && (
							<MDEditor
								onChange={(value) => form.update('info', value)}
								value={form.getData().info}
								extraCommands={[]}
								height={'100%'}
								preview="edit"
							/>
						)}
					</div>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>Close</Button>
				{tab !== 'poster' && (
					<Button onClick={onSubmit} disabled={!form.validate() || form.isSame(post)}>
						Save
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};
