import { handleError } from "./handleError.js";
import { currentWeatherData } from "./currentWeatherData.js";
import { weatherForecastData } from "./weatherForecastData.js";
import callApi from "./callApi.js";
import {endLoadingState, startLoadingState} from "./setLoadingState.js";
import {createDailyCards, createHourlyCards} from "./weatherForecastCards.js";

const searchBoxInput = document.querySelector(".search-box-input");
createHourlyCards();
createDailyCards();

// 3.Xu ly du lieu
searchBoxInput.addEventListener("keyup", async (event) => {
    if (event.keyCode === 13) { // Code of enter
        // 4.checkValue(data)
        if(!checkValue(searchBoxInput.value)) {
            //5.1 Báo lỗi dữ liệu trống
            handleError(
                "Vui lòng nhập tên thành phố!.",
                "Refresh Page"
            )
        }else {
            //5 callApi(data)
            const response = await callApi(searchBoxInput.value);
            //6 currentWeatherData(response)
            await currentWeatherData(response)

            try {
                await startLoadingState();
                await weatherForecastData(searchBoxInput.value);
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

//lay vi tri hien tai cua nguoi dung
const gpsButton = document.querySelector(".gps-button");
const getUserLocation = async () => {
    const successCallback = async (position) => {
        const data = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
        const response = await callApi(data);
        //6 Gui du lieu
        await currentWeatherData(response)
        try {
            await startLoadingState();
            await weatherForecastData(data);
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


