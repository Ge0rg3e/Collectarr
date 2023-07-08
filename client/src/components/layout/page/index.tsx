// Dependencies
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../sidebar';
import Dialogs from '../dialogs';
import Header from '../header';

interface Props {
	name: string;
	hideLayout?: true;
	children: ReactNode;
}

export default (props: Props) => {
	useEffect(() => {
		document.title = `Collectarr - ${props.name}`;
		return () => {
			document.title = 'Collectarr';
		};
	});

	return (
		<div className="page-body">
			{!props.hideLayout && <Header />}

			{!props.hideLayout && <Sidebar />}
			<div className={`page-container page-${props.name.toLowerCase()}`}>
				{props.children}
			</div>

			<Toaster
				position="bottom-center"
				toastOptions={{
					style: {
						backgroundColor: '#10121c',
						color: '#fcfdfd'
					}
				}}
				reverseOrder={false}
			/>
			<Dialogs />
		</div>
	);
};
