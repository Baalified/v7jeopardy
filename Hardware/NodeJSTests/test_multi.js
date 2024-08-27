const net = require('net');
const readline = require('readline');

// Create an interface to read input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Array to store connected buzzers
let buzzers = [];

// Flag to determine if a buzzer press can be handled
let canBuzz = true;

// Function to generate a random color command
function getRandomColorCommand() {
  const r = Math.floor(Math.random() * 256).toString().padStart(3, '0');
  const g = Math.floor(Math.random() * 256).toString().padStart(3, '0');
  const b = Math.floor(Math.random() * 256).toString().padStart(3, '0');
  return `LED ${r} ${g} ${b}\n`;
}

// Function to assign a random color to all buzzers
function assignRandomColorToAllBuzzers() {
  const colorCommand = getRandomColorCommand();
  buzzers.forEach(buzzer => {
    buzzer.socket.write(colorCommand);
    console.log(`Assigned color to ${buzzer.name}: ${colorCommand.trim()}`);
  });
}

// Create the server
const server = net.createServer((socket) => {
  console.log('Buzzer connected:', socket.remoteAddress);

  // Get the buzzer's unique identifier (e.g., MAC address)
  const uniqueId = socket.remoteAddress; // You can replace this with MAC if you have it

  // Check if this buzzer was already connected before
  let buzzer = buzzers.find(b => b.uniqueId === uniqueId);
  if (!buzzer) {
    // New buzzer, add to the array with a name and unique ID
    buzzer = {
      name: `Buzzer${buzzers.length + 1}`,
      uniqueId: uniqueId,
      socket: socket
    };
    buzzers.push(buzzer);
    console.log(`New buzzer added: ${buzzer.name}`);
  } else {
    // Reconnected buzzer, update the socket
    buzzer.socket = socket;
    console.log(`Buzzer reconnected: ${buzzer.name}`);
  }

  // Assign a random color to the newly connected buzzer
  assignRandomColorToAllBuzzers();

  // Handle incoming data from the buzzer
  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`${buzzer.name} sent: ${message}`);

    if (message === 'BUZZ' && canBuzz) {
      console.log(`${buzzer.name} buzzed in!`);

      // Turn off all buzzers except the one that buzzed
      buzzers.forEach(b => {
        const color = b === buzzer ? 'LED 255 255 255\n' : 'LED 000 000 000\n';
        b.socket.write(color);
        console.log(`${b.name} set to color: ${color.trim()}`);
      });

      canBuzz = false;

      // Wait for the server to receive 'ENTER' input
      rl.question('Press ENTER to continue...\n', () => {
        canBuzz = true;
        assignRandomColorToAllBuzzers();
      });
    }
  });

  // Handle buzzer disconnection
  socket.on('end', () => {
    console.log(`Buzzer disconnected: ${buzzer.name}`);
  });

  // Handle socket errors
  socket.on('error', (err) => {
    console.error(`Socket error with ${buzzer.name}:`, err);
  });
});

// Start the server
server.listen(8080, '0.0.0.0', () => {
  console.log('Server listening on port 8080');
});
