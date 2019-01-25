

$('#btnLockLetter').prop("disabled", true);
$('#btnShuffle').prop("disabled", true);
$('#btnAddTime').prop("disabled", true);
$('#btnSolve').prop("disabled", true);

$("#btnGenerate").click(function () {

  //--- -----------------------------------------------------------
  //--- This happens when the "Get New Word" button is clicked.
  //--- -----------------------------------------------------------

  //--- Set up the reward buttons
  setRewardButtons();

  //--- Make sure the SOLVE and SHUFFLE button are active.
  unLockButtons();

  //--- Clear the letter board.
  $("#letters").empty();

  //--- Get a word based in randomNumber
  getWord();

  //--- Shuffle the word and add it to the wordboard.
  shuffleWord(true);

  //--- Start the timer.
  $("#DateCountdown").TimeCircles().start();

  // //--- Get an idea of how many time extensions are available to the player.
  // //--- I think we need to use this for the next step.
  // var extensionsRemaining = parseInt($('#lblExtensionsRemaining').html());

  //--- Add a listener to the timer. This will help us do a couple of things:
  //---    1. Stop the game when the timer runs out and run lockButtons();
  //---    2. Show the Add Time button if there 20 seconds or less left.
  $("#DateCountdown").TimeCircles().addListener(function (unit, value, total) {
    //--- Time's up. Game over.    
    if (total == 0) showTimeAlert();     
    if (total > 19) $('#btnAddTime').prop("disabled", true);  
    if (total < 20) $('#btnAddTime').prop("disabled", false);  
    //if (total < 20)  $('#btnAddTime').prop("disabled", false);
    //if (extensionsRemaining == 0) $('#btnAddTime').prop("disabled", true);
  });

});



$("#btnSolve").click(function () {

  //--- -----------------------------------------------------------
  //--- This happens when the "Solve" button is clicked.
  //--- -----------------------------------------------------------

  //--- Stop the timer
  $("#DateCountdown").TimeCircles().stop();

  //--- Calculate the reward by formatting the remaining seconds 
  //--- on the timer.
  var elapsedTime = parseInt($("#DateCountdown").TimeCircles().getTime());
  var reward = Math.round(elapsedTime);

  //--- Show the success alert.
  $.notify({
    message: "Congratulations!<br> You solved the puzzle in " + reward + " seconds and earned " + reward + " coins.",
  },{
    delay: "3000",
    type: "success",
    placement: {
      from: "top",
      align: "center"
    },
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
  });


  //--- Display the reward.
  var coinCount = parseInt($('#lblCoinCount').html());
  coinCount = coinCount + reward;
  $('#lblCoinCount').html(coinCount);
  $('#btnSolve').prop("disabled", true);
  $('#btnShuffle').prop("disabled", true);


});

$("#btnShuffle").click(function () {

  //--- -----------------------------------------------------------
  //--- This happens when the "Shuffle" button is clicked.
  //--- -----------------------------------------------------------

  //updateShuffleCount();
  shuffleWord(false);

});

$("#btnAddTime").click(function () {

  //--- Get the current amount of remaining extensions.
  var extensionsRemaining = parseInt($('#lblExtensionsRemaining').html());
  extensionsRemaining = extensionsRemaining - 1;
  $('#lblExtensionsRemaining').html(extensionsRemaining);
  $('#btnAddTime').html("Add 10 Seconds (" + extensionsRemaining + ")")

  //--- Knock out the extensions button if there are no more extensions left.
  //--- But you can't go over 30 seconds total!!!
  if (extensionsRemaining == 0) {
    $('#btnAddTime').prop("disabled", true);
  } else {    
    var elapsedTime = parseInt($("#DateCountdown").TimeCircles().getTime());    
    //if (elapsedTime > 20) $('#btnAddTime').prop("disabled", true);
    $("#DateCountdown").TimeCircles().addTime(10);
    
  }
});

$("#btnLockLetter").click(function () {

  //--- This will allow the player to lock a letter. There will 
  //--- be a limited number of locks available per level, unless 
  //--- the player wants to buy more. This will be tricky.
  //--- This runs as a seperate function because it might 
  //--- need to call itself.

  lockLetter();

});

$("#DateCountdown").TimeCircles({
  "animation": "smooth",
  "start": false,
  "bg_width": 1.2,
  "fg_width": 0.1,
  "count_past_zero": false,
  "total_duration": 31,
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

function updateShuffleCount() {
  //--- Get the current amount of remaining shuffles and subtract 1.
  var shufflesRemaining = parseInt($('#lblShufflesRemaining').html());
  shufflesRemaining = shufflesRemaining - 1;
  $('#lblShufflesRemaining').html(shufflesRemaining);
  $('#btnShuffle').html("Shuffle (" + shufflesRemaining + ")")

  //--- Knock out the shuffle button if there are no more shuffles left.
  if (shufflesRemaining == 0) {
    $('#btnShuffle').prop("disabled", true);
  }
}

function shuffleWord(newgame) {

  //--- This is a universal function that handles shuffling words.
  //--- It has two modes:
  //--- 1: A new game, which gets the word, clears out all panels,
  //--- shuffles the word and places it in the game.
  //--- 2: An in-game shuffle that has to work around letters that
  //--- might be locked.

  //--- Starting a new game!
  if (newgame) {

    //--- Get the word
    var word = getWord();

    //--- Break it into an array.
    var arrShuffledWord = word.split('');

    //--- Add the answer to the page. This is really for debugging.
    //addAnswerToPage(arrShuffledWord);

    //--- Shuffle the word inside the array.
    shuffle(arrShuffledWord);

    //--- Lay down the individual panels to hold the letters. These go down
    //--- empty and we'll fill them in shortly.
    for (var j = 0; j < arrShuffledWord.length; j++) {
      $("#letters").append("<li> </li>");
    }

    //--- Add the letters to the LI elements.
    $("#letters li").each(function (index) {
      $("#letters li").eq(index).html(arrShuffledWord[index])
    });

  } else {

    //--- Doing an in-game shuffle.
    var unlockedLetters = "";

    //--- We need to build a list of the unlocked letters so we know
    //--- what needs to be shuffled.
    $("#letters li").each(function (index) {

      //--- Get a reference to the current element.
      var thisPanel = $("#letters li").eq(index);

      //--- If the current panel does not have the "locked" class
      //--- then we need to get the letter out.
      if (!thisPanel.hasClass("locked")) {
        //--- Get the letter from inside the panel and concatenate them.
        unlockedLetters += thisPanel.html();
      }

    });

    //--- Now let's shuffle the remaining letters.
    var arrShuffledWord = unlockedLetters.split('');
    var shuffledWord = shuffle(arrShuffledWord);
    shuffledWord = shuffledWord.join('');

    /*
    I think there needs to be a different approach. maybe we need to 
    just pull the locked letters out of the string and add them back in 
    as if it was a new word, but not messing with the locked panels.
    */


    var wordArray = [];
    for (var i = 0; i < shuffledWord.length; i++) {
      wordArray.push(shuffledWord.charAt(i));
    }

    //--- Here is where its going to get nasty. We need to 
    //--- put the shuffled letters into the unlocked
    //--- panels only. I guess the best way is to get back 
    //--- into a loop through the panels and hunting for unlocked
    //--- panels.
    $("#letters li").each(function (index) {
      var thisPanel = $("#letters li").eq(index);
      if (!thisPanel.hasClass("locked")) {
        thisPanel.html(wordArray[index])
      }
    });
  }
}

function setRewardButtons() {

  //--- Reset the timer.
  $("#DateCountdown").TimeCircles().stop();
  $("#DateCountdown").TimeCircles().restart();

  //--- Load up some shuffles. There will always be some available
  //--- because we will give the player 3 at the beginning of the game.
  // var shufflesRemaining = parseInt($('#lblShufflesRemaining').html());
  // shufflesRemaining = shufflesRemaining + 3;
  // $('#lblShufflesRemaining').html(shufflesRemaining);
  // $('#btnShuffle').html("Shuffle (" + shufflesRemaining + ")")

  //--- Load up some time extensions. The button has to be set to disabled
  //--- because we don't want the player to hit it until we're under 
  //--- 20 seconds on the time. The rule will be that we will never let 
  //--- the player go over 60 seconds. We'll always give the player 2
  //--- extensions at the beginning of the game.
  $('#btnAddTime').prop("disabled", true);
  var extensionsRemaining = parseInt($('#lblExtensionsRemaining').html());
  extensionsRemaining = extensionsRemaining + 2;
  $('#lblExtensionsRemaining').html(extensionsRemaining);
  $('#btnAddTime').html("Add 10 Seconds (" + extensionsRemaining + ")")

  //--- Load up some shuffles. There will always be some available
  //--- because we will give the player 3 at the beginning of the game.
  var locksRemaining = parseInt($('#lblLocksRemaining').html());
  locksRemaining = locksRemaining + 3;
  $('#lblLocksRemaining').html(locksRemaining);
  $('#btnLockLetter').html("Lock a Letter (" + locksRemaining + ")")
  $('#btnLockLetter').prop("disabled", false);
}

function lockLetter(redo) {

  //--- This will allow the player to lock a letter. There will 
  //--- be a limited number of locks available per level, unless 
  //--- the player wants to buy more. This will be tricky.
  //--- The value that comes in via redo is a flag that tells 
  //--- us that we tried to randomly lock a letter that has already 
  //--- been locked. So, we run this again until we get a letter
  //--- that is unlocked.

  //--- Get these values out of the interface
  var word = $('#lblWord').html();
  var wordLength = $('#lblWordLength').html();
  var lockedLetterCount = parseInt($('#lblLockedLetters').html());
  var locksRemaining = parseInt($('#lblLocksRemaining').html());

  //--- Only run the purchase if this isn't a redo
  if (redo != 1) {

    //--- Subtract 1 from the remaining locks and 
    //--- increment the locked letter count.
    locksRemaining -= 1;
    lockedLetterCount += 1

    $('#lblLocksRemaining').html(locksRemaining);
    $('#lblLockedLetters').html(lockedLetterCount);
    $('#btnLockLetter').html("Lock a Letter (" + locksRemaining + ")")

    //--- Knock out the shuffle button if there are no more shuffles left.
    if (locksRemaining == 0) {
      $('#btnLockLetter').prop("disabled", true);
    }
  }

  //--- Create a random number to select a letter to lock. This is 
  //--- based off the length of the entire word.
  var randomNumber = parseInt(getRandomWordNumber(wordLength));

  //--- If the selected letter is already locked, call this
  //--- function again to get a new letter.
  if ($("#letters li").eq(randomNumber).hasClass("locked")) {
    //--- Something we tried to lock was already locked. Call this function again with a 1 and we'll skip
    //--- the part where we take away a lock.
    lockLetter(1);
  } else {
    //--- Lock this letter.
    $("#letters li").eq(randomNumber).addClass("locked");
    //--- Add the actual letter to the locked panel.
    $("#letters li").eq(randomNumber).html(word.charAt(randomNumber));
  }

  //--- If the length of the word equals the number of locked panels, then disable the lock button.
  if (lockedLetterCount == wordLength) {
    //--- All the letters have been locked. No more locking and no more shuffling.
    $('#btnLockLetter').prop("disabled", true);
    $('#btnShuffle').prop("disabled", true);
  }

  //--- Make real sure that we have the button disabled.
  if (locksRemaining == 0) {
    $('#btnLockLetter').prop("disabled", true);
  }

}

function lockButtons() {
  $('#btnShuffle').prop("disabled", true);
  $('#btnSolve').prop("disabled", true);
}

function unLockButtons() {
  $('#btnShuffle').prop("disabled", false);
  $('#btnSolve').prop("disabled", false);
  $('#lblLockedLetters').html(0);
  $('#btnLockLetter').prop("disabled", true);
  $('#btnAddTime').prop("disabled", true);
  $('#btnGenerate').prop("disabled", true);
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
  var maxNumber = 5000;
  var randomNumber = Math.floor(Math.random() * (maxNumber + 1) + minNumber); // la fonction magique
  return randomNumber;
}

function getRandomWordNumber(upperLimit) {
  var minNumber = 0;
  var maxNumber = upperLimit;
  var randomNumber = Math.floor(Math.random() * (maxNumber) + minNumber); // la fonction magique
  return randomNumber;
}

function c(string){
  console.log(string);
}

function addAnswerToPage(arrShuffledWord) {

  $("#answer").empty();
    for (var j = 0; j < arrShuffledWord.length; j++) {
      $("#answer").append("<li> </li>");
    }
    $("#answer li").each(function (index) {
      $("#answer li").eq(index).html(arrShuffledWord[index])
    });

  }

function showTimeAlert() {
  
  $.notify({
    message: "Oh no! You ran out of time!",
  },{
    delay: "3000",
    type: "danger",
    placement: {
      from: "top",
      align: "center"
    },
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
  });

  lockButtons();
}

  function getWord() {

  //--- Get a random number based on the total 
  //--- number of words available.
  var randomNumber = getNumber();

  //--- Get a word from the word list based on the above 
  //--- random number.
  var word = words[randomNumber];

  //--- Set these values in the interface so we don't always 
  //--- have to mess with calculating them.
  $("#lblWord").html(word);
  $("#lblWordLength").html(word.length);
  return word;

}