$("#btnGenerate").click(function () {

  $("#DateCountdown").TimeCircles().stop();
  $("#DateCountdown").TimeCircles().restart();

  //--- clear the letter board
  $("#letters").empty();

  //--- Get a random number.
  var randomNumber = getNumber();

  //--- Get a word
  var randomWord = getWord(randomNumber);

  //--- Try to shuffle it here
  var arrShuffledWord = randomWord.split('');
  var shuffledWord = shuffle(arrShuffledWord);
  shuffledWord = shuffledWord.join('');

  //--- How long is the word?
  var wordLength = shuffledWord.length;

  //--- Display the word.
  $('#lblRandomWord').html(randomWord);
  $('#lblLetterCount').html(wordLength);
  //--- Reset the keyboard
  //$("li").removeClass("deaditem");

  //--- Split the word into an array
  var wordArray = [];
  for (var i = 0; i < shuffledWord.length; i++) {
    wordArray.push(shuffledWord.charAt(i));
  }
  //--- add the letters to the wordboard
  for (var j = 0; j < wordArray.length; j++) {
    $("#letters").append("<li>" + wordArray[j] + "</li>");
  }

  $("#DateCountdown").TimeCircles().start();

});

$("#btnShuffle").click(function () {
  $("#letters").empty();
  var randomWord = $('#lblRandomWord').html();
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

  $("#DateCountdown").TimeCircles().stop();

  var totalTime = 30;
  var elapsedTime = parseInt($("#DateCountdown").TimeCircles().getTime());
  var reward = Math.round(elapsedTime);
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