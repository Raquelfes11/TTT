import unittest
import threading
import requests
from http.server import HTTPServer
from servidor import SimpleHTTPRequestHandler  

class TestSimpleHTTPServer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Configura el servidor en un hilo separado
        cls.server_address = ('localhost', 8000)
        cls.httpd = HTTPServer(cls.server_address, SimpleHTTPRequestHandler)
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever)
        cls.server_thread.daemon = True  # Permite detener el hilo cuando las pruebas terminen
        cls.server_thread.start()

    @classmethod
    def tearDownClass(cls):
        # Detiene el servidor después de las pruebas
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.server_thread.join()

    def test_get_request(self):
        # Realiza una solicitud GET al servidor
        response = requests.get(f'http://{self.server_address[0]}:{self.server_address[1]}')

        # Verifica que el servidor responde con un código de estado 200
        self.assertEqual(response.status_code, 200)

        # Verifica que el contenido sea de tipo HTML
        self.assertIn("text/html", response.headers['Content-Type'])

        # Verifica que el contenido HTML esperado esté en la respuesta
        self.assertIn("<h1>Hola desde un servidor Python</h1>", response.text)
        self.assertIn("<p>Este es un servidor simple que responde a solicitudes GET.</p>", response.text)
        self.assertIn("<img src=https://www.google.com/imgres?q=pulpo%20toad&imgurl=https%3A%2F%2Fw7.pngwing.com%2Fpngs%2F522%2F932%2Fpng-transparent-super-mario-bros-2-toad-octopus-ball-child-super-mario-bros-hand.png&imgrefurl=https%3A%2F%2Fwww.pngwing.com%2Fes%2Ffree-png-npibe&docid=4ELof4WGVUXZ_M&tbnid=MHF6lkRwpDirrM&vet=12ahUKEwjSz_Pt0omLAxW3RPEDHYXJMdIQM3oECHAQAA..i&w=920&h=786&hcb=2&ved=2ahUKEwjSz_Pt0omLAxW3RPEDHYXJMdIQM3oECHAQAA>", response.text)


if __name__ == '__main__':
    unittest.main()
