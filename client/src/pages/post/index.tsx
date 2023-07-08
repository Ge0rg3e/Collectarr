// Dependencies
import { Chip, Divider, Tab, Tabs, TextareaAutosize } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { GET_POST, type Posts } from '@utils/graphql/posts';
import { showDialog } from '@components/layout/dialogs';
import { getSession } from '@utils/graphql/users';
import Poster from '@components/shared/poster';
import MDEditor from '@uiw/react-md-editor';
import Page from '@components/layout/page';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import dayjs from 'dayjs';

export default () => {
	// Initialize state for the selected tab
	const [tab, setTab] = useState('information');

	// Get the current session and URL parameter
	const session = getSession();
	const { id } = useParams();

	// Get the navigation function from React Router
	const nav = useNavigate();

	// Redirect to the login page if there is no session
	if (session === null) return <Navigate to="/login" />;

	// Query the post data using the useQuery hook
	const { data } = useQuery<Posts>(GET_POST, {
		variables: { id }
	});

	// If data is null, return
	if (!data) return <></>;

	// Get the post from the query result
	const post = data.posts[0];

	return (
		<Page name="Post">
			<div className="top">
				<Poster
					action={{
						onClick: () => showDialog('edit-post'),
						icon: 'fas fa-pen-to-square'
					}}
					id={post.id}
					config={{
						pageGradient: post.pageGradient
					}}
				/>

				<div className="content">
					<div className="title">{post.title}</div>

					<div className="createdAt">
						Created at {dayjs(post.created_at).format('MMMM Do YYYY, h:mm:ss')}
					</div>

					<TextareaAutosize value={post.description} maxRows={20} minRows={2} readOnly />

					<div className="tags">
						{JSON.parse(post.tags).map((tag: string, i: number) => (
							<div
								key={i}
								onClick={() => nav(`/search/${encodeURIComponent(`#${tag}`)}`)}
							>
								<Chip label={tag} style={{ cursor: 'pointer' }} />
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="content">
				<Tabs onChange={(_, v) => setTab(v)} value={tab}>
					<Tab label="Information" value="information" />
					<Tab label="Gallery" value="gallery" />
				</Tabs>

				<Divider />

				{tab === 'information' && (
					<div className="tab-content">
						<MDEditor.Markdown source={post.info || 'No information'} />
					</div>
				)}

				{tab === 'gallery' && <div className="tab-content">gallery tab</div>}
			</div>
		</Page>
	);
};
