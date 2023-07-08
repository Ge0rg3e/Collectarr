// Dependencies
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import Page from '@components/layout/page';

export default () => {
	// Get the navigation function from React Router
	const nav = useNavigate();

	return (
		<Page name="404" hideLayout>
			<IconButton onClick={() => nav('/')} className="back">
				<i className="fas fa-arrow-left" />
			</IconButton>

			<div className="code">404</div>
			<div className="msg">Not Found</div>
		</Page>
	);
};
