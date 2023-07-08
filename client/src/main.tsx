// Dependencies
import { RouterProvider } from 'react-router-dom';
import Graphql from '@utils/graphql/index';
import ReactDOM from 'react-dom/client';
import router from '@utils/router';
import Theme from '@utils/theme';
import './theme/main.scss';

// Define the main component
const App = () => {
	return (
		<Theme>
			<Graphql>
				<RouterProvider router={router} />
			</Graphql>
		</Theme>
	);
};

// Render
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
