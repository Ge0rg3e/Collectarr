// Dependencies
import { getContentType } from '../utils/helpers';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import Vibrant from 'node-vibrant';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

// Vars
const allowedExtensions = ['png', 'jpg', 'jpeg'];

// Initialize Express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.json());
app.use(cors());

// Endpoints
// Endpoint for handling PUT request to upload a poster
app.put('/poster', async (req, res) => {
	try {
		if (!req.files || !req.files.img || !req.body.id) return res.sendStatus(401);

		const poster = Array.isArray(req.files.img) ? req.files.img[0] : req.files.img;
		const extension = poster.name.split('.').pop()?.toLowerCase();

		if (!extension || !allowedExtensions.includes(extension)) return res.sendStatus(400);

		const id = req.body.id;
		const filePaths = allowedExtensions.map((ext) => `../uploads/${id}.${ext}`);

		// Delete existing files with the same ID
		filePaths.forEach((filePath) => {
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
		});

		const newFileName = `${id}.${extension}`;
		const filePath = `../uploads/${newFileName}`;

		poster.mv(filePath);

		res.status(200).send(id);
	} catch {
		res.sendStatus(500);
	}
});

// Endpoint for handling GET request to retrieve a poster
app.get('/poster/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const path = `../uploads/${id}`;

		const filePath = allowedExtensions.map((extension) => `${path}.${extension}`).find((potentialPath) => fs.existsSync(potentialPath));

		if (!filePath) return res.sendStatus(404);

		const contentType = getContentType(filePath);
		res.set('Content-Type', contentType);

		const fileContent = fs.readFileSync(filePath);

		const palette = await Vibrant.from(fileContent).getPalette();
		res.set('Color-Palette', JSON.stringify(palette));

		res.status(200).send(fileContent);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

// Endpoint for handling DELETE request to delete a poster
app.delete('/poster/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const filePaths = allowedExtensions.map((ext) => `../uploads/${id}.${ext}`);

		filePaths.forEach((filePath) => {
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
		});

		res.sendStatus(200);
	} catch {
		res.sendStatus(500);
	}
});

// Start the server
app.listen(3333, () => console.log('Server is listening on port :3333'));
