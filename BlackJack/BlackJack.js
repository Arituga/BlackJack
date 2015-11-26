/**
 * This is an example of a working Black Jack game.
 * This was my entry for the Blackjack Final Challenge at
 * http://www.codecademy.com/courses/blackjack-part-3
 */

// Card Constructor
var game_deck;
var Card = function (suit, number) {
    var card_suit = suit;
    var card_number = number;

    this.getSuit = function () { return card_suit; };
    this.getNumber = function () { return card_number; };
    this.getValueStr = function () {
        switch (card_number) {
            case 1: return "Ace";
            case 11: return "Jack";
            case 12: return "Queen";
            case 13: return "King";
            default: return "" + card_number;
        }
    };
    this.getSuitStr = function () {
        switch (card_suit) {
            case 1: return "diamonds";
            case 2: return "hearts";
            case 3: return "spades";
            case 4: return "clubs";
            default: return "[unknown suit value: " + card_suit + "]";
        }
    };

    // Get the card's score value.
    // 1 (Ace) : 1 or 11
    // 2 - 10 : card value
    // 11,12,13 (face cards) : 10
    this.getValue = function () {
        if (card_number === 1) { return 11; } // Ace
        else if (card_number >= 10) { return 10; } // Face card
        else { return card_number; }
    };
};

var Deck = function () {
    var full_deck = [];
    // Create deck programatically (saves typing, should be hard coded)
    for (var i = 1; i <= 52; i++) { full_deck.push(i); }

    // shuffle deck
    // Shuffle algorithm described here:
    // http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
    this.shuffle = function () {
        var i, j, x;
        // Iterate over array in reverse
        for (i = full_deck.length - 1; i > 0; i--) {
            // Only select random position based on what is left.
            j = Math.floor(Math.random() * i);
            // Exchange a[j] with a[i]
            x = full_deck[i];
            full_deck[i] = full_deck[j];
            full_deck[j] = x;
        }
    };

    this.getNewCard = function () {
        var card_num = full_deck.pop();
        var val = card_num % 13 + 1;
        var suit = Math.ceil(card_num / 13);
        return new Card(suit, val);
    };
};

function deal() { return game_deck.getNewCard(); }

var Hand = function () {
    var my_hand = [];

    // Adds two cards top the hand
    my_hand.push(deal());
    my_hand.push(deal());

    this.getHand = function () {
        return my_hand;
    };

    this.score = function () {
        var i, x;
        var sum = 0;
        var aces = 0;
        for (i = 0; i < my_hand.length; i++) {
            x = my_hand[i].getValue();
            if (x === 11) {
                aces++;
                sum++; // Lowest value of an ace
            }
            else { sum += x; }
        }
        while (sum < 21 && aces > 0) {
            // Calulate based on 10 since a 1 was already
            // added above as a minimum for an ace.
            if (sum + 10 <= 21) {
                sum += 10;
                aces--;
            }
            else { break; }
        }
        return sum;
    };

    this.printHand = function () {
        var output = [];
        for (var i = 0; i < my_hand.length; i++) {
            output.push(my_hand[i].getValueStr() + " of " + my_hand[i].getSuitStr());
        }
        return output.join(", ");
    };

    this.hitMe = function () { my_hand.push(deal()); };

    this.busted = function () { return (this.score() > 21); };
};

function playAsDealer() {
    var dealer_hand = new Hand();
    while (dealer_hand.score() < 17) { dealer_hand.hitMe(); }
    return dealer_hand;
}

function playAsUser() {
    var player_hand = new Hand();
    var continue_loop = true;
    while (continue_loop && !player_hand.busted()) {
        continue_loop = confirm(
            "You have: " + player_hand.printHand() +
            "\nScore: " + player_hand.score() +
            "\n\nWould you like another card?"
        );
        if (continue_loop) { player_hand.hitMe(); }
    }
    return player_hand;
}

function declareWinner(userHand, dealerHand) {
    var s = {
        win: "You win!",
        lose: "You lose!",
        tie: "You tied!"
    };
    var dscore = dealerHand.score();
    var pscore = userHand.score();
    if (pscore > 21) {
        if (dscore > 21) { return s.tie; }
        else { return s.lose; }
    }
    else if (dscore > 21) { return s.win; }
    else if (pscore > dscore) { return s.win; }
    else if (pscore < dscore) { return s.lose; }
    else { return s.tie; }
}

function playGame() {
    game_deck = new Deck();
    // Shuffle the deck
    game_deck.shuffle();

    var player = playAsUser();
    var dealer = playAsDealer();

    var winner = "";
    var pprompt = (player.busted()) ? "You busted! Score" : "Your score";
    var dprompt = (dealer.busted()) ? "Dealer busted! Score" : "Dealer's score";

    winner += "\n" + pprompt + ": " + player.score();
    winner += " (" + player.printHand() + ")\n";
    winner += dprompt + ": " + dealer.score();
    winner += " (" + dealer.printHand() + ")\n";
    winner += "\n" + declareWinner(player, dealer);

    console.log(winner);
}

playGame();
// Card Constructor
/*
function Card(suit, number) {
    this.suit = suit;
    this.number = number;

    this.getSuit = function () { return suit; };
    this.getNumber = function () { return number; };
    this.getValue = function () {
        if (number > 10) { return 10; }
        else if (number == 1) { return 11; }
        else
            return number;
    };
}
function deal() {
    var randomSuit = Math.floor((Math.random() * 4) + 1);
    var randomNumber = Math.floor((Math.random() * 13) + 1);
    var card = new Card(randomSuit, randomNumber);
    return card;
}

function Hand() {
    var cardsOnHand = [];
    cardsOnHand[0] = deal();
    cardsOnHand[1] = deal();
    this.getHand = function () { return cardsOnHand; };
    this.score = function () {
        var aces = 0;
        var sum = 0;
        for (var i = 0; i < cardsOnHand.length; i++) {
            if (cardsOnHand[i].getValue() == 11) {
                aces++;
                sum = sum + cardsOnHand[i].getValue();
            }
            else
                sum = sum + cardsOnHand[i].getValue();
            while (sum > 21 && aces !== 0) {
                sum = sum - 10;
                aces--;
            }
        }
    };
    this.printHand = function () {
        var show = "";
        for (var i = 0; i < cardsOnHand.length; i++) {
            show = show + cardsOnHand[i].getNumber() + " of suit " + cardsOnHand[i].getSuit() + ", ";
        }
        return show;
    };
    this.hitMe = function () {
        var card = deal();
        cardsOnHand.push(card);
    };
}



function Card(suit, number) {
    this.suit = suit;
    this.number = number;

    this.getSuit = function () { return suit; };
    this.getNumber = function () { return number; };
    this.getValue = function () {
        if (number > 10) { return 10; }
        else if (number == 1) { return 11; }
        else
            return number;
    };
}
function deal() {
    var randomSuit = Math.floor((Math.random() * 4) + 1);
    var randomNumber = Math.floor((Math.random() * 13) + 1);
    var card = new Card(randomSuit, randomNumber);
    return card;
}

function Hand() {
    var cardsOnHand = [];
    cardsOnHand[0] = deal();
    cardsOnHand[1] = deal();
    this.getHand = function () { return cardsOnHand };
    this.score = function () {
        var sum = 0;
        var aces = 0;

        for (var i = 0; i < cardsOnHand.length; i++) {
            if (cardsOnHand[i].getValue() == 11) {
                aces++;
            }
            sum = sum + cardsOnHand[i].getValue();
        }
        while (sum > 21 && aces !== 0) {
            sum = sum - 10;
            aces--;
        }

        return sum;
    };
    this.printHand = function () {
        var show = "";
        for (var i = 0; i < cardsOnHand.length; i++) {
            show = show + cardsOnHand[i].getNumber() + " of suit " + cardsOnHand[i].getSuit() + ", ";
        }
        return show;
    };
    this.hitMe = function () {
        var card = deal();
        cardsOnHand.push(card);
    };
}
var hand = new Hand();
console.log(hand.printHand());





function Card(suit, number) {
    this.suit = suit;
    this.number = number;

    this.getSuit = function () { return suit; };
    this.getNumber = function () { return number; };
    this.getValue = function () {
        if (number > 10) { return 10; }
        else if (number == 1) { return 11; }
        else
            return number;
    };
}
function deal() {
    var randomSuit = Math.floor((Math.random() * 4) + 1);
    var randomNumber = Math.floor((Math.random() * 13) + 1);
    var card = new Card(randomSuit, randomNumber);
    return card;
}

function Hand() {
    var cardsOnHand = [];
    cardsOnHand[0] = deal();
    cardsOnHand[1] = deal();
    this.getHand = function () { return cardsOnHand };
    this.score = function () {
        var sum = 0;
        var aces = 0;

        for (var i = 0; i < cardsOnHand.length; i++) {
            if (cardsOnHand[i].getValue() == 11) {
                aces++;
            }
            sum = sum + cardsOnHand[i].getValue();
        }
        while (sum > 21 && aces !== 0) {
            sum = sum - 10;
            aces--;
        }
        return sum;
    };
    this.printHand = function () {
        var show = "";
        for (var i = 0; i < cardsOnHand.length; i++) {
            show = show + cardsOnHand[i].getNumber() + " of suit " + cardsOnHand[i].getSuit() + ", ";
        }
        return show;
    };
    this.hitMe = function () {
        var card = deal();
        cardsOnHand.push(card);
    };
}
function playAsDealer() {
    var hand = new Hand();
    while (hand.score() < 17) {
        hand.hitMe();
    }
    return hand;
};




function Card(suit, number) {
    this.suit = suit;
    this.number = number;

    this.getSuit = function () { return suit; };
    this.getNumber = function () { return number; };
    this.getValue = function () {
        if (number > 10) { return 10; }
        else if (number == 1) { return 11; }
        else
            return number;
    };
}
function deal() {
    var randomSuit = Math.floor((Math.random() * 4) + 1);
    var randomNumber = Math.floor((Math.random() * 13) + 1);
    var card = new Card(randomSuit, randomNumber);
    return card;
}

function Hand() {
    var cardsOnHand = [];
    cardsOnHand[0] = deal();
    cardsOnHand[1] = deal();
    this.getHand = function () { return cardsOnHand };
    this.score = function () {
        var sum = 0;
        var aces = 0;

        for (var i = 0; i < cardsOnHand.length; i++) {
            if (cardsOnHand[i].getValue() == 11) {
                aces++;
            }
            sum = sum + cardsOnHand[i].getValue();
        }
        while (sum > 21 && aces !== 0) {
            sum = sum - 10;
            aces--;
        }
        return sum;
    };
    this.printHand = function () {
        var show = "";
        for (var i = 0; i < cardsOnHand.length; i++) {
            show = show + cardsOnHand[i].getNumber() + " of suit " + cardsOnHand[i].getSuit() + ", ";
        }
        return show;
    };
    this.hitMe = function () {
        var card = deal();
        cardsOnHand.push(card);
    };
}
function playAsDealer() {
    var hand = new Hand();
    while (hand.score() < 17) {
        hand.hitMe();
    }
    return hand;
};
function playAsUser() {
    var hand = new Hand();
    var decision = confirm("Your hand is " + hand.printHand() + ": Hit OK to hit(take another card) or Cancel to stand");
    while (decision) {
        hand.hitMe();
        decision = confirm("Your hand is " + hand.printHand() + ": Hit OK to hit(take another card) or Cancel to stand");
    }
    return hand;
};
function declareWinner(userHand, dealerHand) {
    var userScore = playAsUser().score();
    var dealerScore = playAsDealer().score();

    if (userScore > 21) {
        if (dealerScore > 21)
            return "You tied!";
        else return "You lose!";
    }
    else if (dealerScore > 21)
        return "You win!";

    else if (userScore > dealerScore)
        return "You win!";

    else if (userScore == dealerScore)
        return "You tied!";

    else return "You lose!";
};
*/


//testar
//min
function Card(suit, number) {
    this.suit = suit;
    this.number = number;

    this.getSuit = function () { return suit; };
    this.getNumber = function () { return number; };
    this.getValue = function () {
        if (number > 10) { return 10; }
        else if (number == 1) { return 11; }
        else
            return number;
    };
}
function deal() {
    var randomSuit = Math.floor((Math.random() * 4) + 1);
    var randomNumber = Math.floor((Math.random() * 13) + 1);
    var card = new Card(randomSuit, randomNumber);
    return card;
}

function Hand() {
    var cardsOnHand = [];
    cardsOnHand[0] = deal();
    cardsOnHand[1] = deal();
    this.getHand = function () { return cardsOnHand };
    this.score = function () {
        var sum = 0;
        var aces = 0;

        for (var i = 0; i < cardsOnHand.length; i++) {
            if (cardsOnHand[i].getValue() == 11) {
                aces++;
            }
            sum = sum + cardsOnHand[i].getValue();
        }
        while (sum > 21 && aces !== 0) {
            sum = sum - 10;
            aces--;
        }
        return sum;
    };
    this.printHand = function () {
        var show = "";
        for (var i = 0; i < cardsOnHand.length; i++) {
            show = show + cardsOnHand[i].getNumber() + " of suit " + cardsOnHand[i].getSuit() + ", ";
        }
        return show;
    };
    this.hitMe = function () {
        var card = deal();
        cardsOnHand.push(card);
    };
}
function playAsDealer() {
    var hand = new Hand();
    while (hand.score() < 17) {
        hand.hitMe();
    }
    return hand;
};
function playAsUser() {
    var hand = new Hand();
    var decision = confirm("Your hand is " + hand.printHand() + ": Hit OK to hit(take another card) or Cancel to stand");
    while (decision) {
        hand.hitMe();
        decision = confirm("Your hand is " + hand.printHand() + ": Hit OK to hit(take another card) or Cancel to stand");
    }
    return hand;
};
function declareWinner(userHand, dealerHand) {
    var userScore = userHand.score();
    var dealerScore = dealerHand.score();

    if (userScore > 21) {
        if (dealerScore > 21)
            return "You tied!";
        else return "You lose!";
    }
    else if (dealerScore > 21)
        return "You win!";

    else if (userScore > dealerScore)
        return "You win!";

    else if (userScore == dealerScore)
        return "You tied!";

    else return "You lose!";
};
function playGame() {
    var playerHand = playAsUser();
    var dealerHand = playAsDealer();
    var winOrLose = declareWinner(playerHand, dealerHand);
    console.log("Dealer has " + dealerHand.printHand());
    console.log("Player has " + playerHand.printHand());
    console.log(winOrLose);
}
playGame();