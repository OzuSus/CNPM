import { handleError } from "./handleError.js";
import { currentWeatherData } from "./currentWeatherData.js";
import { weatherForecastData } from "./weatherForecastData.js";
import {callApi, callApiForecast} from "./callApi.js";
import {endLoadingState, startLoadingState} from "./setLoadingState.js";
import {createDailyCards, createHourlyCards} from "./weatherForecastCards.js";

const searchBoxInput = document.querySelector(".search-box-input");

createHourlyCards();
createDailyCards();
//UC-01 3.Xử lý dữ liệu
//UC-02 3.Xử lý dữ liệu search
searchBoxInput.addEventListener("keyup", async (event) => {
    if (event.keyCode === 13) { // Code of enter
        //UC-01 4.checkValue(data)
        //UC-02 4.checkValue(data)
        //UC-04: 4.2 checkValue(data)
        if(!checkValue(searchBoxInput.value)) {
            //UC-01 5.1 Báo lỗi dữ liệu trống
            //UC-04: 4.2.1 Bao loi du lieu
            //UC-02: 2.1 báo lõi địa đểm không tôn tại
            handleError(
                //4.1.1 Hien thi vui long nhap ten thanh pho
                "Vui lòng nhập tên thành phố!.",
                "Refresh Page"
            )
        }else {
            // UC-01 5 callApi(data)
            //UC-04 4.3 callApi(data)
            const response = await callApi(searchBoxInput.value);
            // UC-01 6 currentWeatherData(response)
            // UC-04: 4.5 currentWeatherData(response)
            await currentWeatherData(response)

            try {
                //UC-04: 4.7 callApiForecast(value)
                //UC-02: 4.7 gọi dêến API lấy dữ liẹu
                let response = await callApiForecast(searchBoxInput.value);
                await startLoadingState();
                //UC-04: 4.9 weatherForecastData(respone)
                //UC-02: 4.9 lấy d liệu bên weatherForecastData sau khi gọi data từ API
                await weatherForecastData(response);
                await endLoadingState();
            } catch (error) {
                if (error.message === "Failed to fetch") {
                    await handleError(
                        "Uh oh! It looks like you're not connected to the internet. Please check your connection and try again.",
                        "Refresh Page"
                    );
                } else {
                    await handleError(error.message, "Try Again");
                }
            }
        }
    }
});

//UC 02-lay vi tri hien tai cua nguoi dung
const gpsButton = document.querySelector(".gps-button");
const getUserLocation = async () => {
    const successCallback = async (position) => {
        const data = {
            //UC-02 1. Lấy dâata v trí hện tại
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
        //UC-02 2.gọi API
        const response = await callApi(data);
        //UC-02 3.Gui du lieu thời tiết hiện tại
        await currentWeatherData(response)
        try {
            //UC-02 4.goi API du báo thời tiết
            const response = await callApiForecast(data);
            await startLoadingState();
            //UC-02 5.trả về data
            await weatherForecastData(response);
            await endLoadingState();
        } catch (error) {
            //UC-02 6.báo lỗi nếu ko kết nối được
            if (error.message === "Failed to fetch") {
                await handleError(
                    "Uh oh! It looks like you're not connected to the internet. Please check your connection and try again.",
                    "Refresh Page"
                );
            } else {
                await handleError(error.message, "Try Again");
            }
        }
    };

    const errorCallback = (error) => {
        console.log(error);
        fetchWeatherData("Istanbul");
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};
gpsButton.addEventListener("click", getUserLocation);
// getUserLocation();


const topButton = document.querySelector(".top-button");
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};
topButton.addEventListener("click", scrollToTop);


const checkValue = (valueInput) => {
    if(valueInput.length <= 0) {
        return false;
    }
    return true;
}
// tro ly ao
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'vi-VI';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

const speak = (text) => {
    if (synth.speaking) {
        console.error('Busy. Speaking...');
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerror = (err) => {
        console.error('SpeechSynthesisUtterance.onerror', err);
    }

    synth.speak(utter);
};
function simulateKeyUpWithEnter() {
    const event = new KeyboardEvent('keyup', {
        keyCode: 13,
        which: 13,
        key: 'Enter',
        code: 'Enter',
        bubbles: true
    });
    searchBoxInput.dispatchEvent(event);
}
const handleVoice = (text) => {
    console.log('text', text);

    // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
    const handledText = text.toLowerCase();
    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();
        console.log('location', location);
        searchBoxInput.value = location;
        simulateKeyUpWithEnter();
    }else {
        console.log('location', location);
        searchBoxInput.value = handledText;
        simulateKeyUpWithEnter();
    }

    const container = document.querySelector('.container');


    if (handledText.includes('mấy giờ')) {
        const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
        speak(textToSpeech);
        return;
    }

    speak('Try again');
}

microphone.addEventListener('click', (e) => {
    e.preventDefault();
    recognition.start();
    microphone.classList.add('recording');
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (err) => {
    console.error(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}


