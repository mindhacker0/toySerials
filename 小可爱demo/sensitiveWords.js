const wordList = ["adc","ffs","ggr","ppp"];
const sentence = (function(){let s = '';for(var i=0;i<10000;i++){s+=String.fromCharCode(97+(~~(Math.random()*26)));} return s;})();
console.log(sentence);
