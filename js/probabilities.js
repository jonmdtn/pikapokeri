var chanceOf = {
    //start of general functions used by probability functions
    giveKnownCards: function(cardArray){
        var openCards = cardArray.slice(0,3); //the first 3 cards are all open and will be used for probabilities.
        openCards.push(cardArray[5]); //the 6th card (5 as index) is also open
        return openCards;
    },
    
    cardArrayByStack: function(cardArray, stackNum){
        var openCards = this.giveKnownCards(cardArray);
        var index = stackNum == 1 ? 3 : 2; //if stack 1 is chosen, the index to be removed is 3, if stack 2, then 2.
        openCards.splice(index, 1); //will remove card at index defined above
        return openCards;
    },
    
    convertToValues: function(cardArray){
        var valueArray = [];
        for (var i=0; i<cardArray.length; i++){
            valueArray.push(cardArray[i][1]); //simply pushes the value of every card into an array
        }
        return valueArray;
    },
    
    simplifyTo: function(cardArray, choice){
        var arr = [],
            num = choice == "suits" ? 0 : 1;
        for (var i=0; i<cardArray.length; i++){
            arr.push(cardArray[i][num]); //this will return an array composed either entirely
        }                                //of numbers or suits depending on choice input
        return arr;
    },
    
    filterNonroyal: function(cardArray){
        var arr = cardArray.filter(function(v, index){return (cardArray[index]>9||cardArray[index]<2);});
        //the above line will remove all cards from array that are not values 10-A
        return arr;
    },
    
    percentConvert: function(number){ //returns input number as a percentage rounded to one decimal place
        var num = (number*100).toFixed(1),
            string = ""+num+"%";
        return string;
    },
    
    factorial: function(num){ //function for doing factorial calculations
        if (num===0) return 1;
        var val = 1;
        for (var i=2; i<=num; i++)
            val = val*i; //multiplies value by all numbers less than it
        return val;
    },
    
    occuranceOf: function(array, item){ //counts the occurance of an item within an array
        var count = 0;
        for (var i=0; i<array.length; i++){
            if(array[i]==item) count++;
        }
        return count;
    },
    
    combination: function(n, r){
        var ans = this.factorial(n) / ( this.factorial(r) * this.factorial((n-r)) );
        return ans;
    },
    
    probComb: function(numberleft, amountwanted, totalleft){
        return ((this.factorial(numberleft)*this.factorial((totalleft-amountwanted))) / (this.factorial(totalleft) * this.factorial((numberleft-amountwanted))));
        //this is the probability function used and it is the following:
        //let n = the number of cards of given value left in the deck
        //let t = the number of cards left in the deck
        //let g = the number of given value cards you want to draw from deck
        // (n!*(t-g)!) / (t!*(n-g)!) will give the probability of drawing g cards of given value from deck.
    },
    
    chanceOfValuePair: function(knowncards, handcards, number){
        var numleft=4, numwanted=2, totalleft=48, prob;
        //the above numbers are default values from which we subtract.
        if(knowncards.indexOf(number)!==-1){ //if the value does exist in our known 4 cards
            var occurance = this.occuranceOf(knowncards, number);
            numleft -= occurance;   //we subtract the number of occurances in knowncards from numleft in deck.
        }
        if(handcards.indexOf(number)!==-1){//if the chosen stack contains the number
            var occur = this.occuranceOf(handcards, number);
            if (occur==2){
                return 1; //if we already have two cards, the chance of pair is 100%
            }                                  
            else if (occur==1){
                //ASK GOODMAN IF I NEED TO FIND ALL POSSIBLE WAYS OF GETTING THE CARD
                numwanted = 1; 
                prob = this.probComb(numleft, numwanted, totalleft) * this.probComb(45, 1, 47);
            }
        }
        if (typeof prob == "undefined"){ //if prob has yet to be defined, we can just use the probability function declared earlier.
            prob = this.probComb(numleft, numwanted, totalleft);
        }
        console.log(prob);
        return prob;
    
    },
    //end of general functions
    
    onePair: function(cardArray, stackNum){
        var knownCards = this.giveKnownCards(cardArray);
        var givenCards = this.cardArrayByStack(cardArray, stackNum);
        knownCards = this.filterNonroyal( this.simplifyTo(knownCards, "values") );
        givenCards = this.filterNonroyal( this.simplifyTo(givenCards, "values") );
        var prob;
        if( (new Set(givenCards)).size == 1 && givenCards.length == 3 ){ prob = 0.0; }
        else if (knownCards.length === 0) { prob = 0.02659; }
        
        if (typeof prob == "undefined"){
            var totalprob = 0;
            for (var i=10;i<=14;i++){
                if (i==14){
                    totalprob += this.chanceOfValuePair(knownCards, givenCards, 1);
                }
                else{
                    totalprob += this.chanceOfValuePair(knownCards, givenCards, i);
                }
                
                if (totalprob>1){
                    totalprob = 1;
                }
            }
            return totalprob;
        }
        return prob;
    }, 
    
    flush: function(cardArray, stackNum){
        var knownCards = this.giveKnownCards(cardArray),
            givenCards = this.cardArrayByStack(cardArray, stackNum);
        knownCards = this.simplifyTo(knownCards, "suits"); 
        givenCards = this.simplifyTo(givenCards, "suits");
        
        if ( (new Set(givenCards)).size !== 1 ) {
            return 0;
        }
        else {
            var numleft = this.occuranceOf(knownCards, givenCards[0]) == 3 ? 10 : 9;
            return this.probComb(numleft, 2, 48);
        } 
    },
    
    four: function(cardArray, stackNum){
        var knownCards = this.giveKnownCards(cardArray),
            givenCards = this.cardArrayByStack(cardArray, stackNum);
        knownCards = this.simplifyTo(knownCards, "values"); 
        givenCards = this.simplifyTo(givenCards, "values");
        
        if ( (new Set(givenCards)).size > 2 ) {
            return 0;
        }
        else{
            var freqNum = this.occuranceOf(givenCards, givenCards[0]) == 1 ? givenCards[1] : givenCards[0];
            
            if (this.occuranceOf(knownCards, freqNum) > this.occuranceOf(givenCards, freqNum)){
                return 0;
            }
            else if(this.occuranceOf(givenCards, freqNum) == 3){
                //FILL WITH PROB OF GETTING ONE MORE CARD OF VALUE
            }
            else{
                return 0.00086805555;
            }
        }
        
    },
};















