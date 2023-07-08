// Dependencies
import { type Posts, SEARCH_WHERE_TAG, SEARCH_WHERE_TITLE } from '@utils/graphql/posts';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getSession } from '@utils/graphql/users';
import Poster from '@components/shared/poster';
import Page from '@components/layout/page';
import { useQuery } from '@apollo/client';

export default () => {
	// Get the search content from the URL parameters
	const { content: searchContent } = useParams();

	const session = getSession();
	const nav = useNavigate();

	// Check the user session and redirect to the login page if there is no active session
	if (session === null) return <Navigate to="/login" />;

	// Check if the search content exists
	if (!searchContent) return <Navigate to="/" />;

	// Use the useQuery hook to perform the GraphQL query based on the search type (tag or title)
	const { data } = useQuery<Posts>(
		searchContent?.includes('#') ? SEARCH_WHERE_TAG : SEARCH_WHERE_TITLE,
		{ variables: { content: `%${searchContent?.replace('#', '')}%` } }
	);

	// If data is null, return
	if (!data) return <></>;

	return (
		<Page name="Search">
			{!data.posts.length && (
				<div className="notFound">
					<div className="msg">No posts found</div>
				</div>
			)}

			<div className="entrys">
				{data.posts.map((entry: any, i: number) => (
					<div
						className={`entry`}
						style={{
							width: JSON.parse(entry.poster_size)[0],
							height: JSON.parse(entry.poster_size)[1]
						}}
						onClick={() => nav(`/post/${entry.id}`)}
						key={i}
					>
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
