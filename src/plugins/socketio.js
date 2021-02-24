import io from 'socket.io-client';

let socket;

const localIP = 'localhost';
const networkIP = '127.0.0.1';
const port = 4050;
const networkConnection = false;

function initialiseSocket() {
  const url = networkConnection
    ? `http://${networkIP}:${port}`
    : `http://${localIP}:${port}`;

  socket = io(url);

  return socket;
}
export default initialiseSocket();
