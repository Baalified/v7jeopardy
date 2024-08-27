

var v7jeopardy = angular.module('v7jeopardy', []);
var buzzerSound = new Audio("sounds/gamesounds/buzzer.wav");
var themeSong = new Audio("sounds/themesong.mp3");
var questionSound = new Audio();
var disableSoundOnGm = true;

v7jeopardy.controller('AppCtrl', ['$scope', '$http', '$location', 'socketio', function($scope, $http, $location, socketio) {
  $scope.gamemaster=false;
  $scope.currentplayer=false;
  $scope.hidejoin = false;

  $scope.themePlay = function() {
    socketio.emit("themePlay");
  };
  socketio.on("themePlay", function() {
    if(disableSoundOnGm && !$scope.gamemaster) {
      themeSong.load(themeSong.src);
      themeSong.play();
    }
  });

  $scope.themeStop = function() {
    socketio.emit("themeStop");
  };
  socketio.on("themeStop", function() {
    themeSong.pause();
  });

  $scope.themeToggle = function() {
    if(themeSong.volume == 1) {
      socketio.emit("themeToggle", 0.5);
    }else{
      socketio.emit("themeToggle", 1);
    }
  };
  socketio.on("themeToggle", function(vol) {
    themeSong.volume = vol;
  });

  $scope.toggleSplash = function() {
    socketio.emit("toggleSplash", !$scope.splashscreen);
  };

  socketio.on('toggleSplash', function(splash) {
    $scope.splashscreen=splash;
  });

  $scope.showSolution = function(){
    socketio.emit("showSolution");
  }

  socketio.on("showSolution", function() {
    if($scope.currentgame.activequestion.audio_answer) {
      if(disableSoundOnGm && !$scope.gamemaster) {
        questionSound.src = $scope.currentgame.activequestion.audio_answer;
        questionSound.load();
        questionSound.play();
      }
    }else if($scope.currentgame.activequestion.video_answer) {
      if(disableSoundOnGm && !$scope.gamemaster) {
        const video = document.getElementById('videoQuestion');
        const source = document.getElementById('mp4_src');
        source.src = $scope.currentgame.activequestion.video_answer;
        video.load();
        video.play();
      }
    }
    $scope.currentgame.activequestion.showsolution=true;
  });
  
  /* Getting the initial Games List.
  The list will be emitted when the client connects. */
  socketio.on('initGamesList', function(gameslist) {
    console.log("Initializing GamesList...");
    $scope.games = gameslist;
  });
  
  $scope.choseQuestion = function(question) {
    // If there is an active question already, return
    if($scope.currentgame.activequestion)
      return
    
    // Mark question as active question
    question.played=true;
    $scope.currentgame.activequestion = question;
    
    emitGameData();
  };

  $scope.videoQuestionPlay = function() {
    socketio.emit('videoQuestionPlay');
  };

  $scope.videoQuestionReplay = function() {
    socketio.emit('videoQuestionReplay');
  };
  
  socketio.on('videoQuestionPlay', function(gm) {
    const video = document.getElementById('videoQuestion');
    const source = document.getElementById('mp4_src');
    if(disableSoundOnGm && !$scope.gamemaster) {
      console.log('SRC: '+source.src);
      if(!source.src.endsWith($scope.currentgame.activequestion.video)) {
        source.src = $scope.currentgame.activequestion.video;
        video.load();
      }
      video.play();
    }
  });

  socketio.on('videoQuestionReplay', function(gm) {
    const video = document.getElementById('videoQuestion');
    const source = document.getElementById('mp4_src');
    if(disableSoundOnGm && !$scope.gamemaster) {
      source.src = $scope.currentgame.activequestion.video;
      console.log('SRC: '+source.src);
      video.load();
      video.play();
    }
  });
  
  socketio.on('videoQuestionStop', function(gm) {
    const video = document.getElementById('videoQuestion');
    video.pause();
  });
  
  $scope.videoQuestionStop = function() {
    socketio.emit('videoQuestionStop');
  };
  
  $scope.audioQuestionPlay = function() {
    socketio.emit('audioQuestionPlay');
  };

  $scope.audioQuestionReplay = function() {
    socketio.emit('audioQuestionReplay');
  };
  
  socketio.on('audioQuestionPlay', function(gm) {
    if(disableSoundOnGm && !$scope.gamemaster) {
      if(!questionSound.src.endsWith($scope.currentgame.activequestion.audio)) {
        questionSound.src = $scope.currentgame.activequestion.audio;
        questionSound.load();
      }
      questionSound.play();
    }
  });

  socketio.on('audioQuestionReplay', function(gm) {
    if(disableSoundOnGm && !$scope.gamemaster) {
      questionSound.src = $scope.currentgame.activequestion.audio;
      questionSound.load();
      questionSound.play();
    }
  });
  
  socketio.on('audioQuestionStop', function(gm) {
    questionSound.pause();
  });
  
  $scope.audioQuestionStop = function() {
    socketio.emit('audioQuestionStop');
  };
  
  $scope.closeQuestion = function() {
    $scope.audioQuestionStop();
    $scope.videoQuestionStop();
    delete $scope.currentgame.activequestion;
    delete $scope.currentgame.activeplayer;
    emitGameData();
  };
  
  $scope.reopenQuestion = function() {
    delete $scope.currentgame.activeplayer
    emitGameData();
  };
  
  $scope.correctAnswer = function() {
    // increase points of active player, close question
    $scope.currentgame.activeplayer.score = parseInt($scope.currentgame.activeplayer.score) + parseInt($scope.currentgame.activequestion.points);
    $scope.currentgame.activeplayer.answers++;
    $scope.closeQuestion();
    emitGameData();
  };
  
  $scope.wrongAnswer = function() {
    // decrease points of active player, reopen question
    $scope.currentgame.activeplayer.score = parseInt($scope.currentgame.activeplayer.score) - parseInt($scope.currentgame.activequestion.points);
    $scope.reopenQuestion();
    emitGameData();
  };
  
  $scope.buzz = function(player) {
//    if($scope.currentgame.activequestion && !$scope.currentgame.activeplayer) {
//      $scope.currentgame.activeplayer = player;
//      emitGameData();
//    }
    socketio.emit('buzz', {'player':player});
  }
  
  var emitGameData = function() {
    socketio.emit('gamedata', JSON.parse(angular.toJson($scope.currentgame)));
  };
  
  socketio.on('gamedata', function(game) {
    $scope.currentgame = game;
    if(!game.activequestion) {
      questionSound.pause();
      const video = document.getElementById('videoQuestion');
      const source = document.getElementById('mp4_src');
      source.src = "";
      video.load();
    }
  });

  socketio.on('buzz', function(buzzdata) {
    console.log('Received buzz.');
    if($scope.currentgame.activequestion && !$scope.currentgame.activeplayer) {
      $scope.currentgame.activeplayer = $scope.currentgame.players[buzzdata.player];
      console.log('Active player set.');
      $scope.audioQuestionStop();
      $scope.videoQuestionStop();
      if(disableSoundOnGm && !$scope.gamemaster) {
        buzzerSound.play();
      }
      //emitGameData();
    }
  });
  
  socketio.on('setgm', function(gm) {
    $scope.gamemaster=gm;
  });
  
  var preloadImages = function() {
    if($scope.currentgame) {
      $scope.currentgame.categories.forEach(category => {
        category.questions.forEach(question => {
          if(question.image) {
            console.log("Preloading image: "+question.image);
            (new Image()).src = question.image;
          }
          if(question.image_answer) {
            console.log("Preloading image: "+question.image_answer);
            (new Image()).src = question.image_answer;
          }
        })
      });
    }
  }

  $scope.loadGame = function(selgame) {
    /*if($scope.currentgame && $scope.currentgame.players) {
      selgame.players = $scope.currentgame.players
    }*/
    $scope.currentgame = selgame;
    emitGameData();
    $scope.showloadgame = false;
    preloadImages()
  }
  
  $scope.saveGame = function() {
    $scope.showeditplayers = false;
    emitGameData();
  }

  $scope.joinGame = function() {
    if($scope.currentgame) {
      if($scope.currentgame.players) {
        for(i=0; i < $scope.currentgame.players.length; i++) {
          if($scope.currentgame.players[i].name.toLowerCase() == $scope.newplayer.name.toLowerCase()) {
            $scope.showRejoin=true;
            return;
          }
        }
      }
      $scope.newplayer.score = 0;
      $scope.currentgame.players.push($scope.newplayer);
      $scope.rejoinGame();
    }
  }

  $scope.rejoinGame = function() {
    if($scope.currentgame) {
      if($scope.currentgame.players) {
        for(i=0; i < $scope.currentgame.players.length; i++) {
          if($scope.currentgame.players[i].name.toLowerCase() == $scope.newplayer.name.toLowerCase()) {
            $scope.currentplayer = i;
            $scope.hidejoin = true;
            emitGameData();
            return;
          }
        }
      }
    }
  }
  
  $scope.addPlayer = function() {
    if($scope.currentgame) {
      $scope.currentgame.players.push($scope.newplayer)
      emitGameData();
      $scope.newplayer = "";
    }
  }

  $scope.reloadGames = function() {
    socketio.emit("getGameList");
  }

  $scope.getSortedPlayers = function() {
    ret = Array.from($scope.currentgame.players);
    return ret.sort($scope.scoreComparator);
  }

  $scope.scoreComparator = function(v1,v2) {
    console.log(v1.score+"::"+v2.score);
    return (parseInt(v1.score) > parseInt(v2.score)) ? -1 : 1;
  }
  
  $scope.buzzerTest = function() {
    console.log("buzzerTest()");
    if(!$scope.currentgame.activequestion) {
      $scope.currentgame.activequestion = {question: 'BUZZERTEST', answer: '', points: 0, player: false};
      emitGameData();
    }
  }
  
}]).filter('range', function() {
  // Range filter for implementing sequence 0..4 in Angular ng-repeat tag
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
}).factory('socketio', ['$rootScope', function ($rootScope) {
  // socket.io factory from http://briantford.com/blog/angular-socket-io
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);;
