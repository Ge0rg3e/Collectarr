// Dependencies
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const Theme = (props: { children: ReactNode }) => {
	const theme = createTheme({
		typography: {
			fontFamily: ['Sohne'].join(',')
		},

		palette: {
			mode: 'dark',
			text: {
				primary: '#fcfdfd'
			},
			primary: {
				main: '#5b43f5'
			},
			background: {
				default: '#0d0f18'
			}
		}
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{props.children}
		</ThemeProvider>
	);
};

export default Theme;
