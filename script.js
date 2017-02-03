//GAME'S MAIN VARIABLES
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var cards_Selected = 0;

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

    //REMOVES THE "YOU'VE WON STYLING/BACKGROUND"
    $('div#win-result').removeClass('win-shout-out');
    //DISPLAY THE UPDATED STATISTICS
    display_stats();
    //FLIP THE CARDS TO SHOW THEIR BACKS
    $('.back').show();

    assignClickEvent();
};

    $(document).on('ready', function () {
        assignClickEvent();
        display_stats();

        //ACCURACY WILL DISPLAY AS NaN IF THIS IS NOT SET TO EMPTY
        $('.accuracy .value').text('Accuracy: ' + ' ');

        //ADD CLICK HANDLER TO RESET BUTTON
        $('.reset').on('click', function() {
            games_played ++;
            reset_stats();
            $('.accuracy .value').text('Accuracy: ' + ' ');
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
        $(clickedCard).off("click");
        //I added the off click so the user could not click on a the same card and have it be considered a match
        second_card_clicked = null;
    } else {
    //IF IT'S THE SECOND CARD CLICKED....
        attempts ++;
        cards_Selected = 2;
        second_card_clicked = $(clickedCard);
        $(clickedCard).off("click");

        //GET THE VALUES OF THE SRC ATTRIBUTE, THESE WILL BE USED TO MATCH
          var first_card_image = $(first_card_clicked).find('.front img').attr('src');
          var second_card_image = $(second_card_clicked).find('.front img').attr('src');

        //SEE IF THE IMAGES MATCH
        if(first_card_image === second_card_image   ) {
            match_counter ++;
            matches ++;
            $(this).off("click");

            //RESET CARD VARIABLES TO VALUES AT THE BEGINNING
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
                    //ADD STYLING FOR WIN ANNOUNCEMENT SECTION
                    $('div#win-result').addClass('win-shout-out');
                    //ADD BUTTON TO WIN SECTION
                    var $button = $('<button>').text('reset game').addClass('reset');
                    $button.appendTo('div#win-result');

                    //ADD CLICK HANDLER TO THE BUTTON IN THE WIN SECTION
                    $button.click(function(){
                        $('.stats-area button').attr('disabled',false);
                        games_played ++;
                        reset_stats();
                        $('.accuracy .value').text('Accuracy: ' + ' ');
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
            }, 2000);
            return;
        }
    }
};
