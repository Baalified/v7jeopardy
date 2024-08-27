const { sequelize, Player, Game, Round, Category, Question } = require('./db/index');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them

    // Create a game
    const game = await Game.create({ name: 'Jeopardy Game' });

    // Create rounds for the game
    var round = await Round.create({ roundNumber: 1, GameId: game.id });

    // Create players for each round
    await Player.bulkCreate([
      { name: 'Player 1', RoundId: round.id },
      { name: 'Player 2', RoundId: round.id },
      { name: 'Player 3', RoundId: round.id },
      { name: 'Player 4', RoundId: round.id },
    ]);

    // Category 1: Music Videos
    var category = await Category.create({ name: 'Music Videos', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'Which artist had a hit with "Thriller"?', answer: 'Michael Jackson', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'What year was MTV launched?', answer: '1981', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'Who directed the music video for "Bad Romance"?', answer: 'Francis Lawrence', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'Which song is known for its backward messages in the video?', answer: 'Stairway to Heaven', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'Which artist won the first MTV Video Music Award for Best Video?', answer: 'The Cars', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    // Category 2: AI and Technology
    var category = await Category.create({ name: 'AI and Technology', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'What does AI stand for?', answer: 'Artificial Intelligence', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'Who is considered the father of modern computing?', answer: 'Alan Turing', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'What is the name of the AI that defeated Go champion Lee Sedol?', answer: 'AlphaGo', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'What programming language is primarily used for AI development?', answer: 'Python', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'Which company developed the AI language model GPT?', answer: 'OpenAI', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    // Category 3: Classic Movies
    var category = await Category.create({ name: 'Classic Movies', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'Who played the lead role in the movie "Casablanca"?', answer: 'Humphrey Bogart', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'Which movie features the line "Here\'s looking at you, kid"?', answer: 'Casablanca', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'What was the first feature-length animated movie?', answer: 'Snow White and the Seven Dwarfs', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'Who directed "Psycho"?', answer: 'Alfred Hitchcock', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'Which 1950 film is about an aging silent film star?', answer: 'Sunset Boulevard', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    // Category 4: World Geography
    var category = await Category.create({ name: 'World Geography', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'What is the capital of France?', answer: 'Paris', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'Which river is the longest in the world?', answer: 'Nile', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'Which country has the most natural lakes?', answer: 'Canada', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'What is the smallest country in the world?', answer: 'Vatican City', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'Which continent is the Sahara Desert located on?', answer: 'Africa', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    // Category 5: Literature
    var category = await Category.create({ name: 'Literature', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'In which novel would you find the character "Holden Caulfield"?', answer: 'The Catcher in the Rye', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'What is the title of the first Harry Potter book?', answer: 'Harry Potter and the Philosopher\'s Stone', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'Who wrote "Pride and Prejudice"?', answer: 'Jane Austen', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'Which author created the fictional detective Sherlock Holmes?', answer: 'Arthur Conan Doyle', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    // Category 6: Science
    var category = await Category.create({ name: 'Science', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'What planet is known as the Red Planet?', answer: 'Mars', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'What is the chemical symbol for gold?', answer: 'Au', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'Who developed the theory of relativity?', answer: 'Albert Einstein', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'What gas do plants absorb from the atmosphere?', answer: 'Carbon dioxide', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seed();
