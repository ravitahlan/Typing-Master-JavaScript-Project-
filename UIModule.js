var UIModule = (function(){
    
    //class used to select HTML elements
    var DOMElements = {
        //indicators - test control
        timeLeft : document.getElementById('timeLeft'), //HTML element displaying time left
        //test results
        wpm : document.getElementById('wpm'), 
        wpmChange : document.getElementById('wpmchange'), 
        cpm : document.getElementById('cpm'), 
        cpmChange : document.getElementById('cpmchange'), 
        accuracy : document.getElementById('accuracy'), 
        accuracyChange : document.getElementById('accuracychange'),
        //user inputs
        textInput : document.getElementById('input'),
        nameInput : document.querySelector('.form-group'), 
        //test Words
        content : document.getElementById('content'), 
        activeWord : '',
        //modal
        modal : $('#mymodal'),
        download :document.getElementById('download'),
        nameField :document.getElementById('name') 
        
    };
    
    var lineReturn = '|';
    var splitArray = function(string){
        return string.split('');
    };
    
    var addSpace = function(array){
        array.push(' ');
        return array;
    };
    
    var addSpanTag = function(array){
        return array.map(function(character){
            return '<span>'+character+'</span>';
        });
    };
    
    var addWordSpanTag = function(array){
        array.push('</span>');
        array.unshift('<span>');
        return array;
    };
    
    var joinEachWord = function(array){
        return array.join('');
    };
    
    var userValue;
    
    var returnCharClass = function(currentCharacter, index){
        return (index < userValue.length)?(currentCharacter == userValue[index]?'correctCharacter':'wrongCharacter') : '0'
    };
    
    var updateChange = function(value, changeElement){
            //determine the class to add to the change element and content to insert
            var classToAdd, html;
            [classToAdd, html] = (value >= 0)?['scoreUp','+' +value]:['scoreDown',+value];
        
            //update the change element
            changeElement.innerHTML = html;
            
            //style the change element
        changeElement.removeAttribute('class');
        changeElement.className = classToAdd;
        
        //fade element
        fadeElement(changeElement);
    };
    
    var fadeElement = function(element){
        element.style.opacity = 1;
        setTimeout(function(){
            element.style.opacity = 0.8;
        }, 100);
    };
    
    return{ 
        //get DOM elements
        
        getDOMElements : function(){
            return{
                textInput : DOMElements.textInput,
                download : DOMElements.download
            };
        },
        
        //Indicators - Test Control
        
        updateTimeLeft : function(x){
            DOMElements.timeLeft.innerHTML = x;
        },
        
        //results
        
        updateResults : function(results){
            //update wpm
            DOMElements.wpm.innerHTML = results.wpm;
            DOMElements.cpm.innerHTML = results.cpm;
            DOMElements.accuracy.innerHTML = results.accuracy + '%';
            updateChange(results.wpmChange, DOMElements.wpmChange);
            updateChange(results.cpmChange, DOMElements.cpmChange);
            updateChange(results.accuracyChange, DOMElements.accuracyChange);
        },
        fillModal : function(wpm){
            var result;
            if(wpm < 40){
                result ={
                  type : 'turtle',
                  image : 'turtle.jpg',
                  level : 'Beginner'          
                };
            }else if(wpm < 70){
                result ={
                    type : 'horse',
                    image : 'horse.jpg',
                    level : 'Intermediate'
                };
            }else{
                result ={
                    type : 'cheetah',
                    image : 'cheetah.jpg',
                    level : 'Expert'
                };
            }
            
            var html = '<div class = "result"><p>You are a %type%!</p><p>You type at a speed of %wpm% words per minute</p><img src="images/%image%" alt = %alt% height = "200" width = "300" class = "rounded-circle"></div>';
            
            html = html.replace('%type%', result.type);
            html = html.replace('%wpm%', wpm);
            html = html.replace('%image%',result.image);
            
            //console.log(result.image);
            DOMElements.nameInput.insertAdjacentHTML('beforebegin', html);
            
            //storing the value of level in button
            console.log(result.level);
            DOMElements.download.setAttribute('level', result.level);
        },
        
        showModal : function(){
            DOMElements.modal.modal('show');
        },
        //user input
        
        inputFocus : function(){
            DOMElements.textInput.focus();
        },
        
        isNameEmpty : function(){
            return DOMElements.nameField.value == "";
        },
        
        flagNameInput : function(){
            DOMElements.nameField.style.borderColor = 'red';
        },
        
        spacePressed : function(event){
            return (event.data == " ");
        },
        
        enterPressed: function(lineReturn){
            return DOMElements.textInput.value.includes(lineReturn + ' ');
            
        },
        
        emptyInput : function(){
            DOMElements.textInput.value = "";
        },  
        
        getTypedWord : function(){
            //console.log(DOMElements.textInput.value);
            return DOMElements.textInput.value;
        },
        
        //test words
        
        fillContent : function(array){
             var content = array.map(splitArray);
             content = content.map(addSpace);
             content = content.map(addSpanTag);
             content = content.map(addWordSpanTag);
             content = content.map(joinEachWord);
             content = content.join('');
             content = content.split('<span>'+lineReturn+'</span>');
             content = content.join('<span>&crarr;</span>')
            DOMElements.content.innerHTML = content; 
            //console.log(content); 
        },
        
        formatWord : function(wordObject){
            var activeWord = DOMElements.activeWord;
            activeWord.className = 'activeWord';
            
            //formatting the individual characters
            var correctValue = wordObject.value.correct;
            userValue = wordObject.value.user;
            //console.log(correctValue);
            //console.log(userValue);
            //getting the classes for the correct alphabets
            
            var classes = Array.prototype.map.call(correctValue, returnCharClass);
        
            //getting the active word
            var characters = activeWord.children;
            //add the classes to the children
            for(var i = 0; i < characters.length; i++){
                characters[i].removeAttribute('class');
                characters[i].className = classes[i];     
            }
            
        },
        
        setActiveWord: function(index){
            DOMElements.activeWord = DOMElements.content.children[index];
        },
        
        deactivateCurrentWord : function(){
            DOMElements.activeWord.removeAttribute('class');
        },
        scroll: function(){
            var activeWord = DOMElements.activeWord;
            var top1 = activeWord.offsetTop;
            var top2 = DOMElements.content.offsetTop;
            var diff = top1 - top2;
            DOMElements.content.scrollTop = diff - 40;
        }
        
    };
    
})();