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

function displayMeals(meals){
mealContainer.innerHTML="";
meals.forEach(meal=>{
const card=document.createElement("div");
card.className="meal-card";
card.innerHTML=`
<div class="card-image">
<img src="${meal.strMealThumb}">
</div>
<div class="card-content">
<h3>
${meal.strMeal}
</h3>
<p>
${meal.strCategory || "Cuisine"} 
•
${meal.strArea || "International"}
</p>
<p>
${meal.strInstructions.substring(0,120)}...
</p>
<div class="card-meta">
<span>
ID ${meal.idMeal}
</span>
<span>
 Save
</span>
</div>
<div class="view-btn" onclick="openRecipe('${meal.idMeal}')">
View Recipe 
</div>
</div>
`;
mealContainer.appendChild(card);
});
}

showAllBtn.addEventListener("click",()=>{
displayMeals(allMeals);
showAllBtn.classList.add("hidden");
});

window.openRecipe = async function(id){
const response = await fetch(
`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
);
const data = await response.json();
const meal=data.meals[0];
modalImage.src=meal.strMealThumb;
modalTitle.innerText=meal.strMeal;
modalMeta.innerText=
`${meal.strCategory} • ${meal.strArea}`;
modalDescription.innerText=
`A delicious ${meal.strMeal} recipe inspired by traditional cooking methods.`;
const steps = meal.strInstructions.split(".");
modalInstructions.innerHTML="";
steps.forEach((step,index)=>{
if(step.trim()){
modalInstructions.innerHTML+=`
<p>
<b>${index+1}.</b> ${step.trim()}.
</p>
`;
}
});
recipeModal.style.display="flex";
}
closeModal.onclick=()=>{
recipeModal.style.display="none";
}
window.onclick=(e)=>{
if(e.target===recipeModal){
recipeModal.style.display="none";
}
}

function showLoading(){
mealContainer.innerHTML=`
<h3 style="text-align:center">
Discovering recipes...
</h3>
`;
showAllBtn.classList.add("hidden");
}
function showError(){
mealContainer.innerHTML=`
<h3 style="text-align:center">
Unable to load recipes
</h3>
`;
}

loadPopularMeals();