// server/seed.js
const { sequelize, Player, Game, Round, Category, Question } = require('./db/index');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them

    // Create a game
    const game = await Game.create({ name: 'Jeopardy Game' });

    // Create rounds for the game
    const round1 = await Round.create({ roundNumber: 1, GameId: game.id });
    const round2 = await Round.create({ roundNumber: 2, GameId: game.id });

    // Create categories for each round
    var categories = [];
    categories.push(await Category.create({ name: 'Science', RoundId: round1.id }));
    categories.push(await Category.create({ name: 'History', RoundId: round1.id }));
    categories.push(await Category.create({ name: 'This category has a long title', RoundId: round1.id }));
    categories.push(await Category.create({ name: 'Math', RoundId: round1.id }));
    categories.push(await Category.create({ name: 'Science', RoundId: round1.id }));
    categories.push(await Category.create({ name: 'Math', RoundId: round1.id }));

    // Create questions for each category
    for(var i=0; i<categories.length; i++) {
      await Question.bulkCreate([
        { question: 'What is the chemical symbol for water?', answer: 'H2O', points: 100, CategoryId: categories[i].id },
        { question: 'What planet is known as the Red Planet?', answer: 'Mars', points: 200, CategoryId: categories[i].id },
        { question: 'Who was the first president of the United States?', answer: 'George Washington', points: 300, CategoryId: categories[i].id },
        { question: 'In what year did World War II end?', answer: '1945', points: 400, CategoryId: categories[i].id },
        { question: 'Who wrote "Pride and Prejudice"?', answer: 'Jane Austen', points: 500, CategoryId: categories[i].id },
      ]);
    }

    // Create players for each round
    await Player.bulkCreate([
      { name: 'Player 1', RoundId: round1.id },
      { name: 'Player 2', RoundId: round1.id },
      { name: 'Player 3', RoundId: round2.id },
      { name: 'Player 4', RoundId: round2.id },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seed();
