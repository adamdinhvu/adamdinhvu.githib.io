//retreiving references to all the input types
let textInput = document.querySelector(".text-input");
let colorInput = document.querySelector(".color-input");
let fontSelect = document.querySelector(".font-select");
let sizeInput = document.querySelector(".size-input")
let minSize = 1;
let maxSize = 5.0;
//template used when i spawn in a new graffiti
let grafTemplate = document.querySelector("template");

// keeping track of what state of interaction we're in
let isUnsetGraf = false;
let currentGraf;

//settings for the current graffiti, we can only have one at a time so i just keep all the refeneces here
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

//the font selector is created dynamically, just thought it be easier
const fonts =
{
    Arial:          "Arial",
    Typewriter:     "'Courier New', monospace",
    Cursive:        "'Brush Script MT', cursive",
    Times:          "'Times New Roman', serif",
    Trebuchet:      "'Trebuchet MS', sans-serif",
    Verdana:        "Verdana, sans-serif",
    Comic:          "Comic Sans MS, Comic Sans, Chalkboard SE, cursive",
};

//for handling inputs and updating style
colorInput.addEventListener("input", () => {
    currentSettings.color = colorInput.value;
    updateInputStyle();
});

fontSelect.addEventListener("input", () => {
    currentSettings.font = fontSelect.value;
    updateInputStyle();
});

sizeInput.addEventListener("input", () => {
    currentSettings.size = (maxSize * sizeInput.value + minSize) + "rem";
    updateInputStyle();
});

function updateInputStyle () {
    //update input styling
    textInput.style.fontFamily = fonts[currentSettings.font];
    textInput.style.fontSize = currentSettings.size;
    textInput.style.color = currentSettings.color;
}


//this is what we use to create the graffiti before we have confirmed it, this takes us from the text area into the movement state.
function createGraf() {
    //don't bother if nothing is there or we are already in the process of placing down a graffiti
    if(textInput.value == "") return;
    if(isUnsetGraf) return;
    isUnsetGraf = true;
    
    //using the template element
    var newGraf = grafTemplate.content.firstElementChild.cloneNode(true);
    //event listenres for both rotation and dragging
    newGraf.addEventListener("mousedown",dragStart);
    newGraf.querySelector(".unset-graf").addEventListener("mousedown", rotateStart);
    //place it near the centre (doesn't need to be exact :)) 
    newGraf.style.left = "40%";
    newGraf.style.top = "40%";

    //defining the styling to match the text area
    var grafText = newGraf.querySelector(".unset-graf");

    //removing anything that isnt ascii to prevent malicious strings
    var inputString = textInput.value.replace(/[^\x00-\x7F]/g, "");
    currentSettings.text = inputString;
    grafText.textContent = inputString;
    grafText.style.fontFamily = fonts[currentSettings.font];
    grafText.style.fontSize = currentSettings.size;
    grafText.style.color = currentSettings.color;
    currentSettings.rotation = "0";

    textInput.value = "";

    //set a refernec to the graffiti and put it in the document
    currentGraf = newGraf;
    document.body.appendChild(newGraf);
}


window.onload = () => {
    //initialize the text area with some basic styling
    updateInputStyle();

    //create the font selector
    for (const key in fonts) {
        
        var e = document.createElement("option");
        e.value = key;
        e.innerText = key;
        fontSelect.appendChild(e);
    }
    
    //fetching code from the json, the json here is kind of standing in for a databse, in a real setting this would be replaced with a databse.
    let jsonFile;

    fetch('./graf.json')
        .then((response) => response.json())
        .then((json) => {
            jsonFile = json;
            
            for (let i = 0; i < jsonFile.length; i++) {
                var g = jsonFile[i];

                //basically retriving the graffiti that other people have placed down
                placeGraf(g);
            }

    });
}

//this funciton is used for both placing down graffiti at the start and when the user wants to.
function placeGraf(settings) {
    var graf = document.createElement("p");
                
    graf.classList.add("graf");
    graf.classList.add("unselectable");
    graf.textContent = settings.text;
    graf.style.fontFamily = fonts[settings.font];
    graf.style.fontSize = settings.size;
    graf.style.color = settings.color;
    graf.style.left = settings.left;
    graf.style.top = settings.top;
    graf.style.transform = "rotate(" + settings.rotation + "rad)";

    document.body.appendChild(graf);
}

//delete current graffiti no need to check because this cannot be called from anywhere else but the buttons, and if they exist currentGraf cannot equal null. sitll put a check in.
function trashGraf () {
    if(currentGraf == null)return;
    currentGraf.remove();
    isUnsetGraf = false;
}

//place it down current graffiti, 
function confirmGraf() {
    placeGraf(currentSettings);
    trashGraf();
}

//for handling both the rotation and moving the object
//the code is mostly duplciayed between both, input is the same, just what is done with it is differnet.

var dragTarget;
var dragObjLeft, dragObjRight, dragStartX, dragStartY;

//this function initialises the dragging
function dragStart (e) {
    dragTarget = e.target;
    dragObjLeft = e.target.offsetLeft;
    dragObjTop = e.target.offsetTop;
    dragStartX = e.pageX;
    dragStartY = e.pageY;

    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);
}

//this function actually contains the logic, and moves the element
function dragMove (e) {
    var left = dragObjLeft   +  (e.pageX - dragStartX) + "px";
    var top = dragObjTop     +  (e.pageY - dragStartY) + "px";

    //i seriously dont understand why the graffiti moves once you place it down, considering its the same piece of code
    dragTarget.style.left   =  left;
    currentSettings.left    =  left;
    dragTarget.style.top    =  top;
    currentSettings.top     =  top;
}

//exitting the dragging state
function dragEnd(e) {
    window.removeEventListener("mousemove", dragMove);
}


//rotatieon handling, same as dragging
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
    //trigonomotry for determining angle, kind of feels a little bit janky but i found it hard to get it to feel right.
    const angle = Math.atan2(e.pageY - dragStartX, e.pageX - dragStartY);
    dragTarget.style.transform = `rotate(${angle}rad)`
    currentSettings.rotation = angle;
}

function rotateEnd(e) {
    window.removeEventListener("mousemove", rotateMove);
}


