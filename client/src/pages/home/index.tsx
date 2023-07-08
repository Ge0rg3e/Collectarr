import { getSession } from '@utils/graphql/users';
import { Navigate } from 'react-router-dom';
import Page from '@components/layout/page';

export default () => {
	const session = getSession();

	if (session === null) return <Navigate to="/login" />;

	return <Page name="Home">home</Page>;
};
