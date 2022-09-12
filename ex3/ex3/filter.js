
//define an object so we can keep tack of what catergories are selected
const CategoriesSelected = {
    "diet": "", // this means its not selected
    "author": "" // this means it is selected
}

//ive done it this way so you can select multiple categories at once

function filterCategory(filterSelection, filterBy){
    let recipeCards = Array.from(document.getElementsByClassName("RecipeCardWrapper"));

    CategoriesSelected[filterBy] = filterSelection;

    
    resetSelectionDisplay(filterBy);
    document.getElementById(filterSelection).classList.add("selected")

    updateDisplay()
}

function resetSelectionDisplay(category) {
    let selectors = Array.from(document.getElementsByClassName(category));
    for(let s of selectors){
        s.classList.remove("selected");
    }
}

function resetCatergory(filterBy){
    if(filterBy==="all") {
        for(const key in CategoriesSelected){
            resetCatergory(key);
        }

        return;
    }
    
    CategoriesSelected[filterBy] = "";
    resetSelectionDisplay(filterBy);
    updateDisplay();
}


function updateDisplay() {
    let recipeCards = Array.from(document.getElementsByClassName("RecipeCardWrapper"));
    

    for(let card of recipeCards){
        //look at every piece of data that is being held in the reciepe card wrapper,
        //if anything category doesnt match what is currently being filtered, than don't display it
        //but if the category is not being filtered for ie. it is equal to "", than just move on
        
        var displayItem = true;

        for(const key in CategoriesSelected){
            if(CategoriesSelected[key] === "")continue;
            
            if(card.dataset[key] != CategoriesSelected[key]){
                displayItem = false;
            }
        }

        if(displayItem){
            card.style.display = "flex"; // display item
        } else {
            card.style.display = "none";
        }

        
    }

    
}

