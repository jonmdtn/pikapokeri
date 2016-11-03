//This page contains the object constructors used for easier readability and management of functions.
var deck, hand;

function Deck() {   //Object constructor for card deck
    this.deckCards = (function(){   //self invoking function to assign variable instantly
        var suits = ["hearts", "diamonds", "clubs", "spades"], arr = [];
        for(var i=0;i<4;i++) { 
            for (var j=1;j<=13;j++) {
                var card = [[suits[i], j]]; //loops through suits and number 1-13
                arr = arr.concat(card);     //adds each 'card' to the array
            }
        }
        return arr; //returns array of a full deck of cards in format [["hearts", 1], ["hearts", 2], ...] 
    })();           //an individual card can be accessed by indexing the array
    
    this.takenCards = [];
    
    this.giveCard = function(){
        var length = this.deckCards.length,      //number of cards left in the deck
        ran = Math.floor(Math.random()*length),  //creates random index based on number of cards left
        card = this.deckCards.splice(ran,1)[0];  //selects and removes a card that is randomly indexed
        this.takenCards.push(card);              //puts card into takenCards
        return card;
    };
    
    this.takeCards = function(num){ //function that returns an array
        var arr = [];               //with desired amount of cards.
        for(var i=0;i<num;i++) {
            arr = arr.concat([this.giveCard()]); //adds 'num' number of cards to arr
        }
        return arr;
    };
    
}

function standardHand(){   //constructor for starting card setup
    this.openCards = deck.takeCards(2);
    this.firstStack = deck.takeCards(3);
    this.secondStack = deck.takeCards(3);
    this.selectStack = function(choice){    //joins selected stack and openstack
        choice == 1 ? this.openCards = this.openCards.concat(this.firstStack): 
                      this.openCards = this.openCards.concat(this.secondStack);
    };
}

function doubleHand(){  //constructor for card setup for doubling
    this.cards = deck.takeCards(5);
    this.selectHiddenCard = function(num){
        var first = this.cards[0][1], selected = this.cards[num][1]; //the numerical values for face-up card and the chosen card
        if (selected > first){
            return "win";
        }else if (selected < first){
            return "loss";
        }else{
            return "tie";
        }
    };
}