const { sequelize, Player, Game, Round, Category, Question } = require('./db/index');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them

    // Create a game
    const game = await Game.create({ name: 'Jeopardy Game' });

    // Create rounds for the game
    var round = await Round.create({ name: "Round 1", GameId: game.id });

    // Create players for each round
    await Player.bulkCreate([
      { name: 'Player 1', RoundId: round.id },
      { name: 'Player 2', RoundId: round.id },
      { name: 'Player 3', RoundId: round.id },
      { name: 'Player 4', RoundId: round.id },
    ]);

    // Category 1: Music Videos
    var category = await Category.create({ name: 'Audio Test', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'ABBA', mediaType: 'audio', mediaUrl: '/media/questions/test/ABBA - People Need Love.m4a', points: 100, CategoryId: category.id },
      { question: '', answer: 'Aerosmith', mediaType: 'audio', mediaUrl: '/media/questions/test/Aerosmith - Dream On.m4a', points: 200, CategoryId: category.id },
      { question: '', answer: 'Amy Winehouse', mediaType: 'audio', mediaUrl: '/media/questions/test/Amy Winehouse - Stronger Than Me.m4a', points: 300, CategoryId: category.id },
      { question: '', answer: 'Backstreet Boys', mediaType: 'audio', mediaUrl: '/media/questions/test/Backstreet Boys - Tell Me That Im Dreamin.m4a', points: 400, CategoryId: category.id },
      { question: '', answer: 'Bloodhound Gang', mediaType: 'audio', mediaUrl: '/media/questions/test/Bloodhound Gang - Legend In My Spare Time.m4a', points: 500, CategoryId: category.id },
    ]);

    // Category 2: AI and Technology
    var category = await Category.create({ name: 'Video Test', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'angels', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/angels_solution.mp4', mediaType: 'video', mediaUrl: '/media/questions/testv/angels.mp4', points: 100, CategoryId: category.id },
      { question: '', answer: 'bohemian', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/bohemian_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/bohemian.mp4', points: 200, CategoryId: category.id },
      { question: '', answer: 'cake', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/cake_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/cake.mp4', points: 300, CategoryId: category.id },
      { question: '', answer: 'end', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/end_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/end.mp4', points: 400, CategoryId: category.id },
      { question: '', answer: 'feelgood', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/feelgood_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/feelgood.mp4', points: 500, CategoryId: category.id },
    ]);

    // Category 3: Classic Movies
    var category = await Category.create({ name: 'Images Test', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: '300', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/300_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/300.png', points: 100, CategoryId: category.id },
      { question: '', answer: 'bttf', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/bttf_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/bttf.png', points: 200, CategoryId: category.id },
      { question: '', answer: 'ironman', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/ironman_solution.webp', mediaType: 'image', mediaUrl: '/media/questions/testi/ironman.png', points: 300, CategoryId: category.id },
      { question: '', answer: 'jurassicpark', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/jurassicpark_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/jurassicpark.png', points: 400, CategoryId: category.id },
      { question: '', answer: 'killbill', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/killbill_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/killbill.png', points: 500, CategoryId: category.id },
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

    // Create rounds for the game
    var round = await Round.create({ name: "Round 2", GameId: game.id });

    // Create players for each round
    await Player.bulkCreate([
      { name: 'Player 2-1', RoundId: round.id },
      { name: 'Player 2-2', RoundId: round.id },
      { name: 'Player 2-3', RoundId: round.id },
      { name: 'Player 2-4', RoundId: round.id },
    ]);

    // Category 1: Music Videos
    var category = await Category.create({ name: 'Audio Test', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'ABBA', mediaType: 'audio', mediaUrl: '/media/questions/test/ABBA - People Need Love.m4a', points: 100, CategoryId: category.id },
      { question: '', answer: 'Aerosmith', mediaType: 'audio', mediaUrl: '/media/questions/test/Aerosmith - Dream On.m4a', points: 200, CategoryId: category.id },
      { question: '', answer: 'Amy Winehouse', mediaType: 'audio', mediaUrl: '/media/questions/test/Amy Winehouse - Stronger Than Me.m4a', points: 300, CategoryId: category.id },
      { question: '', answer: 'Backstreet Boys', mediaType: 'audio', mediaUrl: '/media/questions/test/Backstreet Boys - Tell Me That Im Dreamin.m4a', points: 400, CategoryId: category.id },
      { question: '', answer: 'Bloodhound Gang', mediaType: 'audio', mediaUrl: '/media/questions/test/Bloodhound Gang - Legend In My Spare Time.m4a', points: 500, CategoryId: category.id },
    ]);

    // Category 2: AI and Technology
    var category = await Category.create({ name: 'Video Test', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'angels', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/angels_solution.mp4', mediaType: 'video', mediaUrl: '/media/questions/testv/angels.mp4', points: 100, CategoryId: category.id },
      { question: '', answer: 'bohemian', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/bohemian_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/bohemian.mp4', points: 200, CategoryId: category.id },
      { question: '', answer: 'cake', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/cake_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/cake.mp4', points: 300, CategoryId: category.id },
      { question: '', answer: 'end', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/end_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/end.mp4', points: 400, CategoryId: category.id },
      { question: '', answer: 'feelgood', answerMediaType: 'video', answerMediaUrl: '/media/questions/testv/feelgood_solution.mp4',mediaType: 'video', mediaUrl: '/media/questions/testv/feelgood.mp4', points: 500, CategoryId: category.id },
    ]);

    // Category 3: Classic Movies
    var category = await Category.create({ name: 'Images Test', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: '300', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/300_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/300.png', points: 100, CategoryId: category.id },
      { question: '', answer: 'bttf', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/bttf_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/bttf.png', points: 200, CategoryId: category.id },
      { question: '', answer: 'ironman', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/ironman_solution.webp', mediaType: 'image', mediaUrl: '/media/questions/testi/ironman.png', points: 300, CategoryId: category.id },
      { question: '', answer: 'jurassicpark', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/jurassicpark_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/jurassicpark.png', points: 400, CategoryId: category.id },
      { question: '', answer: 'killbill', answerMediaType: 'image', answerMediaUrl: '/media/questions/testi/killbill_solution.jpg', mediaType: 'image', mediaUrl: '/media/questions/testi/killbill.png', points: 500, CategoryId: category.id },
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
