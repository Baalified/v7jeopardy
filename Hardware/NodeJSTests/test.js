const net = require('net');

// Set the interval for sending random color commands (in milliseconds)
const colorChangeInterval = 5000;

// Function to generate a random color command
function getRandomColorCommand() {
  const r = Math.floor(Math.random() * 256).toString().padStart(3, '0');
  const g = Math.floor(Math.random() * 256).toString().padStart(3, '0');
  const b = Math.floor(Math.random() * 256).toString().padStart(3, '0');
  return `LED ${r} ${g} ${b}\n`;
}

// Create the server
const server = net.createServer((socket) => {
  console.log('Buzzer connected:', socket.remoteAddress);

  // Set an interval to send random color commands to the connected buzzer
  const colorInterval = setInterval(() => {
    const command = getRandomColorCommand();
    socket.write(command);
    console.log('Sent command:', command.trim());
  }, colorChangeInterval);

  // Handle incoming data from the buzzer
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
  });

  // Handle buzzer disconnection
  socket.on('end', () => {
    console.log('Buzzer disconnected:', socket.remoteAddress);
    clearInterval(colorInterval); // Clear the interval when the buzzer disconnects
  });

  // Handle socket errors
  socket.on('error', (err) => {
    console.error('Socket error:', err);
    clearInterval(colorInterval); // Clear the interval on error
  });
});

// Start the server
server.listen(8080, '0.0.0.0', () => {
  console.log('Server listening on port 8080');
});
