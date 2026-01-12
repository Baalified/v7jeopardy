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

    // Category 5: Literature
    var category = await Category.create({ name: 'Songless', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'Aerosmith - Dream On', mediaUrl: '/dreamon.mp3', mediaType: 'songless', points: 100, CategoryId: category.id,
        answerMediaType: 'audio',
        answerMediaUrl: '/dreamon_solution.mp3',
       },
      { question: '', answer: 'Oasis - Dont look back in anger', mediaUrl: '/anger.mp3', mediaType: 'songless', points: 200, CategoryId: category.id,
        answerMediaType: 'audio',
        answerMediaUrl: '/anger_solution.mp3', },
      { question: '', answer: 'Elton John - Rocket Man', mediaUrl: '/rocketman.mp3', mediaType: 'songless', points: 300, CategoryId: category.id,
        answerMediaType: 'audio',
        answerMediaUrl: '/rocketman_solution.mp3', },
      { question: '', answer: 'Amy Winehouse - Valerie', mediaUrl: '/valerie.mp3', mediaType: 'songless', points: 400, CategoryId: category.id,
        answerMediaType: 'audio',
        answerMediaUrl: '/valerie_solution.mp3', },
      { question: '', answer: 'Lou Reed - Perfect Day', mediaUrl: '/perfectday.mp3', mediaType: 'songless', points: 500, CategoryId: category.id,
        answerMediaType: 'audio',
        answerMediaUrl: '/perfectday_solution.mp3', },
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

    var category = await Category.create({ name: 'X', RoundId: round.id });
    await Question.bulkCreate([
      { question: '',
        answer: 'Homer Simpson',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/simpsonhomer/image1.png',
          '/media/questions/twitter/simpsonhomer/image2.png',
          '/media/questions/twitter/simpsonhomer/image3.png',
          '/media/questions/twitter/simpsonhomer/image4.png',
          '/media/questions/twitter/simpsonhomer/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/simpsonhomer/solution.png',
        points: 100,
        CategoryId: category.id },
        { question: '',
        answer: 'Steve Jobs',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/jobs/image1.png',
          '/media/questions/twitter/jobs/image2.png',
          '/media/questions/twitter/jobs/image3.png',
          '/media/questions/twitter/jobs/image4.png',
          '/media/questions/twitter/jobs/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/jobs/solution.png',
        points: 200,
        CategoryId: category.id },
        { question: '',
        answer: 'Bob Ross',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/ross/image1.png',
          '/media/questions/twitter/ross/image2.png',
          '/media/questions/twitter/ross/image3.png',
          '/media/questions/twitter/ross/image4.png',
          '/media/questions/twitter/ross/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/ross/solution.png',
        points: 300,
        CategoryId: category.id },
        { question: '',
        answer: 'Michael Jackson',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/jackson/image1.png',
          '/media/questions/twitter/jackson/image2.png',
          '/media/questions/twitter/jackson/image3.png',
          '/media/questions/twitter/jackson/image4.png',
          '/media/questions/twitter/jackson/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/jackson/solution.png',
        points: 400,
        CategoryId: category.id },
        { question: '',
        answer: 'Gandalf',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/gandalf/image1.png',
          '/media/questions/twitter/gandalf/image2.png',
          '/media/questions/twitter/gandalf/image3.png',
          '/media/questions/twitter/gandalf/image4.png',
          '/media/questions/twitter/gandalf/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/gandalf/solution.png',
        points: 500,
        CategoryId: category.id }
    ]);

    // Category 3: Classic Movies
    var category = await Category.create({ name: 'Movie Frames', RoundId: round.id });
    await Question.bulkCreate([
      { question: '',
        answer: '300',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/movieframes/300/image1.jpg',
          '/media/questions/movieframes/300/image2.jpg',
          '/media/questions/movieframes/300/image3.jpg',
          '/media/questions/movieframes/300/image4.jpg',
          '/media/questions/movieframes/300/image5.jpg'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/movieframes/300/solution.jpg',
        points: 100,
        CategoryId: category.id },
        { question: '',
        answer: 'Dune',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/movieframes/dune/image1.jpg',
          '/media/questions/movieframes/dune/image2.jpg',
          '/media/questions/movieframes/dune/image3.jpg',
          '/media/questions/movieframes/dune/image4.jpg',
          '/media/questions/movieframes/dune/image5.jpg'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/movieframes/dune/solution.webp',
        points: 200,
        CategoryId: category.id },
        { question: '',
        answer: 'Sin City',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/movieframes/sincity/image1.jpg',
          '/media/questions/movieframes/sincity/image2.jpg',
          '/media/questions/movieframes/sincity/image3.jpg',
          '/media/questions/movieframes/sincity/image4.jpg',
          '/media/questions/movieframes/sincity/image5.jpg'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/movieframes/sincity/solution.jpg',
        points: 300,
        CategoryId: category.id },
        { question: '',
        answer: 'The Wolf of Wallstreet',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/movieframes/wolf/image1.jpg',
          '/media/questions/movieframes/wolf/image2.jpg',
          '/media/questions/movieframes/wolf/image3.jpg',
          '/media/questions/movieframes/wolf/image4.jpg',
          '/media/questions/movieframes/wolf/image5.jpg'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/movieframes/wolf/solution.webp',
        points: 400,
        CategoryId: category.id },
        { question: '',
        answer: 'Get Out',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/movieframes/getout/image1.jpg',
          '/media/questions/movieframes/getout/image2.jpg',
          '/media/questions/movieframes/getout/image3.jpg',
          '/media/questions/movieframes/getout/image4.jpg',
          '/media/questions/movieframes/getout/image5.jpg'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/movieframes/getout/solution.webp',
        points: 500,
        CategoryId: category.id },
    ]);

    var category = await Category.create({ name: 'Gummi Bears', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'Italian', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Italian.mp4',
        points: 100, CategoryId: category.id
      },
      { question: '', answer: 'French', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/French.mp4',
        points: 200, CategoryId: category.id
      },
      { question: '', answer: 'Japanese', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Japanese.mp4',
        points: 300, CategoryId: category.id
      },
      { question: '', answer: 'Polish', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Polish.mp4',
        points: 400, CategoryId: category.id
      },
      { question: '', answer: 'Ukrainian', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Ukrainian.mp4',
        points: 500, CategoryId: category.id
      },
    ]);

    var category = await Category.create({ name: 'Name that Song', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'Thrift Shop', mediaUrl: '/media/questions/namethatsong/thriftshop.mp3', mediaType: 'audio', points: 100, CategoryId: category.id },
      { question: '', answer: 'Toms Diner', mediaUrl: '/media/questions/namethatsong/tomsdiner.mp3', mediaType: 'audio', points: 200, CategoryId: category.id },
      { question: '', answer: 'Pompeii', mediaUrl: '/media/questions/namethatsong/pompeii.mp3', mediaType: 'audio', points: 300, CategoryId: category.id },
      { question: '', answer: 'Lovefool', mediaUrl: '/media/questions/namethatsong/lovefool.mp3', mediaType: 'audio', points: 400, CategoryId: category.id },
      { question: '', answer: 'Sing, Sing, Sing', mediaUrl: '/media/questions/namethatsong/singsingsing.mp3', mediaType: 'audio', points: 500, CategoryId: category.id },
    ]);

    var category = await Category.create({ name: 'Chat Acronyms', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'lmao', answer: 'Laughing my ass off', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'pov', answer: 'Point of View', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'afaik', answer: 'As far as I know', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'irl', answer: 'In real life', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'ttyl', answer: 'Talk to you later', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    var category = await Category.create({ name: 'One Hit Wonders', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'All 4 One', mediaUrl: '/media/questions/onehitwonders/All4One-ISwear.mp3', mediaType: 'audio', points: 100, CategoryId: category.id },
      { question: '', answer: 'Deep Blue Something', mediaUrl: '/media/questions/onehitwonders/DeepBlueSomething-BreakfastAtTiffanys.mp3', mediaType: 'audio', points: 200, CategoryId: category.id },
      { question: '', answer: 'Los Del Rio', mediaUrl: '/media/questions/onehitwonders/LosDelRio-Macarena.mp3', mediaType: 'audio', points: 300, CategoryId: category.id },
      { question: '', answer: 'The Las', mediaUrl: '/media/questions/onehitwonders/TheLas-ThereSheGoes.mp3', mediaType: 'audio', points: 400, CategoryId: category.id },
      { question: '', answer: 'Alannah Myles', mediaUrl: '/media/questions/onehitwonders/AlannahMyles-BlackVelvet.mp3', mediaType: 'audio', points: 500, CategoryId: category.id },
    ]);




    // Create rounds for the game
    var round = await Round.create({ name: "Round 3", GameId: game.id });

    // Create players for each round
    await Player.bulkCreate([
      { name: 'Player 3-1', RoundId: round.id },
      { name: 'Player 3-2', RoundId: round.id },
      { name: 'Player 3-3', RoundId: round.id },
      { name: 'Player 3-4', RoundId: round.id },
    ]);

    var category = await Category.create({ name: 'X', RoundId: round.id });
    await Question.bulkCreate([
      { question: '',
        answer: 'William Shakespeare',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/shakespeare/image1.png',
          '/media/questions/twitter/shakespeare/image2.png',
          '/media/questions/twitter/shakespeare/image3.png',
          '/media/questions/twitter/shakespeare/image4.png',
          '/media/questions/twitter/shakespeare/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/shakespeare/solution.png',
        points: 100,
        CategoryId: category.id },
        { question: '',
        answer: 'Taylor Swift',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/swift/image1.png',
          '/media/questions/twitter/swift/image2.png',
          '/media/questions/twitter/swift/image3.png',
          '/media/questions/twitter/swift/image4.png',
          '/media/questions/twitter/swift/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/swift/solution.png',
        points: 200,
        CategoryId: category.id },
        { question: '',
        answer: 'Kanye West',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/west/image1.png',
          '/media/questions/twitter/west/image2.png',
          '/media/questions/twitter/west/image3.png',
          '/media/questions/twitter/west/image4.png',
          '/media/questions/twitter/west/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/west/solution.png',
        points: 300,
        CategoryId: category.id },
        { question: '',
        answer: 'Marilyn Monroe',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/monroe/image1.png',
          '/media/questions/twitter/monroe/image2.png',
          '/media/questions/twitter/monroe/image3.png',
          '/media/questions/twitter/monroe/image4.png',
          '/media/questions/twitter/monroe/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/monroe/solution.png',
        points: 400,
        CategoryId: category.id },
        { question: '',
        answer: 'Wednesday Addams',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/twitter/addams/image1.png',
          '/media/questions/twitter/addams/image2.png',
          '/media/questions/twitter/addams/image3.png',
          '/media/questions/twitter/addams/image4.png',
          '/media/questions/twitter/addams/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/twitter/addams/solution.png',
        points: 500,
        CategoryId: category.id }
    ]);

    var category = await Category.create({ name: 'AI Portraits', RoundId: round.id });
    await Question.bulkCreate([
      { question: '',
        answer: 'Christoph Münch',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/aiportraits/christophmuench/image6.png',
          '/media/questions/aiportraits/christophmuench/image1.png',
          '/media/questions/aiportraits/christophmuench/image7.png',
          '/media/questions/aiportraits/christophmuench/image5.png',
          '/media/questions/aiportraits/christophmuench/image4.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/aiportraits/christophmuench/solution.jpg',
        points: 100,
        CategoryId: category.id },
        { question: '',
        answer: 'Emin Dokur',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/aiportraits/emindokur/image1.png',
          '/media/questions/aiportraits/emindokur/image6.png',
          '/media/questions/aiportraits/emindokur/image4.png',
          '/media/questions/aiportraits/emindokur/image3.png',
          '/media/questions/aiportraits/emindokur/image2.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/aiportraits/emindokur/solution.jpg',
        points: 200,
        CategoryId: category.id },
        { question: '',
        answer: 'Julia Jäger',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/aiportraits/juliajaeger/image3.png',
          '/media/questions/aiportraits/juliajaeger/image2.png',
          '/media/questions/aiportraits/juliajaeger/image1.png',
          '/media/questions/aiportraits/juliajaeger/image7.png',
          '/media/questions/aiportraits/juliajaeger/image8.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/aiportraits/juliajaeger/solution.jpg',
        points: 300,
        CategoryId: category.id },
        { question: '',
        answer: 'Felix Herold',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/aiportraits/felixherold/image5.png',
          '/media/questions/aiportraits/felixherold/image7.png',
          '/media/questions/aiportraits/felixherold/image4.png',
          '/media/questions/aiportraits/felixherold/image2.png',
          '/media/questions/aiportraits/felixherold/image1.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/aiportraits/felixherold/solution.jpg',
        points: 400,
        CategoryId: category.id },
        { question: '',
        answer: 'Marek Hubatka',
        mediaType: 'slides',
        mediaUrls: [
          '/media/questions/aiportraits/marek/image1.png',
          '/media/questions/aiportraits/marek/image2.png',
          '/media/questions/aiportraits/marek/image3.png',
          '/media/questions/aiportraits/marek/image4.png',
          '/media/questions/aiportraits/marek/image5.png'
        ],
        answerMediaType: 'image',
        answerMediaUrl: '/media/questions/aiportraits/marek/solution.png',
        points: 500,
        CategoryId: category.id },
    ]);

    var category = await Category.create({ name: 'Gummi Bears', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'Chinese', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Chinese.mp4',
        points: 100, CategoryId: category.id
      },
      { question: '', answer: 'Greek', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Greek.mp4',
        points: 200, CategoryId: category.id
      },
      { question: '', answer: 'Portugese', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Portugese.mp4',
        points: 300, CategoryId: category.id
      },
      { question: '', answer: 'Finnish', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Finnish.mp4',
        points: 400, CategoryId: category.id
      },
      { question: '', answer: 'Czech', mediaType: 'video',
        mediaUrl: '/media/questions/gummibears/Czech.mp4',
        points: 500, CategoryId: category.id
      },
    ]);

    var category = await Category.create({ name: 'Name that Song', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'Chop Suey', mediaUrl: '/media/questions/namethatsong/chopsuey.mp3', mediaType: 'audio', points: 100, CategoryId: category.id },
      { question: '', answer: 'Grace Kelly', mediaUrl: '/media/questions/namethatsong/gracekelly.mp3', mediaType: 'audio', points: 200, CategoryId: category.id },
      { question: '', answer: 'Narcotic', mediaUrl: '/media/questions/namethatsong/narcotic.mp3', mediaType: 'audio', points: 300, CategoryId: category.id },
      { question: '', answer: 'You can call me Al', mediaUrl: '/media/questions/namethatsong/youcancallmeal.mp3', mediaType: 'audio', points: 400, CategoryId: category.id },
      { question: '', answer: 'Eleanor Rigby', mediaUrl: '/media/questions/namethatsong/eleanorrigby.mp3', mediaType: 'audio', points: 500, CategoryId: category.id },
    ]);

    var category = await Category.create({ name: 'Chat Acronyms', RoundId: round.id });
    await Question.bulkCreate([
      { question: 'tl;dr', answer: 'Too long, didn\'t read', mediaType: 'text', points: 100, CategoryId: category.id },
      { question: 'idk', answer: 'I don\'t know', mediaType: 'text', points: 200, CategoryId: category.id },
      { question: 'nsfw', answer: 'Not safe for work', mediaType: 'text', points: 300, CategoryId: category.id },
      { question: 'ftw', answer: 'For the win', mediaType: 'text', points: 400, CategoryId: category.id },
      { question: 'iirc', answer: 'If I remember correctly', mediaType: 'text', points: 500, CategoryId: category.id },
    ]);

    var category = await Category.create({ name: 'Text, Please', RoundId: round.id });
    await Question.bulkCreate([
      { question: '', answer: 'Celebrate', mediaType: 'video',
        mediaUrl: '/media/questions/textplease/cupoflife.mp4', answerMediaType: 'video',
        answerMediaUrl: '/media/questions/textplease/cupoflife_solution.mp4',
        points: 100, CategoryId: category.id
      },
      { question: '', answer: 'In Love', mediaType: 'video',
        mediaUrl: '/media/questions/textplease/ikissedagirl.mp4', answerMediaType: 'video',
        answerMediaUrl: '/media/questions/textplease/ikissedagirl_solution.mp4',
        points: 200, CategoryId: category.id
      },
      { question: '', answer: 'Green', mediaType: 'video',
        mediaUrl: '/media/questions/textplease/karma.mp4', answerMediaType: 'video',
        answerMediaUrl: '/media/questions/textplease/karma_solution.mp4',
        points: 300, CategoryId: category.id
      },
      { question: '', answer: 'Dragostea din tei', mediaType: 'video',
        mediaUrl: '/media/questions/textplease/dragostea.mp4', answerMediaType: 'video',
        answerMediaUrl: '/media/questions/textplease/dragostea_solution.mp4',
        points: 400, CategoryId: category.id
      },
      { question: '', answer: 'East LA', mediaType: 'video',
        mediaUrl: '/media/questions/textplease/mariamaria.mp4', answerMediaType: 'video',
        answerMediaUrl: '/media/questions/textplease/mariamaria_solution.mp4',
        points: 500, CategoryId: category.id
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seed();
