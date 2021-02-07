// get id
const getId = (id) => document.getElementById(id);

//enter key press event
getId("search-input").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === 'Enter') {
        getId("search-button").click();
    }
});

//add click event on search button 
getId('search-button').addEventListener('click', () => {
    const searchName = getId('search-input').value;

    getId('meal-container').innerHTML = '';//clear old meals list

    const regexp = /[a-zA-z]/;//set regular expression
    //check input is name of not
    if (searchName.match(regexp)) {
        getMealsList(searchName);
    } else {
        getId('message').innerText = 'Search  foods by name.';
    }
    getId('search-input').value = '';//clear value after search
});


//get meals data list from theMealDB.com with api
const getMealsList = async searchName => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchName}`);
    const data = await response.json();
    //check data is empty or not, if empty return error message
    if (data.meals) {
        //data is not empty
        displayMealsData(data);//call displayMealsData function
        getId('message').innerText = '';
    } else {
        getId('message').innerText = `The "${searchName}" Foods not found! Try another foods like chicken, beef, pasta.`;
    }
};



//display meals data 
const displayMealsData = (data) => {
    const mealsArray = data.meals;//catch meals array in data object

    //looping meals array
    mealsArray.forEach(meal => {
        const mealName = meal.strMeal;//catch meal name
        const mealId = meal.idMeal;//catch meal name
        const mealImg = meal.strMealThumb; // catch meal image
        let child = document.createElement('div');// create new child element 
        const classList = ['col-md-6', 'col-lg-4', 'col-xl-3', 'p-3']; // add class array for child element
        child.classList.add(...classList); // add class child element

        // create template for display data
        child.innerHTML = `
        <div class = ''> 
        <div data-id='${mealId}' class="card card-click" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <img src="${mealImg}" class="card-img-top" alt="...">
            <h5 class="card-title p-2">${mealName}</h5>
         </div>
        </div>
        
        `;
        getId('meal-container').appendChild(child); // append child 
    });

    //catch card htmlCollection 
    const classList = document.getElementsByClassName('card-click');

    //looping for catch every class
    for (element of classList) {
        //add click event on card item
        element.addEventListener('click', (event) => {
            event.stopPropagation();// stop bubbling
            //catch name in element data-id attribute
            let mealId = event.target.getAttribute('data-id');
            if (!mealId) {
                //clicked child element
                mealId = event.target.parentNode.getAttribute('data-id');
            };
            getDetailsMealItem(mealId);//call get details data function
        });
    }

};

//get details meal item
const getDetailsMealItem = async mealId => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();

    //check data is empty or not
    if (data.meals[0].strMeal) {
        //call display details function
        displayMealDetails(data);

        getId('spinner').style.display = 'none';//hide spinner when data is load
        getId('modal-body').style.display = 'block'; // show when data load complete 
    } else {

    }
}

//display details about meal item
const displayMealDetails = data => {
    const meal = data.meals[0];//catch meal item
    const mealName = meal.strMeal;//catch meal name
    const mealImg = meal.strMealThumb;//catch meal image


    //displaying data in modal
    getId('meal-img').src = mealImg;//display image
    getId('meal-name').innerText = mealName;//display name

    //catch object key for 'strIngredient' property catch
    const mealKey = Object.keys(meal);//return all property in meal object

    // filter properties whice contain 'strIngredient' word
    const ingredients = mealKey.filter(elements => elements.includes('strIngredient'));// return strIngredient array

    //looping for catch every ingredients array item and display
    ingredients.forEach(ingredient => {
        //check ingredient is empty or not
        if (meal[ingredient]) {
            displayIngredient(meal[ingredient]);//call display ingredient function
        }
    });
};

// display ingredient item
const displayIngredient = ingredient => {
    const li = document.createElement('li');//create li 
    li.classList.add('p-2');//add class 
    li.innerHTML = `
        <span class='me-2'>✅ </span>
        <span>${ingredient}</span>
    `
    getId('parent-ingredient').appendChild(li);//append li in ul
};