/*
 * Word Guessing Game - Template
 *
 */
'use strict';

//Define a container for the game, its variables and its methods.
var game = {
  score: 0,            // player score
  answerPosition: 0,   // position of the current answer in the answersList - start at 0
  display: '',         // the current dash/guessed letters display - ex '-a-a--r--t'
  wrong: '',           // all the wrong letters guessed so far
  answer: '',          // the correct answer - one word from game.answersList
  wrongCount: 0,       // the number of wrong guesses so far
  over: false,         // is the game over?
  answersList: [       // list of answers to cycle through
    'JavaScript',
    'document',
    'element',
    'ajax',
    'jQuery',
    'event',
    'json',
    'listener',
    'transition',
    'window'
  ]
};

if (localStorage.getItem("game")) {
  var game = JSON.parse(localStorage.getItem("game"));
}

game.restart = function () {
    if (game.answerPosition >= game.answersList.length) {     // if we reach past the last word, reset to the first word.
      game.answerPosition = 0;
    }
    //resets the game progress variables
    if (game.over!==true) {
      game.score -= 1;
    }
    game.over = false;
    game.answer = game.answersList[game.answerPosition++];  // saves the game and sets the position ready for next game
    game.display = "";
    game.wrong = "";
    game.wrongCount = 0;
    $('#score').text("Score: "+game.score);
    $('#wrong').text(game.wrong);
    $('progress').val(game.wrongCount);   // resets the progress bar
    $('#guessedletter').val("");
    for (var i = 0; i<game.answer.length; i++){      // add a "-" to the display for each letter in the answer word
      game.display += "-";
    }
    $('#display').text(game.display);
    $('#guessedletter').focus();
    localStorage.game = JSON.stringify(game);
};


game.play = function () {
  if (game.over === true) {
    ;  // game.checkLetter() will not happen if game.over is true
  }
  else {
    game.checkLetter();
  }
  $('#guessedletter').val("");
  $('#guessedletter').focus();
  localStorage.game = JSON.stringify(game);
};

// Define additional methods here
game.checkLetter = function () {
  var exists = false;
  if ($('#guessedletter').val() && $('#guessedletter').val()!== " ") {
    for (var i = 0; i < game.answer.length; i++) {
      if (game.answer[i].toLowerCase() === $('#guessedletter').val().toLowerCase()) {
        exists = true;
        // make game.display a new string with the letter of the answer in the correct index
        game.display = game.display.substring(0, i) + game.answer[i] + game.display.substring(i+1);
      }
    }
    $('#display').text(game.display);
    if (exists === false) {   // guess letter not found in answer
      game.wrongCount++;
      game.wrong += " "+$('#guessedletter').val().toLowerCase();
      $('progress').val(game.wrongCount);
      $('#wrong').text(game.wrong);
    }
    if (game.wrongCount == 10) {  // the player has run out of guesses
      game.over = true;
      game.score -= 2;
      $('#score').text("Score: "+game.score);
      $('#wrong').text('No more guesses - the answer was "'+ game.answer + '"')
    }
    if (game.display.indexOf("-") === -1) {  // the player has found all letters
      game.over = true;
      game.score += 3;
      $('#score').text("Score: "+game.score);
      $('#wrong').text("Congratulations! You win!");
    }
  }
};

// Main program starts here
$(document).ready(function () {
    game.score +=1;
    game.over = false;
    game.restart();
    $('#guessbutton').click(game.play);
    $('#restart').click(game.restart);
});