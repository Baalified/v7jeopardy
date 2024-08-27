const net = require('net');
const readline = require('readline');

const colorChangeInterval = 1000;

// Create an interface to read input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var mySocket = undefined;

// Create the server
const server = net.createServer((socket) => {
  console.log('Buzzer connected:', socket.remoteAddress);
  mySocket = socket;

  // Handle incoming data from the buzzer
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
  });

  // Handle buzzer disconnection
  socket.on('end', () => {
    console.log('Buzzer disconnected:', socket.remoteAddress);
    clearInterval(colorInterval); // Clear the interval when the buzzer disconnects
    rl.close(); // Close the readline interface
  });

  // Handle socket errors
  socket.on('error', (err) => {
    console.error('Socket error:', err);
    clearInterval(colorInterval); // Clear the interval on error
    rl.close(); // Close the readline interface
  });
});

// Start the server
server.listen(8080, '0.0.0.0', () => {
  console.log('Server listening on port 8080');
});

// Function to prompt the user for RGB values and send the command
function sendColorCommand() {
  rl.question('Enter RGB values as "R G B": ', (answer) => {
    const [r, g, b] = answer.split(' ').map((value) => {
      return Math.min(Math.max(parseInt(value, 10), 0), 255).toString().padStart(3, '0');
    });

    const command = `LED ${r} ${g} ${b}\n`;
    mySocket.write(command);
    console.log('Sent command:', command.trim());
    sendColorCommand();
  });
}

sendColorCommand();