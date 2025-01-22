from http.server import BaseHTTPRequestHandler, HTTPServer

# Define el manejador de las solicitudes HTTP
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Define la respuesta HTTP
        self.send_response(200)  # Código 200 significa que la solicitud fue exitosa
        self.send_header("Content-type", "text/html")
        self.end_headers()

        # Contenido HTML que queremos devolver
        html_content = """<!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Servidor Python</title>
        </head>
        <body>
            <h1>Hola desde un servidor Python</h1>
            <p>Este es un servidor simple que responde a solicitudes GET.</p>
            <img src=https://www.google.com/imgres?q=pulpo%20toad&imgurl=https%3A%2F%2Fw7.pngwing.com%2Fpngs%2F522%2F932%2Fpng-transparent-super-mario-bros-2-toad-octopus-ball-child-super-mario-bros-hand.png&imgrefurl=https%3A%2F%2Fwww.pngwing.com%2Fes%2Ffree-png-npibe&docid=4ELof4WGVUXZ_M&tbnid=MHF6lkRwpDirrM&vet=12ahUKEwjSz_Pt0omLAxW3RPEDHYXJMdIQM3oECHAQAA..i&w=920&h=786&hcb=2&ved=2ahUKEwjSz_Pt0omLAxW3RPEDHYXJMdIQM3oECHAQAA>
        </body>
        </html>"""

        # Escribir el contenido HTML en la respuesta
        self.wfile.write(html_content.encode("utf-8"))

# Configura el servidor
if __name__ == "__main__":
    # Define la dirección y el puerto
    server_address = ("", 8000)  # Escucha en todas las interfaces en el puerto 8000
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

    print("Servidor corriendo en el puerto 8000...")
    try:
        httpd.serve_forever()  # Mantiene el servidor ejecutándose
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        httpd.server_close()
