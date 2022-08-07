from Server.server import *
import socket

if __name__ == '__main__':
    #s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    #s.connect(('8.8.8.8', 80))
    #PATH = s.getsockname()[0]
    PATH = "localhost"
    PORT = 8080
    print('------------------------------------------------------------')
    print("Connect to '{}:{}/' to access the website.".format(str(PATH), str(PORT)))
    print('------------------------------------------------------------\n')

    httpd = HTTPServer((PATH, PORT), Server)
    httpd.serve_forever()

