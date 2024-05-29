import { createHourlyCards, createDailyCards } from "./weatherForecastCards.js";
import { startLoadingState, endLoadingState } from "./setLoadingState.js";
import { handleError } from "./handleError.js";
import { currentWeatherData } from "./currentWeatherData.js";
import { weatherForecastData } from "./weatherForecastData.js";



const searchBoxInput = document.querySelector(".search-box-input");
const gpsButton = document.querySelector(".gps-button");
const microphoneButton = document.querySelector(".microphone-button");
const topButton = document.querySelector(".top-button");

createHourlyCards();
createDailyCards();
const API_KEY = "66251d0370e6ab0032d63bffb24c2d95";

const fetchWeatherData = async (data) => {
  try {
    await startLoadingState();
    await currentWeatherData(data);
      await weatherForecastData(data, API_KEY);
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
};

const getUserLocation = async () => {
  const successCallback = async (position) => {
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    await fetchWeatherData(data);
  };

  const errorCallback = (error) => {
    console.log(error);
    fetchWeatherData("Istanbul");
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
//2.An enter
searchBoxInput.addEventListener("keyup", async (event) => {
  if (event.keyCode === 13) { // Code of enter
    if(!checkValue(searchBoxInput.value)) {
      //4.1 bao loi yeu cau nguoi dung nhap lai
      handleError(
          "Vui lòng nhập tên thành phố cần tìm kiếm!.",
          "Refresh Page"
      )
    }else {
      //5 ket noi xuong api
      await fetchWeatherData(searchBoxInput.value);
    }

  }
});
//4.Kiem tra du lieu
const checkValue = (valueInput) => {
  if(valueInput.length <= 0) {
    return false;
  }
  return true;
}
gpsButton.addEventListener("click", getUserLocation);

// ctaButton.addEventListener("click", () => {
//   window.open("https://github.com/pekkiriscim/weather");
// });

topButton.addEventListener("click", scrollToTop);

getUserLocation();
microphoneButton.addEventListener('click', (e) => {
  e.preventDefault();

  recognition.start();
  microphoneButton.classList.add('recording');
});