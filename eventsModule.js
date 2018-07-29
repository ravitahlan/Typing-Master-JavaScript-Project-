var eventsModule = (function(dModule, uModule, cModule, wModule){
    
    var coun = 0;
    var addEventListeners = function(){
        
        //event listner for enter
    
        uModule.getDOMElements().textInput.addEventListener('keydown', function(){
           if(dModule.testEnded()){
               return;
           }
           
            //console.log("Event occured is :" + event);
            var key = event.keyCode;
            
            if(key == 13){
                uModule.getDOMElements().textInput.value += dModule.getLineReturn() + ' ';    
            }
            //creating a new event
            var inputEvent = new Event('input');
            //dispatch it
            uModule.getDOMElements().textInput.dispatchEvent(inputEvent);
            
        });
        
        //character typing event listener
        
        uModule.getDOMElements().textInput.addEventListener('input', function(event){
           //If the test has ended do nothing
            if(dModule.testEnded()){
                return;
            }
           //If the test has not started start the test and start the countdown
            if(!dModule.testStarted()){
                // start the test : dataModule
                dModule.startTest();
                
                //start the counter 
                var b = setInterval(function(){
                    //calculate the result data : data Module
                    
                    var results = {};
                    //update wpm, wpmChange
                    [results.wpm, results.wpmChange] = dModule.calculateWpm();
                    //update cpm , cpmchange
                    [results.cpm, results.cpmChange] = dModule.calculateCpm();
                    //update accuracy, accuracyChange
                    [results.accuracy, results.accuracyChange] = dModule.calculateAccuracy();
                    //dModule.returnData();
                    //update results(UI module)
                    uModule.updateResults(results);
                
                        if(dModule.timeLeft()){
                            //update timeleft
                             //check if we have time left
                                //yes:
                                //reduce time by one sec:data Module
                            var timeLeft = dModule.reduceTime();
                              //update time remaining in UI
                            console.log(timeLeft);
                            uModule.updateTimeLeft(timeLeft);
                        }else{
                            //no:
                            //end time test: data module
                            clearInterval(b);
                            dModule.endTest();
                            // fill modal
                            uModule.fillModal(results.wpm);
                            //show modal
                            uModule.showModal();
                        }
                }, 1000);
            }
            
           //get the typed word
            var typedWord = uModule.getTypedWord();
            
           //update the current word : dataModule
            dModule.updateCurrentWord(typedWord);
           //format the active word 
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);
            
            uModule.inputFocus();
            //check if the user has pressed space or enter
            if(uModule.spacePressed(event) || uModule.enterPressed(dModule.getLineReturn())){
                //console.log("Space Pressed!" );
//                empty the text input space
             uModule.emptyInput();    
//                deactivate the current word
             uModule.deactivateCurrentWord();
                  //getting the new word and formatting it 
             dModule.moveToNewWord();
             var index = dModule.getCurrentIndex();
             uModule.setActiveWord(index);
                    //getting the word and formatting the current word
                    var currentword = dModule.getCurrentWord();
                    uModule.formatWord(currentword);

//                scroll the words to bring it to the center
            uModule.scroll();                   

            }
            //click on download button event listener
            
            uModule.getDOMElements().download.addEventListener('click', function(event){
                if(uModule.isNameEmpty()){
                    uModule.flagNameInput();
                }else{
                    if(coun++ < 1){
                        var certificateData = dModule.getCertificateData();
                        console.log(certificateData); certificateModule.generateCertificate(certificateData);
                    }
                }
            })
        });
        
        //click on download button event listener
        
        //click on restart button eent listener    
    };
    
    
    window.addEventListener('resize', uModule.scroll);
    
    return{
        
        //init function, initializes the test before start    
        
        init : function(duration, textNumber){
            
            var words = wModule.getWords(textNumber);
            
            dModule.fillListOfTestWords(textNumber, words);
            var testword = dModule.getListofTestWords();
            uModule.fillContent(testword);
            
            //setting the total time of the test
            dModule.setTestTime(duration);
            //setting the time left
            dModule.initializeTimeLeft();
              
            //setting the time in ui
            var x = dModule.getTimeLeft();
            uModule.updateTimeLeft(x);
            
            //getting the new word and formatting it 
            dModule.moveToNewWord();
            var index = dModule.getCurrentIndex();
            uModule.setActiveWord(index);
            //getting the word and formatting the current word
            var currentword = dModule.getCurrentWord();
            uModule.formatWord(currentword);
            
            uModule.inputFocus();
            
            addEventListeners();
        }
    };
    
})(dataModule, UIModule, certificateModule, wordsModule);