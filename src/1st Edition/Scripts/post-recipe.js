var countDisplayedIngredient = 20;
var countDisplayedStep = 20;
var countDisplayedNutritionalValue = 20;
var checkCalories = false;
var defaultThumbnail = "data:image/png;base64,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";
var recipe_name;
var short_description;
var ingredients = [];
var preparationTime;
var cookingTime;
var steps = [];
var calories;
var additional_nutrition_values = [];
var additional_images_base64_string = [];


function hideIngredients(start, end) {
    for (var i = start; i <= end; i++) {
        var id = 'ingredient-div-' + String(i);
        document.getElementById(id).style.display = "none";
        countDisplayedIngredient -= 1;
    }
}
function hideSteps(start, end) {
    for (var i = start; i <= end; i++) {
        var id = 'step-div-' + String(i);
        document.getElementById(id).style.display = "none";
        countDisplayedStep -= 1;
    }
}

function hideNutritionalValues(start, end) {
    for (var i = start; i <= end; i++) {
        var id = 'nutritional-value-' + String(i);
        document.getElementById(id).style.display = "none";
        countDisplayedNutritionalValue -= 1;
    }
}

function addIngredient() {
    countDisplayedIngredient++;
    if (countDisplayedIngredient > 20) {
        countDisplayedIngredient = 20;
        return;
    }
    var id = 'ingredient-div-' + String(countDisplayedIngredient);
    document.getElementById(id).style.display = "block";
}

function deleteLatestIngredient() {
    if (countDisplayedIngredient <= 1) {
        countDisplayedIngredient = 1;
        return;
    }
    var id = 'ingredient-div-' + String(countDisplayedIngredient);
    var idTextarea = 'ingredient' + String(countDisplayedIngredient);
    document.getElementById(idTextarea).value= "";
    document.getElementById(id).style.display = "none";
    countDisplayedIngredient -= 1;
}

function changePreparationTimeButton(id) {
    var buttons = document.getElementsByClassName("preparation-time-button");
    for (var i = 0; i < 6; i++) {
        buttons[i].style.backgroundColor = "rgb(0, 0, 0, 0.08)";
        buttons[i].style.color = "black";
    }
    document.getElementById(id).style.backgroundColor = 'rgb(226, 6, 6)';
    document.getElementById(id).style.color = 'white';
}

function changeCookingTimeButton(id) {
    var buttons = document.getElementsByClassName("cooking-time-button");
    for (var i = 0; i < 6; i++) {
        buttons[i].style.backgroundColor = "rgb(0, 0, 0, 0.08)";
        buttons[i].style.color = "black";
    }
    document.getElementById(id).style.backgroundColor = 'rgb(226, 6, 6)';
    document.getElementById(id).style.color = 'white';
}

function addStep() {
    countDisplayedStep++;
    if (countDisplayedStep > 20) {
        countDisplayedStep = 20;
        return;
    }
    var id = 'step-div-' + String(countDisplayedStep);
    document.getElementById(id).style.display = "block";
}

function deleteLatestStep() {
    if (countDisplayedStep <= 1) {
        countDisplayedStep = 1;
        return;
    }
    var id = 'step-div-' + String(countDisplayedStep);
    var idTextarea = 'step' + String(countDisplayedStep);
    document.getElementById(idTextarea).value= "";
    document.getElementById(id).style.display = "none";
    countDisplayedStep -= 1;
}

function addNutritionalValue() {
    countDisplayedNutritionalValue++;
    if (countDisplayedNutritionalValue > 20) {
        countDisplayedNutritionalValue = 20;
        return;
    }
    var id = 'nutritional-value-' + String(countDisplayedNutritionalValue);
    document.getElementById(id).style.display = "block";
}

function deleteLatestNutritionalValue() {
    if (countDisplayedNutritionalValue <= 1) {
        countDisplayedNutritionalValue = 1;
        return;
    }
    var id = 'nutritional-value-' + String(countDisplayedNutritionalValue);
    //document.getElementById(id).value= "";
    document.getElementById(id).style.display = "none";
    countDisplayedNutritionalValue -= 1;
}

function Next() {
    // Get and check recipe name
    recipe_name = document.getElementById("recipe-name").innerHTML;

    // Get short description
    short_description = document.getElementById("short-description").value;
    
    // Get list of ingredients
    for (var i = 0; i < countDisplayedIngredient; i++) {
        var id = "ingredient" + String(i + 1);
        if (document.getElementById(id).value === "") continue;
        ingredients[i] = document.getElementById(id).value;
    }

    // Get chosen preparation and cooking time
    const preparation_ids = ['preparation-time-less-than-10-min-button', 'preparation-time-up-to-20-min-button', 'preparation-time-up-to-30-min-button', 'preparation-time-up-to-40-min-button','preparation-time-up-to-50-min-button','preparation-time-more-than-50-min-button']
    const cooking_ids = ['cooking-time-less-than-10-min-button', 'cooking-time-up-to-20-min-button', 'cooking-time-up-to-30-min-button', 'cooking-time-up-to-40-min-button','cooking-time-up-to-50-min-button','cooking-time-more-than-50-min-button']
    const time = ['Less than 10 min', 'Up to 20 min', 'Up to 30 min', 'Up to 40 min', 'Up to 50 min', 'More than 50 min'];

    var countPreparationButtons = 0;
    var countCookingButtons = 0;
    for (var i = 0; i < time.length; i++)  {
        var id = preparation_ids[i];
        if (document.getElementById(id).style.backgroundColor === 'rgb(226, 6, 6)') {
            preparationTime = time[i];
            countPreparationButtons++;
            break;
        };
    }
    for (var i = 0; i < time.length; i++)  {
        var id = cooking_ids[i];
        if (document.getElementById(id).style.backgroundColor === 'rgb(226, 6, 6)') {
            cookingTime = time[i];
            countCookingButtons++;
            break;
        };
    }

    // Get list of steps
    for (var i = 0; i < countDisplayedStep; i++) {
        var id = "step" + String(i + 1);
        if (document.getElementById(id).value === "") continue;
        steps[i] = document.getElementById(id).value;
    }

    // Check and get calories
    calories = document.getElementById('calories-textarea').value;

    // Get additional nutrition values
    for (var i = 0; i < countDisplayedNutritionalValue; i++)  {
        var id = 'nutritional-value-' + String(i + 1);
        if (document.getElementById(id).value === "") continue;
        additional_nutrition_values[i] = document.getElementById(id).value;
    }

    var count_image = 0;
    // Get additional images and base64 encode them
    var additional_images = document.getElementById("upload-additional-images-button").files;
    for (var i = 0; i < additional_images.length; i++) {
        var picture = new FileReader();
            picture.readAsDataURL(additional_images[i]);
            picture.addEventListener("load", (e) => {
                base64_string = e.target.result;
                base64_string = String(base64_string).split(',');
                base64_string = base64_string[1].trim();
                additional_images_base64_string[count_image] = base64_string;
                count_image++;
        });
    }


    if (recipe_name === "Recipe Name" || recipe_name === "" || ingredients[0] === "" || countPreparationButtons === 0 || countCookingButtons === 0 || steps[0] === "" || calories === "" || checkCalories === false){
        alert("You haven't entered some required field(s)!");
        return;
    }

    $("#post-recipe-form").fadeOut();
    document.getElementById("upload-thumbnail-form").style.display = "block";

}

function backToPostRecipeForm() {
    $("upload-thumbnail-form").fadeOut();
    document.getElementById("upload-thumbnail-form").style.display = "none";
    $("#post-recipe-form").fadeIn();
    document.getElementById("post-recipe-form").style.display = "block";
}

function uploadThumbnail() {
    document.getElementById('upload-thumbnail').click();
    document.getElementById('upload-thumbnail').addEventListener('change', function(){
    if (this.files[0] ) {
        var picture = new FileReader();
        picture.readAsDataURL(this.files[0]);
        picture.addEventListener('load', function(event) {
            document.getElementById('thumbnail-img').setAttribute('src', event.target.result);
            document.getElementById('thumbnail-img').style.width = "300px";
            document.getElementById('thumbnail-img').style.height = "200px";
            document.getElementById("delete-thumbnail").disabled = false;
            document.getElementById("delete-thumbnail").style.opacity = 1;
            document.getElementById("delete-thumbnail").style.cursor = "pointer";
            document.getElementById('upload-thumbnail').value = "";
            document.getElementById("post-button").disabled = false;
            document.getElementById("post-button").style.opacity = 1;
            document.getElementById("post-button").style.cursor = "pointer";
        });
    }
    });
}

function deleteThumbnail() {
    document.getElementById('thumbnail-img').setAttribute('src', defaultThumbnail);
    document.getElementById('thumbnail-img').style.width = "200px";
    document.getElementById('thumbnail-img').style.height = "200px";
    document.getElementById("delete-thumbnail").disabled = true;
    document.getElementById("delete-thumbnail").style.opacity = 0.5;
    document.getElementById("delete-thumbnail").style.cursor = "no-drop";
    document.getElementById("post-button").disabled = true;
    document.getElementById("post-button").style.opacity = 1;
    document.getElementById("post-button").style.cursor = "pointer";
}

function validateCalories() {
    var calories = document.getElementById("calories-textarea").value;
    if (calories === "") {
        document.getElementById("alert-wrong-calories").style.display = "none";
        document.getElementById("alert-wrong-calories").innerHTML = "";
        document.getElementById("calories-textarea").style.backgroundColor = "rgb(0, 0, 0, 0.08)";
        document.getElementById("calories-textarea").style.color = "black";
        checkCalories = false;
        return;
    };
    const regexCalories = /[a-zA-Z`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (regexCalories.test(calories) == true) {
        document.getElementById("alert-wrong-calories").style.display = "block";
        document.getElementById("alert-wrong-calories").innerHTML = "Only allow numbers in <strong>Calories</strong>";
        document.getElementById("calories-textarea").style.backgroundColor = "lightcoral";
        document.getElementById("calories-textarea").style.color = "white";
        checkCalories = false;
    }
    else {
        document.getElementById("alert-wrong-calories").style.display = "none";
        document.getElementById("alert-wrong-calories").innerHTML = "";
        document.getElementById("calories-textarea").style.backgroundColor = "rgb(0, 0, 0, 0.08)";
        document.getElementById("calories-textarea").style.color = "black";
        checkCalories = true;
    }

    //$("post-recipe-form").fadeOut();
}

function post() {
    var thumbnail = document.getElementById('thumbnail-img').src;
    thumbnail = String(thumbnail).split(',');
    thumbnail = thumbnail[1].trim();

    username = sessionStorage.getItem('username');

    var data = {"PostRecipe": "True", "username": username, "recipe-name": recipe_name, "short-description": short_description, "ingredients": ingredients, "preparation-time": preparationTime, "cooking-time": cookingTime, "steps": steps, "calories": String(calories),"additional-nutrition-values": additional_nutrition_values, "additional-images": additional_images_base64_string, "thumbnail": thumbnail};

    data = JSON.stringify(data);

    var req = new XMLHttpRequest();
    req.open("POST", "/templates/signup.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.PostRecipe == true) {}
        document.getElementById("alert-post-successfully").style.display = "block";
        setTimeout(function() {
            location.href = "/templates/mainpage.html";
        }, 1000);
    });
}