const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
wIcon = document.querySelector('.weather-part img'),
arrowBack = wrapper.querySelector('header i'),
apiKey = 'e2f07fa5296109348d9d890fa06b4f2c';

let api;

inputField.addEventListener('keyup', e =>{
    if(e.key == 'Enter' && inputField.value != ''){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener('click', () =>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    } else {
        alert('No se pudo obtener la ubicación');
    }
})

function onSucess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=sp`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add('error');
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=sp`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = 'Obteniendo datos del clima...';
    infoTxt.classList.add('pending');
    fetch(api).then(response => response.json())
        .then(result => weatherDetails(result));
}

function weatherDetails(info){
    if(info.cod == '404'){
        infoTxt.innerText = `${inputField.value} no es un nombre válido de ciudad`;
        infoTxt.classList.replace('pending', 'error');
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "Icons/clear.svg";
        } else if (id >= 200 && id <= 232){
            wIcon.src = "Icons/storm.svg";
        } else if (id >= 600 && id <= 622){
            wIcon.src = "Icons/snow.svg";
        } else if (id >= 701 && id <= 781){
            wIcon.src = "Icons/haze.svg";
        } else if (id >= 801 && id <= 804){
            wIcon.src = "Icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "Icons/rain.svg";
        }

        wrapper.querySelector('.temp .numb').innerText = Math.round(temp * 10) / 10;
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.round(feels_like * 10) / 10;
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoTxt.classList.remove('pending', 'error');
        wrapper.classList.add('active');
        console.log(info);
    }
}

arrowBack.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
})