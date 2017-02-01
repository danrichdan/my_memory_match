//MAIN GAME'S VARIABLES
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var cards_Selected = 0;


//STATS VARIABLES
var matches = 0;
//Every time the application finds a match this variable should be incremented by 1

var attempts = 0;
//Every time a user attempts a match (clicks the 2nd card) the attempts should be incremented by 1

var accuracy = 0; //Accuracy is defined as a percentage of matches / attempts

var games_played = 0; //When the page is loaded a new global variable should be defined called games_played. When the game is reset by clicking the reset button the games_played should be incremented by 1.


function assignClickEvent() {
    $('.card').off('click').on('click', function () {
        card_clicked(this);
    });
};

function display_stats() {
// Inserts the games_played value into the element that would be selected like this “.games-played .value”
    $('.games-played .value').text('Games played: ' + games_played) ;

    // Insert attempts value into the element that would be selected using this selector “.attempts .value”
    $('.attempts .value').text('Attempts: ' + attempts);

// Formats accuracy to be a percentage number with the % sign
    accuracy = ((matches / attempts).toFixed(2) * 100);
    $('.accuracy .value').text('Accuracy: ' + accuracy + '%');
//Takes formatted accuracy and inserts the value of the variable into the element that has the selector of “.accuracy .value”
};

function reset_stats() {
    accuracy = 0;
    matches = 0;
    match_counter = 0;
    attempts = 0;
    first_card_clicked = null;
    second_card_clicked = null;
    display_stats();
    $('.back').show();
    assignClickEvent();

};

    $(document).on('ready', function () {
        assignClickEvent();
        console.log('Accuracy ' + accuracy);
        console.log('Matches ' + matches);
        console.log('Attempts ' + attempts);
        console.log('Games played ' + games_played);
        display_stats();
        $('.accuracy .value').text('Accuracy: ' + ' ');
        $('.reset').on('click', function() {
            games_played ++;

            reset_stats();
            $('.accuracy .value').text('Accuracy: ' + ' ');
            $('h2.victory').text('');
            //Reset all cards to have the back face showing
        });
    });

function card_clicked(clickedCard) {
     //console.log(clickedCard);
     var frontOfCardClicked= $(clickedCard).find('.front');
    //console.log(frontCard);
     var $backFace = $(clickedCard).find('.back');
    //console.log(clickedCard);

      $backFace.hide();

    if (first_card_clicked === null) {
        cards_Selected =1;
        first_card_clicked = $(clickedCard).off("click"); /*I added the off click so the user could not click on a the same card and have it be considered a match */
        second_card_clicked = null;
        //console.log('This is the first card', first_card_clicked);
    } else {
        attempts ++;
        console.log('Attempts ' + attempts);
        console.log('matches: ' + matches);
        console.log('Accuracy ' + accuracy);
        cards_Selected = 2;
        second_card_clicked = $(clickedCard);
        $(clickedCard).off("click");
          var first_card_image = $(first_card_clicked).find('.front img').attr('src');
        //console.log('This is the first image', first_card_image);
          var second_card_image = $(second_card_clicked).find('.front img').attr('src');
        //console.log('This is the second image', second_card_image);

        if(first_card_image === second_card_image   ) {
            match_counter ++;
            matches ++;
            console.log('Matches ' + matches);
            $(this).off("click");
            console.log('MATCH!', match_counter );
            first_card_clicked = null;
            second_card_clicked = null;

            if(match_counter === total_possible_matches) {
                console.log('You have won.');
                display_stats();
                $('h2.victory').text('You\'ve Won!!!');

            } else {
                display_stats();
                return;
            }

            return;
        } else {

        $('.card').off("click");/*this makes it so the user can't click on other cards while mismatched cards are
             showing*/
            setTimeout(function(){
                display_stats();
                $(first_card_clicked).find('.back').show();
                $(second_card_clicked).find('.back').show();
                first_card_clicked = null;
                second_card_clicked = null;
                assignClickEvent();// resets the ability to click on cards
            }, 2000);

            console.log('no MATCH!');
            return;
        }

    }

};
