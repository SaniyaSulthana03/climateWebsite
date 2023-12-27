const wrapper = document.querySelector(".wrapper"),inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");
// b70979c4d3147f77704906d12904ab1e
// const your_api_key=b70979c4d3147f77704906d12904ab1e;
let api;
// keyup is an event that occurs when a user releases a key on the keyboard after pressing it
// ekeyPressed
inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

const requestApi=(city)=>{
    api =` https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=your_api_key`;
    // api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=your_api_key`;
    // api=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=b70979c4d3147f77704906d12904ab1e`;
    fetchData();
}

const onSuccess=(position)=>{
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=your_api_key`;
    fetchData();
}

const onError=(error)=>{
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

const fetchData=()=>{
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

const weatherDetails=(info)=>{
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});