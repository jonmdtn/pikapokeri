$(function(){
    var counter = 1;
    var counter1 = 1;
    $("#test").click(function(){
        counter++;
        $("#doublecardarea").fadeToggle();
        if(counter%2===0){
            deck = new Deck();
            hand = new doubleHand();
            hand.initDouble();
        }
    });
    
    $("#stand").click(function(){
        counter1++;
        $("#normalcardarea").fadeToggle();
        if(counter1%2===0){
            deck = new Deck();
            hand = new standardHand();
            hand.initStandard();
            var array = hand.openCards.concat(hand.firstStack.concat(hand.secondStack));
            console.log(chanceOf.percentConvert(chanceOf.onePair(array, 1)));
            console.log(chanceOf.percentConvert(chanceOf.onePair(array, 2)));
        }
        
        
    });
    
});