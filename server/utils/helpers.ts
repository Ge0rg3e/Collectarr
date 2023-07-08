export const getContentType = (file: string | undefined): string => {
	if (!file) {
		return 'application/octet-stream';
	}

	const extension = file.split('.').pop()?.toLowerCase();
	switch (extension) {
		case 'png':
			return 'image/png';
		case 'jpeg':
		case 'jpg':
			return 'image/jpeg';
		default:
			return 'application/octet-stream';
	}
};
