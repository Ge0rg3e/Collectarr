// Dependencies
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';

// Types
interface Props {
	onChange: (value: string) => void;
	defaultValue?: string;
	value?: string;
}

// Define icons
const icons = [
	'fas fa-rectangle-history',
	'fas fa-music',
	'fas fa-headphones',
	'fas fa-film',
	'fas fa-camera',
	'fas fa-image',
	'fas fa-video',
	'fas fa-television',
	'fas fa-newspaper',
	'fas fa-book',
	'fas fa-microphone',
	'fas fa-headset',
	'fas fa-gamepad',
	'fas fa-tv',
	'fas fa-radio',
	'fas fa-podcast',
	'fas fa-theater-masks',
	'fas fa-file-audio',
	'fas fa-chess',
	'fas fa-chess-king',
	'fas fa-chess-queen',
	'fas fa-chess-rook',
	'fas fa-chess-bishop',
	'fas fa-chess-knight',
	'fas fa-gamepad',
	'fas fa-gamepad-alt',
	'fas fa-puzzle-piece',
	'fas fa-football-ball',
	'fab fa-xbox'
];

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 224,
			width: 250
		}
	}
};

export default (props: Props) => {
	return (
		<FormControl fullWidth>
			<InputLabel>Icon</InputLabel>
			<Select
				onChange={(e) => props.onChange(e.target.value)}
				input={<OutlinedInput label="Name" />}
				defaultValue={props.defaultValue}
				MenuProps={MenuProps}
				value={props.value}
			>
				{icons.map((icon, i) => (
					<MenuItem key={i} value={icon}>
						<i className={icon} /> {icon.replace('fas fa-', '').replace('fab fa-', '')}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
