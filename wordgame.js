
$("#btnGenerate").click(function () {

  //--- -----------------------------------------------------------
  //--- This happens when the "Get New Word" button is clicked.
  //--- -----------------------------------------------------------

  //--- Reset the timer.
  $("#DateCountdown").TimeCircles().stop();
  $("#DateCountdown").TimeCircles().restart();
  
  //--- Load up some shuffles
  var shufflesRemaining = parseInt($('#lblShufflesRemaining').html());
  shufflesRemaining = shufflesRemaining + 3;
  $('#lblShufflesRemaining').html(shufflesRemaining);
  $('#btnShuffle').html("Shuffle (" + shufflesRemaining + ")")
  unLockButtons();
  
  //--- Clear the letter board
  $("#letters").empty();

  //--- Get a random number.
  var randomNumber = getNumber();

  //--- Get a word based in randomNumber
  var randomWord = getWord(randomNumber);

  //--- Shuffle the word.
  var arrShuffledWord = randomWord.split('');
  var shuffledWord = shuffle(arrShuffledWord);
  shuffledWord = shuffledWord.join('');

  //--- How long is the word?
  var wordLength = shuffledWord.length;

  //--- Display the word in the debug section.
  $('#lblRandomWord').html(randomWord);

  //--- Display the length of the word.
  $('#lblLetterCount').html(wordLength);

  //--- Split the word into an array.
  var wordArray = [];
  for (var i = 0; i < shuffledWord.length; i++) {
    wordArray.push(shuffledWord.charAt(i));
  }

  //--- And add the letters to the wordboard
  for (var j = 0; j < wordArray.length; j++) {
    $("#letters").append("<li>" + wordArray[j] + "</li>");
  }

  //--- Start the timer.
  $("#DateCountdown").TimeCircles().start();

  $("#DateCountdown").TimeCircles().addListener(function(unit, value, total) {
    if(total == 0) lockButtons();
  });

});

$("#btnShuffle").click(function () {

  //--- -----------------------------------------------------------
  //--- This happens when the "Shuffle" button is clicked.
  //--- -----------------------------------------------------------

  //--- Clear out the wordboard.
  $("#letters").empty();

  //--- Get the current amount of remaining shuffles
  var shufflesRemaining = parseInt($('#lblShufflesRemaining').html());
  shufflesRemaining = shufflesRemaining - 1;
  $('#lblShufflesRemaining').html(shufflesRemaining);
  $('#btnShuffle').html("Shuffle (" + shufflesRemaining + ")")

  //--- Knock out the shuffle button if there are no more shuffles left.
  if (shufflesRemaining ==0){
    $('#btnShuffle').prop("disabled",true);
  }

  //--- Get the word from the debug information
  var randomWord = $('#lblRandomWord').html();

  //--- Shuffle the word.
  var arrShuffledWord = randomWord.split('');
  var shuffledWord = shuffle(arrShuffledWord);
  shuffledWord = shuffledWord.join('');

  //--- Split the word into an array
  var wordArray = [];
  for (var i = 0; i < shuffledWord.length; i++) {
    wordArray.push(shuffledWord.charAt(i));
  }

  //--- add the letters to the wordboard
  for (var j = 0; j < wordArray.length; j++) {
    $("#letters").append("<li>" + wordArray[j] + "</li>");
  }

});

$("#btnSolve").click(function () {

  //--- -----------------------------------------------------------
  //--- This happens when the "Shuffle" button is clicked.
  //--- -----------------------------------------------------------

  //--- Stop the timer
  $("#DateCountdown").TimeCircles().stop();

  //--- Calculate the reward by formatting the remaining seconds 
  //--- on the timer.
  var elapsedTime = parseInt($("#DateCountdown").TimeCircles().getTime());
  var reward = Math.round(elapsedTime);
  
  //--- Display the reward.
  var coinCount = parseInt($('#lblCoinCount').html());
  coinCount = coinCount + reward;
  $('#lblCoinCount').html(coinCount);

});

$("#DateCountdown").TimeCircles({
  "animation": "smooth",
  "start": false,
  "bg_width": 1.2,
  "fg_width": 0.1,
  "count_past_zero": false,
  "total_duration": 30,
  "circle_bg_color": "#60686F",
  "time": {
    "Days": {
      "text": "Days",
      "color": "#FFCC66",
      "show": false
    },
    "Hours": {
      "text": "Hours",
      "color": "#99CCFF",
      "show": false
    },
    "Minutes": {
      "text": "Minutes",
      "color": "#BBFFBB",
      "show": false
    },
    "Seconds": {
      "text": "Seconds",
      "color": "#FF9999",
      "show": true
    }
  }
});

function lockButtons() {
  $('#btnShuffle').prop("disabled",true);
  $('#btnSolve').prop("disabled",true);
}

function unLockButtons() {
  $('#btnShuffle').prop("disabled",false);
  $('#btnSolve').prop("disabled",false);
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function getNumber() {
  var minNumber = 1;
  var maxNumber = 129582;
  var randomNumber = Math.floor(Math.random() * (maxNumber + 1) + minNumber); // la fonction magique
  return randomNumber;
}

function getWord(randomNumber) {
  var word = words[randomNumber];
  return word;
}