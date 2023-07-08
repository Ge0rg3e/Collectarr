// Dependencies
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// Types
interface Props {
	id: string;
	action?: {
		onClick: () => void;
		icon: string;
	};
	config?: {
		pageGradient?: boolean;
	};
}

// Function to trigger a custom event for refetching posters
export const refetchPosters = (): void => {
	document.dispatchEvent(new Event('posterRefetch'));
};

// Function to get a poster by ID
export const getPoster = async (id: string) => {
	const res = await axios.get(`/server/poster/${id}`, {
		responseType: 'arraybuffer'
	});

	const blob = new Blob([res.data], {
		type: res.headers['content-type']
	});

	return {
		colorPalette: JSON.parse(res.headers['color-palette']),
		image: URL.createObjectURL(blob)
	};
};

// Function to upload a poster
export const uploadPoster = async (id: string, content: File) => {
	try {
		const data = new FormData();
		data.append('img', content);
		data.append('id', id);

		await axios.put('/server/poster', data);
	} catch (err) {
		return err;
	}
};

// Function to delete a poster
export const deletePoster = async (id: string) => {
	try {
		await axios.delete(`/server/poster/${id}`);
	} catch (err) {
		return err;
	}
};

export default (props: Props) => {
	const [colorPalette, setColorPalette] = useState<any>(null); // State variable to store the color palette of the poster
	const [src, setSrc] = useState<string | null>(null); // State variable to store the image source of the poster
	const ref = useRef<HTMLDivElement>(null); // Ref object to reference the HTML div element

	// Function to fetch the poster data
	const get = async () => {
		try {
			const poster = await getPoster(props.id);

			setSrc(`${poster.image}`);
			setColorPalette(poster.colorPalette);
		} catch (err: any) {
			console.log(err);
			if (err.response.status === 404) {
				return setSrc('/images/imageNotFound.png');
			}
		}
	};

	useEffect(() => {
		// Fetch the poster data and add event listener for posterRefetch event
		get();

		document.addEventListener('posterRefetch', get);

		// Cleanup: remove the event listener
		return () => {
			document.removeEventListener('posterRefetch', get);
		};
	}, []);

	useEffect(() => {
		// Apply page gradient effect if colorPalette and pageGradient config are available
		if (!colorPalette || !props.config?.pageGradient) return;

		const { DarkVibrant, LightMuted, LightVibrant, Muted } = colorPalette;

		const existingDiv = document.getElementById('pageGradient');
		if (existingDiv) {
			document.body.removeChild(existingDiv);
		}

		const div = document.createElement('div');
		div.id = 'pageGradient';

		Object.assign(div.style, {
			animation: '_fadeIn 0.5s forwards',
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			zIndex: -1,
			filter: 'blur(4px)',
			background: `
            radial-gradient(circle farthest-side at 0% 100%, rgba(${DarkVibrant.rgb}, 0.1) 0%, rgba(48, 36, 25, 0) 100%),
            radial-gradient(circle farthest-side at 100% 100%, rgba(${LightMuted.rgb}, 0.1) 0%, rgba(77, 63, 50, 0) 100%),
            radial-gradient(circle farthest-side at 100% 0%, rgba(${LightVibrant.rgb}, 0.1) 0%, rgba(41, 38, 33, 0) 100%),
            radial-gradient(circle farthest-side at 0% 0%, rgba(${Muted.rgb}, 0.1) 0%, rgba(77, 55, 36, 0) 100%),
            black
          `
		});

		document.body.appendChild(div);

		return () => {
			document.body.removeChild(div);
		};
	}, [colorPalette, props.config?.pageGradient]);

	if (!src) return <></>;

	return (
		<div
			className="component-poster"
			style={{
				backgroundImage: `url('${src}')`
			}}
			ref={ref}
		>
			{props.action && (
				<div className="action" onClick={props.action.onClick}>
					<div className="icon">
						<i className={props.action.icon} />
					</div>
				</div>
			)}
		</div>
	);
};
