let textInput = document.querySelector(".text-input");
let colorInput = document.querySelector(".color-input");
let fontSelect = document.querySelector(".font-select");
let sizeInput = document.querySelector(".size-input")
let minSize = 1;
let maxSize = 5.0;
let grafTemplate = document.querySelector("template");

let isUnsetGraf = false;
let currentGraf;

var currentSettings = 
{
    text:         "",
    color:        "black",
    font:         "Arial",
    size:         "2rem",
    left:         "20%",
    top:          "10%",
    rotation:     "0",
}

const fonts =
{
    Arial:          "Arial",
    Typewriter:     "'Courier New', monospace",
    Cursive:        "'Brush Script MT', cursive",
    Times:          "'Times New Roman', serif",
    Trebuchet:      "'Trebuchet MS', sans-serif",
    Verdana:        "Verdana, sans-serif"
};

colorInput.addEventListener("input", () => {
    currentSettings.color = colorInput.value;
    updateInputStyle();
});

fontSelect.addEventListener("input", () => {
    currentSettings.font = fonts[fontSelect.value];
    updateInputStyle();
});

sizeInput.addEventListener("input", () => {
    currentSettings.size = (maxSize * sizeInput.value + minSize) + "rem";
    updateInputStyle();
});



function updateInputStyle () {
    //update input styling
    textInput.style.fontFamily = currentSettings.font;
    textInput.style.fontSize = currentSettings.size;
    textInput.style.color = currentSettings.color;
}

function createGraf() {
    if(textInput.value == "") return;
    if(isUnsetGraf) return;
    isUnsetGraf = true;
    
    var newGraf = grafTemplate.content.firstElementChild.cloneNode(true);
    newGraf.addEventListener("mousedown",dragStart);
    newGraf.querySelector(".unset-graf").addEventListener("mousedown", rotateStart);
    newGraf.style.left = "40%";
    newGraf.style.top = "40%";

    var grafText = newGraf.querySelector(".unset-graf");

    var inputString = textInput.value.replace(/[^\x00-\x7F]/g, "");
    grafText.textContent = inputString;
    grafText.style.fontFamily = currentSettings.font;
    grafText.style.fontSize = currentSettings.size;
    grafText.style.color = currentSettings.color;
    grafText.style.transform = "rotate(" + currentSettings.rotation + ")";

    textInput.value = "";

    currentGraf = newGraf;
    document.body.appendChild(newGraf);
}


window.onload = () => {

    for (const key in fonts) {
        
        var e = document.createElement("option");
        e.value = key;
        e.innerText = key;
        fontSelect.appendChild(e);
    }
    
    let jsonFile;

    updateInputStyle();

    fetch('./graf.json')
        .then((response) => response.json())
        .then((json) => {
            jsonFile = json;
            
            for (let i = 0; i < jsonFile.length; i++) {
                var g = jsonFile[i];

                var graffito = document.createElement("p");
                
                graffito.classList.add("graf");
                graffito.classList.add("unselectable");
                graffito.textContent = g.text;
                graffito.style.fontFamily = g.font;
                graffito.style.fontSize = g.size;
                graffito.style.color = g.color;
                graffito.style.left = g.left;
                graffito.style.top = g.top;
                graffito.style.transform = "rotate(" + g.rotation + ")";

                document.body.appendChild(graffito);
            }

    });
}

function trashGraf () {
    currentGraf.remove();
    isUnsetGraf = false;
}

var dragTarget;
var dragObjLeft, dragObjRight, dragStartX, dragStartY;

function dragStart (e) {
    dragTarget = e.target;
    dragObjLeft = e.target.offsetLeft;
    dragObjTop = e.target.offsetTop;
    dragStartX = e.pageX;
    dragStartY = e.pageY;

    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);
}

function dragMove (e) {
    dragTarget.style.left   = dragObjLeft   +  (e.pageX - dragStartX) + "px";
    dragTarget.style.top    = dragObjTop    +  (e.pageY - dragStartY) + "px";
}

function dragEnd(e) {
    window.removeEventListener("mousemove", dragMove);
}


//rotatieon handling
function rotateStart (e) {
    dragTarget = e.target;
    dragObjLeft = e.target.offsetLeft;
    dragObjTop = e.target.offsetTop;
    dragStartX = e.pageX;
    dragStartY = e.pageY;

    window.addEventListener("mousemove", rotateMove);
    window.addEventListener("mouseup", rotateEnd);
}

function rotateMove (e) {
    const angle = Math.atan2(e.pageY - dragStartX, e.pageX - dragStartY);
    dragTarget.style.transform = `rotate(${angle}rad)`;
    
}

function rotateEnd(e) {
    window.removeEventListener("mousemove", rotateMove);
}


