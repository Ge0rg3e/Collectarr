import { Activities, GET_ACTIVITIES_FOR_USER } from '@utils/graphql/activities';
import { getSession } from '@utils/graphql/users';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';

// Component
const renderPayload = (data: any, action: string) => {
	let content = JSON.stringify(data, null, 4); // Convert the data object to a formatted JSON string

	content = content.replaceAll('\\', ''); // Remove any backslashes from the content

	// If the action is related to a post
	if (action.includes('post')) {
		// Make the post id interactive by replacing it with an HTML link
		content = content.replace(
			`"id": "${data.id}"`,
			`"id": <a href="/post/${data.id}">"${data.id}"</a>`
		);
	}

	// If the action is related to a library
	if (action.includes('library')) {
		// Make the library id interactive by replacing it with an HTML link
		content = content.replace(
			`"id": "${data.id}"`,
			`"id": <a href="/library/${data.id}">"${data.id}"</a>`
		);
	}

	// Return the content wrapped in a pre tag with the payload class,
	// using dangerouslySetInnerHTML to insert the HTML content
	return <pre className="payload" dangerouslySetInnerHTML={{ __html: content }}></pre>;
};

export default () => {
	const [activitiesType, setActivitiesType] = useState('auth'); // Activity selector
	const session = getSession();

	// Query data using GET_ACTIVITIES_FOR_USER
	const { data } = useQuery<Activities>(GET_ACTIVITIES_FOR_USER, {
		variables: {
			where: `%${activitiesType === 'auth' ? session?.email : session?.id}%`,
			type: activitiesType
		}
	});

	return (
		<div className="card">
			<div className="card-header">
				<div className="card-title">Activity</div>

				<FormControl>
					<InputLabel>Type</InputLabel>
					<Select
						onChange={(e) => setActivitiesType(e.target.value)}
						input={<OutlinedInput label="Name" />}
						size="small"
						value={activitiesType}
					>
						<MenuItem value={'auth'}>Auth</MenuItem>
						<MenuItem value={'actions'}>Actions</MenuItem>
					</Select>
				</FormControl>
			</div>

			<br />

			{data && (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Session</TableCell>
								<TableCell>Message</TableCell>
								<TableCell>Payload</TableCell>
								<TableCell>Date Time</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.activities.map((row, i) => {
								const payload = JSON.parse(row.payload);
								const session = payload.session;

								delete payload.session;

								return (
									<TableRow
										key={i}
										sx={{
											'&:last-child td, &:last-child th': { border: 0 }
										}}
									>
										<TableCell component="th" scope="row">
											{session ? (
												<>
													{session.username} {session.email}
												</>
											) : (
												<>None</>
											)}
										</TableCell>

										<TableCell component="th" scope="row">
											{row.message}
										</TableCell>

										<TableCell component="th" scope="row">
											{renderPayload(payload, row.message)}
										</TableCell>

										<TableCell component="th" scope="row">
											{dayjs(row.created_at).format('MMMM Do YYYY, h:mm:ss')}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	);
};
