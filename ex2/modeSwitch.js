let isDarkMode = false;

let darkColor = "#e4e1db";
let lightColor = "#2f2932";


function switchModes(){
    isDarkMode = !isDarkMode;

    setMode();
}

function setMode(){
    if(isDarkMode === true){ //turning dark mode on
        document.documentElement.style.setProperty("--col-01",darkColor);
        document.documentElement.style.setProperty("--col-02", lightColor);

        document.documentElement.style.setProperty("--invert","100%");
    } else { //turn dark mode off
        document.documentElement.style.setProperty("--col-01",lightColor);
        document.documentElement.style.setProperty("--col-02",darkColor);

        document.documentElement.style.setProperty("--invert","0%");
    }
}