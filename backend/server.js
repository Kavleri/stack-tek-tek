require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/status', (req, res) => {
	res.json({
		message: 'Backend berhasil nyambung ke Frontend!',
		databaseStatus: 'Sedang pakai data DUMMY lokal (belum konek MySQL beneran)',
		dummyData: {
			client: 'Kavleri',
			event: 'Dream Syariah Wedding',
		},
	});
});

app.listen(port, () => {
	console.log(`Backend jalan di http://localhost:${port}`);
});
