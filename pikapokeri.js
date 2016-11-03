$(document).ready(function(){
var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
var taken = [];
var stack1 = [];
var stack2 = [];
var table = [];
var suitmatches = 0;
var flush = false;
var tries = 0;
var straight = false;
var AceAsHighCard = false;
var points=0;
var matches = 0;
var joker = false;
var jokerrounds = 0;

var takenLength = taken.length;

function pushFirstCard(){
	var picsuit = table[0][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[0][0]+".png";
	$("#firstpic").attr("src", src);
}
function pushSecondCard(){
	var picsuit=table[1][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[1][0]+".png";
	$("#secondpic").attr("src", src);
}
function pushFirstStack(){
	var picsuit=table[2][0][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[2][0][0]+".png";
	$("#firstopenstack").attr("src", src);
}
function pushSecondStack(){
	var picsuit=table[3][0][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[3][0][0]+".png";
	$("#secondfirstopenstack").attr("src", src);
}
function pushfirstclosed(){
	var picsuit=table[2][1][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[2][1][0]+".png";
	$("#firstclosed").attr("src", src);
}
function pushsecondclosed(){
	var picsuit=table[2][2][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[2][2][0]+".png";
	$("#secondclosed").attr("src", src);
}
function pushsecondfirstclosed(){
	var picsuit=table[3][1][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[3][1][0]+".png";
	$("#secondfirstclosed").attr("src", src);
}
function pushsecondsecondclosed(){
	var picsuit=table[3][2][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[3][2][0]+".png";
	$("#secondsecondclosed").attr("src", src);
}

function animateFirstStackSelect(){
	$("#secondcardstack").fadeOut();
	$("#secondclosed").animate({left:'+=166px'});
	$("#firstclosed").animate({right:'-=83px'}).queue(function(){
		pushfirstclosed();
		pushsecondclosed();
	});
}

function animateSecondStackSelect(){
	$("#firstcardstack").fadeOut().queue(function(){
		$("#secondcardstack").css("bottom","221px");
	});
	$("#secondfirstopenstack").animate({right:'+=294px'});
	$("#secondfirstclosed").animate({right:'+=211px'});
	$("#secondsecondclosed").animate({left:'-=128px'}).queue(function(){
		pushsecondfirstclosed();
		pushsecondsecondclosed();
	})

}

$("#firstcardstack").click(function(){
	animateFirstStackSelect();
	setTimeout(selectFirstStack,700);
	setTimeout(checkEverything,800);
	setTimeout(function(){console.log(points)},900);
});

$("#secondcardstack").click(function(){
	animateSecondStackSelect();
	setTimeout(selectSecondStack,700);
	setTimeout(checkEverything,800);
	setTimeout(function(){console.log(points)},900);
});

$(".closeddoublecard").click(function(){
    var selectedcard = $(this).attr("id");
    var id = parseInt(selectedcard.slice(6,7));
    chosenDouble(id);
});
    
function pushotherdoublecards(a){
    for(var i=1;i<5;i++){
        var selector="#double"+i;
        var picsuit=table[i][1];
        var src= "cards/"+picsuit.toLowerCase()+"/"+table[i][0]+".png";
        $(selector).attr("src", src);
        $(selector).css("opacity","0.5");
    }
    var card = "#double"+a;
    $(card).css("opacity","1");
}
    
function chosenDouble(a){
    if(table[a][0]===1){
        table[a][0]=14;
    }
    var wondouble = table[a][0]>=table[0][0];
    if(wondouble){
        console.log("double won");
    }
    else if(!wondouble){
        console.log("double lost");
    }
    var selector="#double"+a;
    var picsuit=table[a][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[a][0]+".png";
	$(selector).attr("src", src).delay(500).queue(function(){pushotherdoublecards(a);});
}

function bringindouble(){
    dealdouble();
    console.log(table);
    $("#cardholder").fadeOut().queue(function(){    
    var picsuit=table[0][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[0][0]+".png";
	$("#doubleopen").attr("src", src);
        
    $("#doublehand").fadeIn();});
}
    
function resetdouble(){
    dealdouble();
    console.log(table);
    for(var i=1;i<5;i++){
        var selector="#double"+i;
        var src= "cards/backside.png";
        $(selector).attr("src", src);
        $(selector).css("opacity","1");
    }
    var picsuit=table[0][1];
	var src= "cards/"+picsuit.toLowerCase()+"/"+table[0][0]+".png";
	$("#doubleopen").attr("src", src);
}


  
$("#doubleresetbutton").click(function(){
    resetdouble();
})
$("#resetbutton").click(function(){
    bringindouble();
});    
    
function pushAllCards(){
	pushFirstCard();
	pushSecondCard();
	pushFirstStack();
	pushSecondStack();
}

function giveCard(){
    var card = [];
    var randomValueIndex = Math.floor((Math.random()*13)); //random number times 13 and 4 will randomly select a suit and value
    var randomSuitIndex = Math.floor((Math.random()*4));
    card[0]=values[randomValueIndex];
    card[1]=suits[randomSuitIndex]; // indexing random value to make card array [VALUE, SUIT]
    if(taken.length!==0){  // does function if there are taken cards already 
        for(var i=0;i<takenLength;i++){
            if(card[0] === taken[i][0] && card[1] === taken[i][1]){		// checks if card has already been dealed by checking with cards in taken array
               //console.log("card is taken, reassigning"); 	//Sometimes I uncomment this for easier debugging
                var newcard = giveCard();
                return newcard;
            }
        }
    } //closes if else statement
    taken.push(card);  //pushes the card into the taken array so we know if it has been used
    takenLength=taken.length;
    return taken[taken.length-1]; //This was used instead of returning card because of errors. (card will be at this index)
}

function dealcards(){
    for(i=0;i<2;i++){
        var cardtosend = giveCard(); //deals two cards which will be the two open face cards
        table.push(cardtosend); //sends the two cards to the table
    }
    for(var i=0;i<3;i++){
        var stack1card = giveCard();
        var stack2card = giveCard(); //sends 3 cards into each stack
        stack1.push(stack1card);
        stack2.push(stack2card);
    }
    table.push(stack1, stack2); //sends the two stack arrays onto the table
}
    
function dealdouble(){
    table=[];
    taken=[];
    for(var i=0;i<5;i++){
        var cardtosend=giveCard();
        table.push(cardtosend);
    }
}

function selectFirstStack(){
    table.splice(2,2);				//first removes the two stack arrays from table then
    table = table.concat(stack1);   //adds the selected stack cards to the table
}
function selectSecondStack(){
    table.splice(2,2);
    table = table.concat(stack2);
}                                   //The table now has 5 cards

function checkMatches(){
    for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
            if(table[i][0]===table[j][0]){ //checks the cards in table against each other
                if(i!==j){                //if they have same index, they are the same card and do not count as a match
                    matches+=1;
                }
            }
        }
    }                     //since the cards are checked with each card indexed twice (once in each loop) the same match will be met twice
    matches = matches/2;  //Therefore we must divide matches by 2 to find the real amount of matches for easier use
    if(matches<4){						  
    	points = matches;
    }
    else{
    	points = ((1/2)*matches + 4);
    }
}


function checkFlush(){
	for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
            if(table[i][1]===table[j][1]){ 
                suitmatches+=1;            //This means that suitmatches should be 25 if all 5 cards have same suit
            }							   //due to them all being checked five times against each other
        }
    }
	if(suitmatches===25){
		flush=true;	
	}	
}

function checkStraight(){
    var arr = [];
    for(var i=0;i<5;i++){
        arr.push(table[i][0]); //puts the values of the table cards in array arr[]
    }
    if(arr.some(function(a){return a===1;}) && arr.some(function(a){return a>9})){ //will execute if arr[] contains a number>5 and a 1
        for(var i=0;i<5;i++){
            if(arr[i]===1){
                arr[i]=14;
                AceAsHighCard=true;									//replaces 1 with 14 so it can check for royal straight
            	if(!arr.every(function(a){return a>9})){
            		arr[i]=1;
            		AceAsHighCard=false;								//makes sure that all cards are greater than 9 so it is indeed a royal straight
            	}
            	
            	 									                                                        
            }
        }
    }
    arr.sort(function(a,b){return a-b;}); //sorts the array so values are in ascending order, function used because sort does not work on numbers
    console.log(arr);
    var correct = 0;
    for(var i=4;i>0;i-=1){
        if(arr[i]-arr[i-1]===1){ //checks whether difference between numbers is 1
            correct++;           //adds 1 to correct everytime the difference is 1
        }
    }
    if(correct===4){             //If correct is 4, then the hand must be a straight
        straight = true;
    }
}

function checkEverything(){
	flush=straight=AceAsHighCard=false;
    checkMatches();
    checkFlush();
    checkStraight();
    if(straight && AceAsHighCard && flush){
        points = 9;
        console.log("Royal Flush");
    }
    else if(straight && flush){
        points = 8;
        console.log("Straight Flush");
    }
    else if(straight || flush){
        if(straight){
            points = 4;
            console.log("Straight");
        }
        else if(flush){
            points=5;
            console.log("Flush")
        }
    }
    console.log(points);
}
    


/*while(points<4){
    dealcards();
    selectSecondStack();
    checkEverything();
    if(points<4){
        points=0;
        taken = [];
        stack1 = [];
        stack2 = [];
        table = [];
        matches = 0;
        straight=false;
        suitmatches = 0;
        flush = false;
        AceAsHighCard = false;
    }
    tries++;
    console.log(tries);
}

table=[[1, "Hearts"],[1, "Clubs"],[1, "Diamonds"],[1, "Spades"],[2, "Hearts"]];
checkEverything();*/
dealcards();
console.log(table);
pushAllCards();
});