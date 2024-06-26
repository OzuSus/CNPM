import { roundDegree, formatDate, mpsToKmh, metersToKm, capitalize } from "./convertUnits.js";
import {handleError} from "./handleError.js";
export const currentWeatherData = async (response) => {
    const currentWeatherIcon = document.querySelector(".current-weather-icon");
    const currentWeatherTemperature = document.querySelector(".current-weather-temperature");
    const currentWeatherDescription = document.querySelector(".current-weather-description");
    const currentLocation = document.querySelector(".current-location");
    const currentDate = document.querySelector(".current-date");
    const windSpeedValue = document.querySelector(".wind-speed-value");
    const pressureValue = document.querySelector(".pressure-value");
    const sunriseValue = document.querySelector(".sunrise-value");
    const humidityValue = document.querySelector(".humidity-value");
    const visibilityValue = document.querySelector(".visibility-value");
    const sunsetValue = document.querySelector(".sunset-value");
    // UC-01 7 Kiểm tra dữ liệu
    if(response?.message === "city not found") {
        // UC-01 8.1 Báo địa điểm không tồn tại
        //UC-04: 4.5.1 handleError(error, event)
        await handleError(
            "Địa điểm không tồn tại",
            "Try Again"
        );
    }else {
        //UC-01 8 Dữ liệu thời tiết
        //UC-04: 4.6 Tra ve thong tin thoi tiet hien tai vao index.html
        currentWeatherIcon.src = `src/img/animated/${response.weather[0].icon}.svg`;
        currentWeatherTemperature.innerHTML = await roundDegree(response.main.temp);
        console.log(currentWeatherTemperature.textContent)
        currentWeatherDescription.innerHTML = await capitalize(response.weather[0].description);
        currentLocation.innerHTML = response.name;
        currentDate.innerHTML = await formatDate(response.dt);
        windSpeedValue.innerHTML = await mpsToKmh(response.wind.speed);
        pressureValue.innerHTML = `${response.main.pressure} hPa`;
        sunriseValue.innerHTML = await formatDate(response.sys.sunrise, "hour");
        humidityValue.innerHTML = `${response.main.humidity}%`;
        visibilityValue.innerHTML = await metersToKm(response.visibility);
        sunsetValue.innerHTML = await formatDate(response.sys.sunset, "hour");
    }

};
