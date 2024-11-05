const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Configuración de conexión SQL Server
const sqlConfig = {
    driver: 'ODBC Driver 18 for SQL Server',
    server: 'thor',
    database: 'mango',
    user: 'sa',
    password: 'rubbertape'
};

// Cadena de conexión construida
const connStr = (
    `DRIVER=${sqlConfig.driver};` +
    `SERVER=${sqlConfig.server};` +
    `DATABASE=${sqlConfig.database};` +
    `UID=${sqlConfig.user};` +
    `PWD=${sqlConfig.password};` +
    'TrustServerCertificate=yes;'
);

app.get('/madmcia', async (req, res) => {
    try {
        const pool = await sql.connect(connStr);
        
        // Ejecuta el SELECT para obtener todos los datos de la tabla 'madmcia'
        const result = await pool.request().query('SELECT * FROM madmcia');
        
        // Obtiene los nombres de las columnas automáticamente
        const columnNames = Object.keys(result.recordset.columns);

        // Convierte las imágenes a base64 si existen
        const registros = result.recordset.map(registro => ({
            ...registro,
            imagen: registro.imagen ? Buffer.from(registro.imagen).toString('base64') : null
        }));
        
        // Genera el HTML directamente en la respuesta
        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Datos de madmcia</title>
            </head>
            <body>
                <h1>Datos de la tabla madmcia</h1>
                <table border="1">
                    <thead>
                        <tr>
                            ${columnNames.map(col => `<th>${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Itera sobre los registros para generar el HTML de cada fila
        registros.forEach(registro => {
            html += `<tr>`;
            columnNames.forEach(col => {
                if (col === 'imagen' && registro[col]) {
                    html += `<td><img src="data:image/png;base64,${registro[col]}" width="50" height="50" alt="Imagen"></td>`;
                } else {
                    html += `<td>${registro[col] || ''}</td>`;
                }
            });
            html += `</tr>`;
        });

        // Cierra la tabla y el resto del HTML
        html += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        res.send(html);
    } catch (err) {
        console.error('Error al obtener los datos de madmcia:', err);
        res.status(500).send('Error al obtener los datos');
    } finally {
        sql.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Manejador de errores global
process.on('uncaughtException', err => {
    console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', err => {
    console.error('Rechazo de promesa no manejado:', err);
});
