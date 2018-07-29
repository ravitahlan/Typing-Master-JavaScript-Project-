var dataModule = (function(){
    
    //shuffle function
    var linereturn  = '|';
    
    var shuffle  = function(array){
        var newArray = [];
        var randomIndex;
        var randomElement;
        while(array.length > 0){
            randomIndex = Math.floor(Math.random() * array.length);
            randomElement = array[randomIndex];
            newArray.push(randomElement);
            array.splice(randomIndex, 1);
        }
        
        return newArray;
    };
    
    //Capitalize first letter of random string
    String.prototype.capitalize = function(){
        var newString = "";
        var firstCharCap =
        this.charAt(0).toUpperCase();
        var remaningChar = this.slice(1);
        newString = firstCharCap + remaningChar;
        
        return newString; 
    }; 
    
    var nbCorrect;
    var charCallback = function(currentElement, index){
        //console.log(currentElement);
        //console.log(this);
        nbCorrect += (currentElement == this.characters.user[index])? 1:0;
    };

    var capitalizeRandom = function(arrayOfStrings){
         return arrayOfStrings.map(function(currentWord){
             var x = Math.floor(4 * Math.random());
             return (x == 3)?currentWord.capitalize():currentWord;
         })
    };
    
    
    var addRandomPunctuation = function(arrayOfStrings){
        return arrayOfStrings.map(function(currentWord){
            var punctuations = ["?",",",".","...","",linereturn,"","","","","","","","","","","","","",""];
            var punctuationIndex = Math.floor(punctuations.length * Math.random());
            currentWord += punctuations[punctuationIndex] ;
            return currentWord;
        })
    };
//console.log(addRandomPunctuation(["ravi","kumar","tahlan"]));
    
    //console.log(shuffle([1, 2, 3, 4, 5]));
    
    var appData = {
        indicators : {
            testStarted : false, testEnded : false, totalTestTime : 0, timeLeft : 0
        },
        results : {
            wpm : 0, wpmChange : 0, cpm : 0, cpmChange : 0, accuracy : 0, accuracyChange : 0, numOfTestCharacters : 0, numOfCorrectWords : 0, numOfCorrectCharacters : 0
        },
        words : {
            currentWordIndex : -1, 
            testWord : [], 
            currentWord : {}
        },
    };
    
    var word = function(index){
        //word values: correct vs user's
        this.value = {
            correct : appData.words.testWord[index] + ' ',
            user : [],
            isCorrect : false
        };
        
        this.characters = {
            correct : this.value.correct.split(''),
            user : [],
            totalCorrect : 0,
            totalTest : this.value.correct.length
        };
        
    };
    
    //console.log(this.characters.correct);
        word.prototype.update = function(value){
        //update the user input
        this.value.user = value;
            
        //update the word status 
        this.value.isCorrect = (this.value.correct == this.value.user);
        
        //update the user characters
        this.characters.user = this.value.user.split('');
        //console.log(this.characters.user);    
        //calculate the number of correct characters
        //console.log(this.value.user);
        
        nbCorrect = 0;
        var charCallback2 = charCallback.bind(this); 
        //console.log(this.characters.correct);    
        this.characters.correct.forEach(charCallback2);
        this.characters.totalCorrect = nbCorrect;
    
    };
    
    //update meathod
    return{
        getCertificateData :function(){
          return {
              wpm : appData.results.wpm,
              accuracy : appData.results.accuracy
          };  
        },
        testStarted : function(){
          return appData.indicators.testStarted;  
        },
        getLineReturn : function(){
          return linereturn;  
        },
        testEnded : function(){
          return appData.indicators.testEnded;  
        },
        //indicators testcontrol
        getCurrentIndex : function(){
            return appData.words.currentWordIndex;    
        },
        getCurrentWord : function(){
            var currentWord = appData.words.currentWord;
            return{
                value : {
                    correct : currentWord.value.correct,
                    user : currentWord.value.user
                }
            };
        },
        setTestTime : function(x){
            appData.indicators.totalTestTime = x;
        }, //sets the total test time to x
        
        initializeTimeLeft: function(){
            appData.indicators.timeLeft = appData.indicators.totalTestTime;
        },//initializes time left to the total test time
        
        startTest : function(){
            appData.indicators.testStarted = true;
        },//start the test
        
        endTest : function(){
            appData.indicators.testEnded = true;
        },//ends the test
        
        getTimeLeft : function(){
            return appData.indicators.timeLeft;
        },//return the remaining test time
        
        reduceTime : function(){
            appData.indicators.timeLeft--;
            return appData.indicators.timeLeft;
        },//reduce the time by one sec
        
        timeLeft : function(){
            return appData.indicators.timeLeft != 0;
        },//checks if there is time left to continue the test
        
        //results 
        calculateWpm : function(){ 
            var wpmOld = appData.results.wpm;
            var numOfCorrectWords = appData.results.numOfCorrectWords;
            
            if(appData.indicators.timeLeft != appData.indicators.totalTestTime){
                appData.results.wpm = Math.round(60 * (numOfCorrectWords)/(appData.indicators.totalTestTime - appData.indicators.timeLeft));
            }else{
                appData.results.wpm = 0;
            }
            appData.results.wpmChange = appData.results.wpm - wpmOld;
            console.log("wpm = "+appData.results.wpm);
            console.log("wpmChange = "+appData.results.wpmChange);
            return [appData.results.wpm, appData.results.wpmChange ];
        },//calculates wpm and wpmChange and update them in appData
        
        calculateCpm : function(){
            var cpmOld = appData.results.cpm;
            var numOfCorrectCharacters = appData.results.numOfCorrectCharacters;
            if(appData.indicators.timeLeft != appData.indicators.totalTestTime){
                appData.results.cpm = Math.round(60 * (numOfCorrectCharacters)/(appData.indicators.totalTestTime - appData.indicators.timeLeft));
            }else{
                appData.results.cpm = 0;
            }
            appData.results.cpmChange = appData.results.cpm - cpmOld;
            console.log("cpm = "+appData.results.cpm);
            console.log("cpmChange = "+appData.results.cpmChange);
            return [appData.results.cpm, appData.results.cpmChange ];
        },
        
        calculateAccuracy : function(){
            var accuracyOld = appData.results.accuracy;
            
            var numOfCorrectCharacters = appData.results.numOfCorrectCharacters;
            var numberOfTestCharacters = appData.results.numOfTestCharacters;
            
            if(appData.indicators.timeLeft != appData.indicators.totalTestTime){
                appData.results.accuracy = Math.round(100 *( (numOfCorrectCharacters)/(numberOfTestCharacters)));
            }
            else{
                appData.results.accuracy = 100;
            }
            appData.results.accuracyChange = appData.results.accuracy - accuracyOld;
            console.log("accuracy = "+appData.results.accuracy);
            console.log("accuracyChange = "+appData.results.accuracyChange);
            return [appData.results.accuracy, appData.results.accuracyChange];
        },//calculates accuracy and accuracychange and updates them in appData
        
        //test words
        
        fillListOfTestWords : function(textNumber, words){
            //console.log("textNumber is"+textNumber);
            //console.log("words are "+words);
            var result = words.split(" ");
            
            if(textNumber == 0){
                //shuffle the words
                result = shuffle(result);        
                //capitalize the random words
                result = capitalizeRandom(result);
                //add random punctuations
                result = addRandomPunctuation(result);
            }
            appData.words.testWord = result;
        },//fills words.testWords
        
        getListofTestWords : function(){
            return appData.words.testWord;
        },//get list of testwords
            
        //increment the currentWordIndex updates the current word  by creating a new instance of the word class - updates numOfCorrectWords, numOfCorrectCharacters
        moveToNewWord : function(){
            
            if(appData.words.currentWordIndex > - 1){
                
                //update number of correct words
                if(appData.words.currentWord.value.isCorrect == true){
                    appData.results.numOfCorrectWords ++;
                }
                
                //update number of correct characters
                appData.results.numOfCorrectCharacters += appData.words.currentWord.characters.totalCorrect;
                
                //update number of test character
                appData.results.numOfTestCharacters += appData.words.currentWord.characters.totalTest;
            }
            
            appData.words.currentWordIndex++;
           // console.log("incremented"+appData.words.currentWordIndex);
            var currentIndex = appData.words.currentWordIndex;
            //console.log("got index");
            var newWord = new word(currentIndex);
            //console.log("Created new word");
            appData.words.currentWord = newWord;
        },
        
        updateCurrentWord : function(value){
            appData.words.currentWord.update(value);
        },//updates current word using  user input
        
        returnData : function(){
            console.log(appData);
        }
        
    };
    
    
})();