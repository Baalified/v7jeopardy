# Jeopardy Game Server

A full-stack Jeopardy-style game server application with support for multiple rounds, categories, questions, and hardware buzzer integration.

## Project Structure

```
gameserver-new/
├── client/          # React frontend application
│   ├── src/         # React source code
│   ├── public/      # Static assets
│   └── package.json # Client dependencies
├── server/          # Node.js/Express backend
│   ├── db/          # Database models and configuration
│   ├── config/      # Server configuration
│   ├── public/      # Media files (questions, answers, etc.)
│   ├── server.js    # Main server file with Socket.IO
│   ├── app.js       # Express app configuration
│   └── package.json # Server dependencies
└── README.md        # This file
```

## Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)
- **SQLite3** (included as npm dependency)

## Setup Instructions

### 1. Install Dependencies

Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Initialize the Database

The database is automatically created when you run the initialization script. To seed the database with sample game data:

```bash
cd server
node init_db_2025.js
```

**Warning:** This script will drop all existing tables and recreate them with sample data. Make sure to back up your database if you have existing game data.

### 3. Prepare Media Files

Place your media files (images, videos, audio) in the `server/public/media/` directory. The structure should follow the paths referenced in your questions. For example:

```
server/public/media/
├── questions/
│   ├── twitter/
│   │   ├── sparrow/
│   │   │   ├── image1.png
│   │   │   ├── image2.png
│   │   │   └── solution.png
│   │   └── ...
│   ├── movieframes/
│   ├── gummibears/
│   └── ...
└── resources/
```

## Starting the Application

### Development Mode

#### Option 1: Run Server and Client Separately

**Terminal 1 - Start the server:**
```bash
cd server
npm start
```

The server will start on port 3001 (or the port specified in `PORT` environment variable).

**Terminal 2 - Start the client:**
```bash
cd client
npm start
```

The client will start on port 3000 and automatically proxy API requests to the server.

#### Option 2: Build Client for Production

If you want to serve the client from the server:

```bash
# Build the React app
cd client
npm run build

# Start the server (which will serve the built client)
cd ../server
npm start
```

Then access the application at `http://localhost:3001`.

### Production Mode

1. Build the client:
```bash
cd client
npm run build
```

2. Start the server:
```bash
cd server
npm start
```

The server will serve both the API and the built React application.

## Accessing the Application

- **Player View:** `http://localhost:3000` (or `http://localhost:3001` if using production build)
- **Game Master View:** `http://localhost:3000/gm` (or `http://localhost:3001/gm`)

## Configuring a New Game with Multiple Rounds

To configure a new game, you'll need to modify the `server/init_db_2025.js` file. This file contains the complete game structure.

### Game Structure

A game consists of:
- **Game**: The top-level container
- **Rounds**: Multiple rounds within a game
- **Players**: Players associated with each round
- **Categories**: Categories within each round
- **Questions**: Questions within each category

### Step-by-Step Guide

#### 1. Create a Game

```javascript
const game = await Game.create({ name: 'Your Game Name' });
```

#### 2. Create Rounds

For each round in your game:

```javascript
const round1 = await Round.create({ name: "Round 1", GameId: game.id });
const round2 = await Round.create({ name: "Round 2", GameId: game.id });
// Add as many rounds as needed
```

#### 3. Create Players for Each Round

Players are specific to each round. Create players for each round:

```javascript
// Players for Round 1
await Player.bulkCreate([
  { name: 'Player 1', RoundId: round1.id },
  { name: 'Player 2', RoundId: round1.id },
  { name: 'Player 3', RoundId: round1.id },
  { name: 'Player 4', RoundId: round1.id },
]);

// Players for Round 2 (can be different players)
await Player.bulkCreate([
  { name: 'Player 2-1', RoundId: round2.id },
  { name: 'Player 2-2', RoundId: round2.id },
  // ...
]);
```

#### 4. Create Categories for Each Round

```javascript
const category = await Category.create({ 
  name: 'Category Name', 
  RoundId: round1.id 
});
```

#### 5. Create Questions for Each Category

Questions support multiple media types:

**Text Question:**
```javascript
await Question.create({
  question: 'What does "lol" stand for?',
  answer: 'Laughing out Loud',
  mediaType: 'text',
  points: 100,
  CategoryId: category.id
});
```

**Image Question:**
```javascript
await Question.create({
  question: '',
  answer: 'Captain Jack Sparrow',
  mediaType: 'image',
  mediaUrl: '/media/questions/twitter/sparrow/image1.png',
  answerMediaType: 'image',
  answerMediaUrl: '/media/questions/twitter/sparrow/solution.png',
  points: 100,
  CategoryId: category.id
});
```

**Video Question:**
```javascript
await Question.create({
  question: '',
  answer: 'Spanish',
  mediaType: 'video',
  mediaUrl: '/media/questions/gummibears/Spanish.mp4',
  points: 100,
  CategoryId: category.id
});
```

**Audio Question:**
```javascript
await Question.create({
  question: '',
  answer: 'Bohemian Rhapsody',
  mediaUrl: '/media/questions/namethatsong/bohemianrhapsody.mp3',
  mediaType: 'audio',
  points: 100,
  CategoryId: category.id
});
```

**Slides Question (Multiple Images):**
```javascript
await Question.create({
  question: '',
  answer: 'Captain Jack Sparrow',
  mediaType: 'slides',
  mediaUrls: [
    '/media/questions/twitter/sparrow/image1.png',
    '/media/questions/twitter/sparrow/image2.png',
    '/media/questions/twitter/sparrow/image3.png',
    '/media/questions/twitter/sparrow/image4.png',
    '/media/questions/twitter/sparrow/image5.png'
  ],
  answerMediaType: 'image',
  answerMediaUrl: '/media/questions/twitter/sparrow/solution.png',
  points: 100,
  CategoryId: category.id
});
```

**Video with Answer Video:**
```javascript
await Question.create({
  question: '',
  answer: 'Celebrate',
  mediaType: 'video',
  mediaUrl: '/media/questions/textplease/cupoflife.mp4',
  answerMediaType: 'video',
  answerMediaUrl: '/media/questions/textplease/cupoflife_solution.mp4',
  points: 100,
  CategoryId: category.id
});
```

### Complete Example: Creating a Multi-Round Game

```javascript
const { sequelize, Player, Game, Round, Category, Question } = require('./db/index');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: This drops all tables!

    // Create the game
    const game = await Game.create({ name: 'My Jeopardy Game' });

    // === ROUND 1 ===
    const round1 = await Round.create({ name: "Round 1", GameId: game.id });
    
    await Player.bulkCreate([
      { name: 'Alice', RoundId: round1.id },
      { name: 'Bob', RoundId: round1.id },
      { name: 'Charlie', RoundId: round1.id },
      { name: 'Diana', RoundId: round1.id },
    ]);

    // Category 1
    const cat1 = await Category.create({ name: 'Movies', RoundId: round1.id });
    await Question.bulkCreate([
      { question: 'What movie?', answer: 'Avatar', mediaType: 'text', points: 100, CategoryId: cat1.id },
      { question: 'What movie?', answer: 'Godzilla', mediaType: 'text', points: 200, CategoryId: cat1.id },
      // ... more questions
    ]);

    // Category 2
    const cat2 = await Category.create({ name: 'Music', RoundId: round1.id });
    await Question.bulkCreate([
      { question: '', answer: 'Song Name', mediaUrl: '/media/song.mp3', mediaType: 'audio', points: 100, CategoryId: cat2.id },
      // ... more questions
    ]);

    // === ROUND 2 ===
    const round2 = await Round.create({ name: "Round 2", GameId: game.id });
    
    await Player.bulkCreate([
      { name: 'Alice', RoundId: round2.id },
      { name: 'Bob', RoundId: round2.id },
      { name: 'Charlie', RoundId: round2.id },
      { name: 'Diana', RoundId: round2.id },
    ]);

    // Add categories and questions for Round 2...
    // (similar structure as Round 1)

    // === ROUND 3 ===
    // Add more rounds as needed...

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seed();
```

### Question Point Values

Questions typically use point values like: 100, 200, 300, 400, 500. You can use any integer values that make sense for your game.

### After Creating Your Game

1. Save your changes to `init_db_2025.js`
2. Run the initialization script:
   ```bash
   cd server
   node init_db_2025.js
   ```
3. Start the server and client as described in the "Starting the Application" section

## Database Schema

### Models

- **Game**: Contains game name and active state (activeRoundId, activeQuestionId, activePlayerId)
- **Round**: Belongs to a Game, contains multiple Categories and Players
- **Category**: Belongs to a Round, contains multiple Questions
- **Question**: Belongs to a Category, contains question/answer data and media
- **Player**: Belongs to a Round, tracks score and buzzer assignment

### Database File

The SQLite database file is stored at: `server/database.sqlite`

## Hardware Buzzer Integration

The server supports hardware buzzers connected via TCP on port 8080. The buzzer system:

- Listens on port 8080 for buzzer connections
- Supports up to 4 buzzers
- Automatically assigns buzzers to players in the active round
- Sends LED color commands to buzzers
- Handles buzzer press events ("BUZZ" message)

### Buzzer Protocol

Buzzers connect via TCP and send "BUZZ" messages when pressed. The server responds with LED color commands in the format: `LED R G B` (e.g., `LED 255 000 000` for red).

## Socket.IO Events

The application uses Socket.IO for real-time communication. Key events:

### Client → Server
- `setActiveRound(roundId)` - Set the active round
- `setActiveQuestion(questionId)` - Set the active question
- `setActivePlayer(playerId)` - Set the active player (who buzzed in)
- `correctAnswer()` - Mark answer as correct
- `wrongAnswer()` - Mark answer as incorrect
- `showSolution()` - Show the solution
- `setBuzzerTest(state)` - Enable/disable buzzer test mode
- `setSplashScreen(state)` - Show/hide splash screen
- `updatePlayer(player)` - Update player information
- `playMedia()` - Play media
- `pauseMedia()` - Pause media
- `stopMedia()` - Stop media

### Server → Client
- `gameState` - Broadcasts the current game state
- `setIndex(idx)` - Set media index for slides
- `playMedia` - Play media command
- `pauseMedia` - Pause media command
- `stopMedia` - Stop media command

## Environment Variables

- `PORT`: Server port (default: 3001)

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Delete `server/database.sqlite` if it exists
2. Run `node init_db_2025.js` again to recreate the database

### Media Files Not Loading

- Ensure media files are in `server/public/media/`
- Check that file paths in questions match the actual file locations
- Verify file permissions

### Port Already in Use

If port 3000 or 3001 is already in use:
- Change the port in `client/package.json` (proxy setting) and `server/server.js` (PORT)
- Or stop the process using the port

### Buzzer Not Connecting

- Verify the buzzer is connecting to the correct IP and port (8080)
- Check server logs for connection messages
- Ensure the buzzer is sending "BUZZ" messages

## Development Notes

- The client proxy is configured to forward API requests to `http://localhost:3001`
- Media files are served from `server/public/media/`
- The React app is served from `server/public/` when built
- Database uses SQLite for simplicity (can be changed in `server/config/config.js`)

## License

[Add your license information here]

