const letters=document.querySelectorAll('.scoreboard-letter')
const loadingDiv=document.querySelector('.info-bar')
const answerLength=5;
const api='https://words.dev-apis.com/word-of-the-day';


 async function init(){
let currentGuess='';
let currentRow=0;
const rounds=6;
let isLoading=true;

const res=await fetch(api)
const resObj=await res.json();
const word=resObj.word.toLocaleUpperCase();
const worldParts=word.split("");
let done=false;
setLoading(false)
isLoading=false;

  function addLetter(letter){
if(currentGuess.length < answerLength){
 //add letter to the end
 currentGuess+=letter;
}else{
 //replace the last letter
 currentGuess=currentGuess.substring(0,currentGuess.length-1) +letter;
}
//how
letters[ answerLength * currentRow+currentGuess.length-1].innerText=letter;
  }

  async function commit(){
   if(currentGuess.length != answerLength){
    return;
   }
 isLoading=true;
 setLoading(true);
 const res=await fetch('https://words.dev-apis.com/validate-word',{
 method:'POST',
 body:JSON.stringify({word:currentGuess})
});

const resObj=await res.json();
const validWord=resObj.validWord;
isLoading=false;
setLoading(false);
 
if(!validWord){
 markInvalidWorld();
 return;
}







const guessParts=currentGuess.split("")
const map=makeMap(worldParts)
    
for(let i=0;i<answerLength;i++){
 //mark as correct
 if(guessParts[i]==worldParts[i]){
  letters[currentRow*answerLength+i].classList.add('correct')
  map[guessParts[i]]--;
 }
}
for(let i=0;i<answerLength;i++){
 if(guessParts[i]==worldParts[i]){
   //do nothing
 }else if(worldParts.includes(guessParts[i]) && map[guessParts[i]>0]){
  letters[currentRow*answerLength+i].classList.add('close')
  map[guessParts[i]]--;
 }else{
  letters[currentRow*answerLength+i].classList.add('wrong')
 }
}
currentRow++;
 

if(currentGuess==word){
 //win
 alert('You Win')
 document.querySelector('.brand').classList.add('winner')
 done=true;
 return
}else if(currentRow==rounds){
  alert(`You Lose , the Word was ${word}`)
  done=true;
 }
 currentGuess='';


   
  }
function backspace(){
 currentGuess=currentGuess.substring(0,currentGuess.length-1);
 letters[ answerLength * currentRow+currentGuess.length].innerText='';

}

function markInvalidWorld(){

 for(let i=0;i<answerLength;i++){
  letters[currentRow*answerLength+i].classList.remove('invalid');

  setTimeout(function(){

   letters[currentRow*answerLength+i].classList.add('invalid');

  },10)
 }
}




  document.addEventListener('keydown',function handleKeyPress(event){

  if(done || isLoading){
   return;

  }


   const action=event.key;
   console.log(action);
  
   
    
   if(action=='Enter'){
    commit()
   }else if(action=='Backspace'){
    backspace()
   }else if (isLetter(action)){
    addLetter(action.toLocaleUpperCase())
   }else{
    //do nothing
   }



  })
}

function isLetter(letter){
 return /^[a-zA-Z]$/.test(letter)
}

function setLoading(isLoading){
loadingDiv.classList.toggle('show',isLoading)
}


function makeMap(array){
const obj={};
for(let i=0;i<array.length;i++){
 const letter=array[i]
 if(obj[letter]){
  obj[letter]++;
 }else{
  obj[letter]=1;
 }
}
return obj;
}



init()