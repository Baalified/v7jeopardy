const { sequelize, Player, Game, Round, Category, Question } = require('./db/index');

/**
 * Demo Database Initialization Script
 * 
 * This script showcases all question types and answer types supported by the game:
 * 
 * Question Types (mediaType):
 * - text: Text-based questions
 * - image: Single image questions
 * - audio: Audio questions
 * - video: Video questions
 * - slides: Multiple images (slideshow)
 * - songless: Songless audio (instrumental)
 * 
 * Answer Types (answerMediaType):
 * - text: Text answer (default, when answerMediaType is not specified)
 * - image: Image answer
 * - audio: Audio answer
 * - video: Video answer
 */

async function seed() {
  try {
    await sequelize.sync({ force: true }); // This will drop all tables and recreate them

    // Create a demo game
    const game = await Game.create({ name: 'Demo Game - All Question Types' });

    // Create a single round for the demo
    const round = await Round.create({ name: "Demo Round", GameId: game.id });

    // Create players for the round
    await Player.bulkCreate([
      { name: 'Player 1', RoundId: round.id },
      { name: 'Player 2', RoundId: round.id },
      { name: 'Player 3', RoundId: round.id },
      { name: 'Player 4', RoundId: round.id },
    ]);

    // ============================================================================
    // CATEGORY 1: TEXT QUESTIONS
    // ============================================================================
    // Text questions with different answer types
    var category = await Category.create({ name: '1. Text Questions', RoundId: round.id });
    
    // Text question → Text answer (default)
    await Question.create({
      question: 'What does "AI" stand for?',
      answer: 'Artificial Intelligence',
      mediaType: 'text',
      points: 100,
      CategoryId: category.id
    });

    // Text question → Image answer
    await Question.create({
      question: 'Name this famous landmark',
      answer: 'Eiffel Tower',
      mediaType: 'text',
      answerMediaType: 'image',
      answerMediaUrl: '/media/demo/eiffel_tower.jpg',
      points: 200,
      CategoryId: category.id
    });

    // Text question → Audio answer
    await Question.create({
      question: 'What song is this?',
      answer: 'Bohemian Rhapsody',
      mediaType: 'text',
      answerMediaType: 'audio',
      answerMediaUrl: '/media/demo/bohemian_rhapsody.mp3',
      points: 300,
      CategoryId: category.id
    });

    // Text question → Video answer
    await Question.create({
      question: 'What movie scene is this?',
      answer: 'The Matrix',
      mediaType: 'text',
      answerMediaType: 'video',
      answerMediaUrl: '/media/demo/matrix_scene.mp4',
      points: 400,
      CategoryId: category.id
    });

    // Text question → Text answer (explicit)
    await Question.create({
      question: 'What is the capital of France?',
      answer: 'Paris',
      mediaType: 'text',
      points: 500,
      CategoryId: category.id
    });

    // ============================================================================
    // CATEGORY 2: IMAGE QUESTIONS
    // ============================================================================
    var category = await Category.create({ name: '2. Image Questions', RoundId: round.id });
    
    // Image question → Text answer
    await Question.create({
      question: '',
      answer: 'Mona Lisa',
      mediaType: 'image',
      mediaUrl: '/media/demo/mona_lisa.jpg',
      points: 100,
      CategoryId: category.id
    });

    // Image question → Image answer
    await Question.create({
      question: '',
      answer: 'Van Gogh - Starry Night',
      mediaType: 'image',
      mediaUrl: '/media/demo/starry_night_clue.jpg',
      answerMediaType: 'image',
      answerMediaUrl: '/media/demo/starry_night_full.jpg',
      points: 200,
      CategoryId: category.id
    });

    // Image question → Audio answer
    await Question.create({
      question: '',
      answer: 'Beethoven - Moonlight Sonata',
      mediaType: 'image',
      mediaUrl: '/media/demo/composer_portrait.jpg',
      answerMediaType: 'audio',
      answerMediaUrl: '/media/demo/moonlight_sonata.mp3',
      points: 300,
      CategoryId: category.id
    });

    // Image question → Video answer
    await Question.create({
      question: '',
      answer: 'The Godfather',
      mediaType: 'image',
      mediaUrl: '/media/demo/movie_poster.jpg',
      answerMediaType: 'video',
      answerMediaUrl: '/media/demo/godfather_scene.mp4',
      points: 400,
      CategoryId: category.id
    });

    // Image question → Text answer (another example)
    await Question.create({
      question: '',
      answer: 'The Great Wall of China',
      mediaType: 'image',
      mediaUrl: '/media/demo/great_wall.jpg',
      points: 500,
      CategoryId: category.id
    });

    // ============================================================================
    // CATEGORY 3: AUDIO QUESTIONS
    // ============================================================================
    var category = await Category.create({ name: '3. Audio Questions', RoundId: round.id });
    
    // Audio question → Text answer
    await Question.create({
      question: '',
      answer: 'Bohemian Rhapsody',
      mediaType: 'audio',
      mediaUrl: '/media/demo/bohemian_rhapsody.mp3',
      points: 100,
      CategoryId: category.id
    });

    // Audio question → Image answer
    await Question.create({
      question: '',
      answer: 'The Beatles',
      mediaType: 'audio',
      mediaUrl: '/media/demo/beatles_song.mp3',
      answerMediaType: 'image',
      answerMediaUrl: '/media/demo/beatles_photo.jpg',
      points: 200,
      CategoryId: category.id
    });

    // Audio question → Audio answer
    await Question.create({
      question: '',
      answer: 'Original Recording',
      mediaType: 'audio',
      mediaUrl: '/media/demo/song_excerpt.mp3',
      answerMediaType: 'audio',
      answerMediaUrl: '/media/demo/song_full.mp3',
      points: 300,
      CategoryId: category.id
    });

    // Audio question → Video answer
    await Question.create({
      question: '',
      answer: 'Music Video',
      mediaType: 'audio',
      mediaUrl: '/media/demo/song_audio.mp3',
      answerMediaType: 'video',
      answerMediaUrl: '/media/demo/music_video.mp4',
      points: 400,
      CategoryId: category.id
    });

    // Audio question → Text answer (another example)
    await Question.create({
      question: '',
      answer: 'Thunderstruck',
      mediaType: 'audio',
      mediaUrl: '/media/demo/thunderstruck.mp3',
      points: 500,
      CategoryId: category.id
    });

    // ============================================================================
    // CATEGORY 4: VIDEO QUESTIONS
    // ============================================================================
    var category = await Category.create({ name: '4. Video Questions', RoundId: round.id });
    
    // Video question → Text answer
    await Question.create({
      question: '',
      answer: 'Spanish',
      mediaType: 'video',
      mediaUrl: '/media/demo/language_sample.mp4',
      points: 100,
      CategoryId: category.id
    });

    // Video question → Image answer
    await Question.create({
      question: '',
      answer: 'Movie Poster',
      mediaType: 'video',
      mediaUrl: '/media/demo/movie_clip.mp4',
      answerMediaType: 'image',
      answerMediaUrl: '/media/demo/movie_poster.jpg',
      points: 200,
      CategoryId: category.id
    });

    // Video question → Audio answer
    await Question.create({
      question: '',
      answer: 'Soundtrack',
      mediaType: 'video',
      mediaUrl: '/media/demo/movie_scene.mp4',
      answerMediaType: 'audio',
      answerMediaUrl: '/media/demo/soundtrack.mp3',
      points: 300,
      CategoryId: category.id
    });

    // Video question → Video answer
    await Question.create({
      question: '',
      answer: 'Full Scene',
      mediaType: 'video',
      mediaUrl: '/media/demo/scene_excerpt.mp4',
      answerMediaType: 'video',
      answerMediaUrl: '/media/demo/scene_full.mp4',
      points: 400,
      CategoryId: category.id
    });

    // Video question → Text answer (another example)
    await Question.create({
      question: '',
      answer: 'French',
      mediaType: 'video',
      mediaUrl: '/media/demo/french_sample.mp4',
      points: 500,
      CategoryId: category.id
    });

    // ============================================================================
    // CATEGORY 5: SLIDES QUESTIONS (Multiple Images)
    // ============================================================================
    var category = await Category.create({ name: '5. Slides Questions', RoundId: round.id });
    
    // Slides question → Text answer
    await Question.create({
      question: '',
      answer: 'Homer Simpson',
      mediaType: 'slides',
      mediaUrls: [
        '/media/demo/slides/homer/image1.png',
        '/media/demo/slides/homer/image2.png',
        '/media/demo/slides/homer/image3.png',
        '/media/demo/slides/homer/image4.png',
        '/media/demo/slides/homer/image5.png'
      ],
      points: 100,
      CategoryId: category.id
    });

    // Slides question → Image answer
    await Question.create({
      question: '',
      answer: 'Steve Jobs',
      mediaType: 'slides',
      mediaUrls: [
        '/media/demo/slides/jobs/image1.png',
        '/media/demo/slides/jobs/image2.png',
        '/media/demo/slides/jobs/image3.png',
        '/media/demo/slides/jobs/image4.png',
        '/media/demo/slides/jobs/image5.png'
      ],
      answerMediaType: 'image',
      answerMediaUrl: '/media/demo/slides/jobs/solution.png',
      points: 200,
      CategoryId: category.id
    });

    // Slides question → Audio answer
    await Question.create({
      question: '',
      answer: 'Musician',
      mediaType: 'slides',
      mediaUrls: [
        '/media/demo/slides/musician/image1.png',
        '/media/demo/slides/musician/image2.png',
        '/media/demo/slides/musician/image3.png',
        '/media/demo/slides/musician/image4.png',
        '/media/demo/slides/musician/image5.png'
      ],
      answerMediaType: 'audio',
      answerMediaUrl: '/media/demo/musician_song.mp3',
      points: 300,
      CategoryId: category.id
    });

    // Slides question → Video answer
    await Question.create({
      question: '',
      answer: 'Movie Character',
      mediaType: 'slides',
      mediaUrls: [
        '/media/demo/slides/character/image1.png',
        '/media/demo/slides/character/image2.png',
        '/media/demo/slides/character/image3.png',
        '/media/demo/slides/character/image4.png',
        '/media/demo/slides/character/image5.png'
      ],
      answerMediaType: 'video',
      answerMediaUrl: '/media/demo/character_scene.mp4',
      points: 400,
      CategoryId: category.id
    });

    // Slides question → Text answer (another example)
    await Question.create({
      question: '',
      answer: 'Gandalf',
      mediaType: 'slides',
      mediaUrls: [
        '/media/demo/slides/gandalf/image1.png',
        '/media/demo/slides/gandalf/image2.png',
        '/media/demo/slides/gandalf/image3.png',
        '/media/demo/slides/gandalf/image4.png',
        '/media/demo/slides/gandalf/image5.png'
      ],
      points: 500,
      CategoryId: category.id
    });

    // ============================================================================
    // CATEGORY 6: SONGLESS QUESTIONS (Instrumental Audio)
    // ============================================================================
    var category = await Category.create({ name: '6. Songless Questions', RoundId: round.id });
    
    // Songless question → Text answer
    await Question.create({
      question: '',
      answer: 'Aerosmith - Dream On',
      mediaType: 'songless',
      mediaUrl: '/media/demo/dreamon_instrumental.mp3',
      points: 100,
      CategoryId: category.id
    });

    // Songless question → Image answer
    await Question.create({
      question: '',
      answer: 'Album Cover',
      mediaType: 'songless',
      mediaUrl: '/media/demo/song_instrumental.mp3',
      answerMediaType: 'image',
      answerMediaUrl: '/media/demo/album_cover.jpg',
      points: 200,
      CategoryId: category.id
    });

    // Songless question → Audio answer (full song)
    await Question.create({
      question: '',
      answer: 'Oasis - Don\'t Look Back in Anger',
      mediaType: 'songless',
      mediaUrl: '/media/demo/anger_instrumental.mp3',
      answerMediaType: 'audio',
      answerMediaUrl: '/media/demo/anger_full.mp3',
      points: 300,
      CategoryId: category.id
    });

    // Songless question → Video answer (music video)
    await Question.create({
      question: '',
      answer: 'Music Video',
      mediaType: 'songless',
      mediaUrl: '/media/demo/song_instrumental2.mp3',
      answerMediaType: 'video',
      answerMediaUrl: '/media/demo/music_video2.mp4',
      points: 400,
      CategoryId: category.id
    });

    // Songless question → Text answer (another example)
    await Question.create({
      question: '',
      answer: 'Elton John - Rocket Man',
      mediaType: 'songless',
      mediaUrl: '/media/demo/rocketman_instrumental.mp3',
      points: 500,
      CategoryId: category.id
    });

    console.log('Demo database seeded successfully!');
    console.log('\nCreated demo game with:');
    console.log('- 1 Round');
    console.log('- 4 Players');
    console.log('- 6 Categories (one for each question type)');
    console.log('- 30 Questions (covering all question/answer type combinations)');
    console.log('\nQuestion Types Demonstrated:');
    console.log('  1. Text questions');
    console.log('  2. Image questions');
    console.log('  3. Audio questions');
    console.log('  4. Video questions');
    console.log('  5. Slides questions (multiple images)');
    console.log('  6. Songless questions (instrumental audio)');
    console.log('\nAnswer Types Demonstrated:');
    console.log('  - Text answers (default)');
    console.log('  - Image answers');
    console.log('  - Audio answers');
    console.log('  - Video answers');
  } catch (error) {
    console.error('Error seeding demo database:', error);
  } finally {
    process.exit();
  }
}

seed();
