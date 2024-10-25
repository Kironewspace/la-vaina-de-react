const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: 'SA',
    password: 'MTp070213.',
    server: 'localhost', // e.g., localhost
    database: 'hoa',
    options: {
        encrypt: true, // Para Azure
        trustServerCertificate: true, // Cambiar según el entorno
    },
};

sql.connect(config)
    .then(pool => {
        app.get('/api/datos', async (req, res) => {
            try {
                const result = await pool.request().query('SELECT * FROM users');
                res.json(result.recordset);
            } catch (err) {
                res.status(500).send(err.message);
            }
        });

        app.listen(3001, () => {
            console.log('Servidor corriendo en http://localhost:3001');
        });
    })
    .catch(err => console.error('el codigo tuyo ta malo, buen mielda:', err));
