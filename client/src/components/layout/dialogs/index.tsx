// Dependencies
import { Fragment, useEffect, useState } from 'react';
import deleteLibrary from './templates/delete-library';
import editLibrary from './templates/edit-library';
import newLibrary from './templates/new-library';
import deletePost from './templates/delete-post';
import editPost from './templates/edit-post';

// Define the available templates with their corresponding IDs
const templates = {
	'delete-library': deleteLibrary,
	'edit-library': editLibrary,
	'delete-post': deletePost,
	'new-library': newLibrary,
	'edit-post': editPost
} as const;

// Types
type TemplateIds = keyof typeof templates;
export interface DialogProps {
	payload?: Record<string, any>;
	onClose: () => void;
	open: boolean;
}
type Dialogs = any[];

// Function to show a dialog by ID with an optional payload
export const showDialog = (id: TemplateIds, payload?: Record<string, any>): void => {
	document.dispatchEvent(new CustomEvent('dialogs:show', { detail: { id, payload } }));
};

// Function to close a dialog by ID
export const closeDialog = (id: TemplateIds): void => {
	document.dispatchEvent(new CustomEvent('dialogs:close', { detail: id }));
};

export default () => {
	// Initialize state to manage the open dialogs
	const [dialogs, setDialogs] = useState<Dialogs>([]);

	// Event listener function to show a dialog
	const onRequestShow = ({ detail: { id, payload } }: any) => {
		setDialogs((prevDialogs) =>
			prevDialogs.concat({
				onClose: () => onRequestClose({ detail: id }),
				payload: payload || undefined,
				open: true,
				id
			})
		);
	};

	// Event listener function to close a dialog
	const onRequestClose = ({ detail: id }: any) => {
		setDialogs((prevDialogs) =>
			prevDialogs.map((dialog) => {
				if (dialog.id === id) {
					// Delay removing the dialog from the state to allow for closing animation
					setTimeout(() => {
						setDialogs((prevDialogs) =>
							prevDialogs.filter((dialog) => dialog.id !== id)
						);
					}, 100);

					return { ...dialog, open: false };
				}
				return dialog;
			})
		);
	};

	useEffect(() => {
		// Add event listeners for showing and closing dialogs
		document.addEventListener('dialogs:show', onRequestShow);
		document.addEventListener('dialogs:close', onRequestClose);

		// Clean up event listeners on unmount
		return () => {
			document.removeEventListener('dialogs:show', onRequestShow);
			document.removeEventListener('dialogs:close', onRequestClose);
		};
	}, []);

	return (
		<Fragment>
			{dialogs.map((dialog) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const Component = templates[dialog.id];
				return <Component key={dialog.id} {...dialog} />;
			})}
		</Fragment>
	);
};
