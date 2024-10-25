import pyodbc



# Cadena de conexión
conn_str= "Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=hoa;UID=SA;PWD=MTp070213.;TrustServerCertificate=yes;"

try:
    # Establece la conexión
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        
        # Realiza una consulta de ejemplo
        cursor.execute("SELECT * FROM users")
        rows = cursor.fetchall()
        
        for row in rows:
            print(row)

except Exception as e:
    print("Error al conectar a la base de datos:", e)
