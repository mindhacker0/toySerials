let cavElem = document.getElementById("screen");
let ctx = cavElem.getContext('2d');
function loadMap(level) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET',`/level/level${level}.json`,true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200){
            console.log(xhr.response);
        }
    }
    xhr.send();
}
loadMap(1);