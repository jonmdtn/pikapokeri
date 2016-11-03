//These are extensions to existing object constructors that utilize jQuery
//I have chosen to separate these for easier management

doubleHand.prototype.initDouble = function(){
    var cardArray = this.cards;
    $("#doublecardarea").empty().load("../html/doublehand.html");
    setTimeout(function(){deck.setCard(cardArray, 0);},0); //shows first card
    //setTimeout is used above with a 0ms delay because doublehand.html needs to be loaded.
    //this is needed so that the function is executed after loading doublehand.html
    $("#doublecardarea").on("click",".card",function(){//when a card is clicked
        var selectedcard = $(this).attr("id");  
        var id = parseInt(selectedcard.slice(4,5)); //this and the above line gets the id of card (1-5)
        if (id!==1){    //if id is 1, it is the open card and should not do anything
            for(var j=1; j<5; j++) {
                deck.setCard(cardArray,j); //sets the rest of the cards
                if (j !== (id-1)){ //1 is taken from id since the id is a number 2-5, and j is used as index in setCard()
                    var select = "#card"+(j+1); //j is used as index (0-4), but the card names are (1-5), 1 must be added
                    $(select).css("opacity","0.5");
                }
            }
            $("#doublecardarea").unbind(); //removes click event from cards
            console.log(hand.selectHiddenCard((id-1)));
        }
    });      
}

standardHand.prototype.initStandard = function(){
    var cardArray = this.openCards.concat(this.firstStack.concat(this.secondStack));
    $("#normalcardarea").empty().load("../html/standardhand.html");
    setTimeout(function(){
        for (var i=1; i<=8; i++){
            if ([4,5,7,8].indexOf(i) == -1){deck.setCard(cardArray, (i-1));}
        }
    },0);
    
    
}

Deck.prototype.setCard = function(cardArray, index){ //function used to set appropriate cards to images
    var src = "../cards/"+cardArray[index][0]+"/"+cardArray[index][1]+".png", selector = "#card"+(index+1)+" img";
    $(selector).attr("src",src); //sets specified image selector's src property to the selected card's source
}

Deck.prototype.fadeCards = function(cardArray, indexArray){
    for (var i=0; i<indexArray.length; i++){
        
    }
}