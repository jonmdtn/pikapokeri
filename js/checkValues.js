var checkFor = { //namespace used so functions will be called as checkFor.Matches, checkFor.Flush, etc.
    
    Matches: function(cardArray){
        var matches = 0, indexes = [], nodupe = [];
        for (var i=0; i<5; i++) {

            for (var j=(i+1); j<5; j++) {//j is i+1 so it doesn't check a card against itself, and 
                                         //checking against previously checked cards is not necessary.
                if (cardArray[i][1]==cardArray[j][1]) {//loops through cards and checks for matches
                    matches++; indexes.concat([i,j]); 
                }   //matches values vs match type: pair-1, two pair-2, three of a kind-3, four of a kind-6, full house-4
                    //explanation for four of a kind: four of a kind will find 3 matches on first card, then 2 on second, then 1 on third. 3+2+1=6
            }       //explanation for full house: three of a kind will be 3, and one pair is 1, so 3+1=4

        }
        nodupe = indexes.filter(function(item, index){ //nodupe will be a filtered version of indexes where duplicates are removed
            return indexes.indexOf(item) == index;     //filter works by removing items that return false in the function
        });                                            //items where the index does not equal the known index will be duplicates.
        return [matches, nodupe]; //return data in format [match value, [indexes of matched cards]]
    },
    
    Flush: function(cardArray){
        var firstSuit = cardArray[0][0]; //gets suit of the first card in the array
        for (var i=1; i<5; i++) {
            if (cardArray[i][0] !== firstSuit){ //if a card in the array does not have the same
                return false;                   //suit as the first, it will cancel and return false
            }
        }
        return true;    //if all the suits are the same as the first, return true
    },
    
    Straight: function(cardArray){
        var valueArray = [], royalTest = [], type="normal";
    
        for (var i=0; i<5; i++) {
            valueArray.push(cardArray[i][1]); //pushes number values of cards into array
        }

        valueArray.sort(function(a,b){return a-b;}); //sorts numbers in array to be in ascending order
        royalTest = valueArray.filter(function(item, index){return item < 10;}); //sends all numbers less than 10 into royalTest array

        if (royalTest.length==1 && royalTest[0]==1) { //if there is only one number less than 10 AND it is 1, then we have to consider it as 14
            valueArray.shift();                       //because an ace can be either 1 or 14 in a straight (10,11,12,13,14) or (1,2,3,4,5)
            valueArray.push(14); //shift() removes first number (the 1) and push() puts 14 at the end of array.
            type="royal";        //change type of straight to royal so we can check for royal flushes
        }

        for (var j=0; j<4; j++) {
            if (valueArray[j+1]-valueArray[j] !== 1){ //if the difference in subsequent numbers is not 1, then it is not a straight
                return false;
            }
        }
        return [true, type]; //if it passes the loop test, return true and the type of the straight so we can check for royal flushes.
    }
    
}//end of namespace declaration

