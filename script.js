const userTab = document.querySelector("[data-userWeather]"); 
const searchTab = document.querySelector("[data-searchWeather]"); 
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container"); 
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const error_404 = document.querySelector(".errr");
let currentTab = userTab;
const  API_KEY = "1a21cb36ab6b97bba66fbae68451b709";
currentTab.classList.add("current-tab");
searchForm.classList.remove("active");
error_404.classList.remove("active");
getfromSessionStorage();

function switchTab(clickedTab){
if(clickedTab != currentTab){
    searchInput.value = "";
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    
    if(!searchForm.classList.contains("active")){
      
        error_404.classList.remove("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        error_404.classList.remove("active");
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active"); 
        getfromSessionStorage();
    }
   }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordintes");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);  
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`); 
        const data = await response.json(); 
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(WeatherInfo){
    
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const description = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-WeatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloundness]");
    const windSpeed = document.querySelector("[data-windSpeed]");

    cityName.innerText = WeatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = WeatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${WeatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${WeatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${WeatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${WeatherInfo?.clouds?.all} %`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log('location is not available');
    }
}
function showPosition(Position){
    const usercoordinates = {
        lat: Position.coords.latitude,
        lon: Position.coords.longitude,
    }
   
    sessionStorage.setItem("user-coordintes",JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);  
}
const grantAccessbutton = document.querySelector("[data-grantAccess]");
grantAccessbutton.addEventListener('click',()=>{
    getLocation();
})

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    let cityname = searchInput.value;
    if(cityname === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityname);
    }
});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if(response.status !== 404){
        error_404.classList.remove("active");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        }
        else{
            loadingScreen.classList.remove("active");
            error_404.classList.add("active");
        }
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.log(e,'this is error');
    }
}