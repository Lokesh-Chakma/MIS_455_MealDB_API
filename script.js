const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const mealContainer = document.getElementById("mealContainer");
const showAllBtn = document.getElementById("showAllBtn");
const categoryButtons = document.querySelectorAll(".category-btn");
const recipeModal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalDescription = document.getElementById("modalDescription");
const modalInstructions = document.getElementById("modalInstructions");

let allMeals = [];

searchBtn.addEventListener("click",()=>{
const query = searchInput.value.trim();
if(query){
searchByName(query);
}
});

searchInput.addEventListener("keypress",(e)=>{
if(e.key==="Enter"){
const query = searchInput.value.trim();
if(query){
searchByName(query);
}
}
});

categoryButtons.forEach(button=>{
button.addEventListener("click",()=>{
categoryButtons.forEach(btn=>{
btn.classList.remove("active");
});
button.classList.add("active");
const type = button.dataset.type;
const value = button.dataset.value;
if(type==="all"){
loadPopularMeals();
}

else if(type==="area"){
loadByArea(value);
}

else if(type==="category"){
loadByCategory(value);
}
});
});

async function searchByName(name){
showLoading();
try{
const response = await fetch(
`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
);
const data = await response.json();
allMeals = data.meals || [];
displayInitial();
}
catch(error){
showError();
}
}

async function loadByArea(area){
showLoading();
try{
const response = await fetch(
`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
);
const data = await response.json();
const basicMeals = data.meals || [];
allMeals = await getFullMealDetails(basicMeals);
displayInitial();
}
catch(error){
showError();
}
}

async function loadByCategory(category){
showLoading();
try{
const response = await fetch(
`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
);
const data = await response.json();
const basicMeals=data.meals || [];
allMeals = await getFullMealDetails(basicMeals);
displayInitial();
}
catch(error){
showError();
}
}

async function getFullMealDetails(meals){
const details = await Promise.all(
meals.map(async(meal)=>{
const response = await fetch(
`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
);
const data = await response.json();
return data.meals[0];
})
);
return details;
}
async function loadPopularMeals(){
searchByName("chicken");
}

function displayInitial(){
if(allMeals.length===0){
mealContainer.innerHTML=`
<h3 style="text-align:center">
No meals found
</h3>

`;
showAllBtn.classList.add("hidden");
return;
}
displayMeals(allMeals.slice(0,5));
if(allMeals.length>5){
showAllBtn.classList.remove("hidden");
}
else{
showAllBtn.classList.add("hidden");
}
}
