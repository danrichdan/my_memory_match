//GAME'S MAIN VARIABLES
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var cards_Selected = 0;

//USED FOR TRACKING WHICH CARDS HAVE BEEN MATCHED
var card_to_track_1 = null;
var card_to_track_2 =null;
var matched_card = [];
//STATS VARIABLES
var matches = 0;
//Every time the application finds a match this variable is incremented by 1

var attempts = 0;
//Every time a user attempts a match (clicks the 2nd card) the attempts are incremented by 1

var accuracy = 0;
//Accuracy is a percentage of matches / attempts

var games_played = 0;
//When the page is loaded a new global variable is defined called games_played.
// When the game is reset by clicking the reset button the games_played is incremented by 1.


/****************************
  BEGINNING OF FUNCTIONS
*****************************/

function randomizeCards() {
    //store all of the src atrributes for the .front images
    var cardFronts = ["final_images/siberian-husky.jpg","final_images/amer-eskimo.jpg","final_images/akita.jpg","final_images/australian_cattle_dog.jpg","final_images/canaan-dog.jpg","final_images/doberman.jpg","final_images/mutt.jpg","final_images/toughguy.jpg","final_images/tongue.jpg"];
    //double the images by concatenting them
    var preShuffleFronts = cardFronts.concat(cardFronts);
    //create an empty array to store the new shuffled images
    var shuffledFronts = [];
    while (preShuffleFronts.length > 0) {
        var randomIndex = Math.floor(Math.random() * preShuffleFronts.length);
        var randomImageSrc = preShuffleFronts.splice(randomIndex, 1)[0];
        shuffledFronts.push(randomImageSrc);
    }
// Insert image sources into DOM
    var $imageFronts = $('.front img');
    $imageFronts.each(function(){
        var src = shuffledFronts.pop();
        $(this).attr("src", src);
    });
};

function assignClickEvent() {
    $('.card').off('click').on('click', function () {
        card_clicked(this);

    });
};

function display_stats() {
    //THIS FUNCTION DISPLAYS THE STATISTICS

    // Inserts the games_played value into the element “.games-played .value”
    $('.games-played .value').text('Games played: ' + games_played) ;

    // Inserts attempts value into the element “.attempts .value”
    $('.attempts .value').text('Attempts: ' + attempts);

    // Formats accuracy to be a percentage number with the % sign
    accuracy = ((matches / attempts).toFixed(2) * 100);
    accuracy = Math.floor(accuracy);
    $('.accuracy .value').text('Accuracy: ' + accuracy + '%');

   //Takes formatted accuracy and inserts the value of the variable into the element “.accuracy .value”
};

function reset_stats() {
    //RESETS THE VARIABLES TO INITIAL STATES
    accuracy = 0;
    matches = 0;
    match_counter = 0;
    attempts = 0;
    first_card_clicked = null;
    second_card_clicked = null;
    matched_card = [];
    card_to_track_1 = null;
    card_to_track_2 = null;

    //REMOVES THE "YOU'VE WON STYLING/BACKGROUND"
    $('div#win-result').removeClass('win-shout-out');
    //DISPLAYS THE UPDATED STATISTICS
    display_stats();
    //FLIPS THE CARDS TO SHOW THEIR BACKS
    $('.back').show();
    assignClickEvent();
    randomizeCards();
};

    $(document).on('ready', function () {
        randomizeCards();
        assignClickEvent();
        display_stats();
        //ACCURACY WILL DISPLAY AS NaN IF THIS IS NOT SET TO EMPTY
        $('.accuracy .value').text('Accuracy: ' + ' N/A ');

        //ADD CLICK HANDLER TO RESET BUTTON
        $('.reset').on('click',function() {
            games_played ++;
            reset_stats();
            $('.accuracy .value').text('Accuracy: ' + ' N/A ');
            $('h2.victory').text('');
        });
    });

function card_clicked(clickedCard) {
    //HIDE THE CARD BACK
      var $backFace = $(clickedCard).find('.back');
      $backFace.hide();

    //SEE IF THE CARD CLICKED IS THE FIRST CARD
    if (first_card_clicked === null) {
        cards_Selected =1;
        first_card_clicked = $(clickedCard);
        console.log('THIS IS THE VALUE OF first_card_clicked', first_card_clicked );
        $(clickedCard).off("click");
        //I added the off click so the user could not click on a the same card and have it be considered a match
        second_card_clicked = null;
        card_to_track_1 = $(clickedCard);
    } else {
    //IF IT'S THE SECOND CARD CLICKED....
        attempts ++;
        cards_Selected = 2;
        second_card_clicked = $(clickedCard);
        $(clickedCard).off("click");
        card_to_track_2 = $(clickedCard);

        //GETS THE VALUES OF THE SRC ATTRIBUTE, THESE WILL BE USED TO MATCH
          var first_card_image = $(first_card_clicked).find('.front img').attr('src');
          var second_card_image = $(second_card_clicked).find('.front img').attr('src');

        //SEE IF THE IMAGES MATCH
        if(first_card_image === second_card_image   ) {
            match_counter ++;
            matches ++;

            //TRACKING AND STORING THE MATCHED CARDS
            matched_card.push(card_to_track_1);
            matched_card.push(card_to_track_2);

            //RESETS CARD VARIABLES TO VALUES AT THE BEGINNING
            first_card_clicked = null;
            second_card_clicked = null;

            //SEE IF THE PLAYER HAS WON THE GAME YET
            if(match_counter === total_possible_matches) {
                display_stats();
                //If the player clicks on the reset button in the stats area when the new button shows,
                //a defect occurs with the display of the new one.
                //disabling it was a quick fix
                $('.stats-area button').attr('disabled',true);

                //WAIT A SEC AND THEN... BLAMMO, YOU WON
                setTimeout(function(){
                    $('h2.victory').text('You\'ve Won!!!');
                    //ADDS STYLING FOR WIN ANNOUNCEMENT SECTION
                    $('div#win-result').addClass('win-shout-out');
                    //ADDS BUTTON TO WIN SECTION
                    var $button = $('<button>').text('reset game').addClass('reset');
                    $button.appendTo('div#win-result');

                    //ADDS CLICK HANDLER TO THE BUTTON IN THE WIN SECTION
                    $button.click(function(){
                        $('.stats-area button').attr('disabled',false);
                        games_played ++;
                        reset_stats();
                        $('.accuracy .value').text('Accuracy: ' + ' N/A ');
                        $('h2.victory').text('');
                        $button.hide();
                    })
                }, 1000)
            } else {
                //IF THEY DIDN'T WIN...
                display_stats();
                return;
            }
            return;
        } else {
           //IF THE CARDS DIDN'T MATCH...
        $('.card').off("click");/*this makes it so the user can't click on other cards while mismatched cards are
             showing*/
            setTimeout(function(){
                //This is so they don't flip over right away without the player seeing what they chose
                display_stats();
                $(first_card_clicked).find('.back').show();
                $(second_card_clicked).find('.back').show();
                //set the card variables back to the value at the beginning
                first_card_clicked = null;
                second_card_clicked = null;
                // resets the ability to click on cards
                assignClickEvent();
                //TAKES THE CLICK HANDLER OFF OF THE MATCHED CARDS
                for(var i = 0; i < matched_card.length; i++) {
                    matched_card[i].off('click');
                }
            }, 1000);
            return;
        }
    }
};
