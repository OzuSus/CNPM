import { filterForecastData } from "./filterForecastData.js";
import { roundDegree, formatDate } from "./convertUnits.js";

export const weatherForecastData = async (response) => {
  const hourlyWeatherForecastDate = document.querySelectorAll(".hourly-weather-forecast-date");
  const hourlyWeatherForecastTime = document.querySelectorAll(".hourly-weather-forecast-time");
  const hourlyWeatherForecastTemperature = document.querySelectorAll(".hourly-weather-forecast-temperature");

  const dailyWeatherForecastDate = document.querySelectorAll(".daily-weather-forecast-date");
  const dailyWeatherForecastTime = document.querySelectorAll(".daily-weather-forecast-time");
  const dailyWeatherForecastIcon = document.querySelectorAll(".daily-weather-forecast-icon");
  const dailyWeatherForecastTemperature = document.querySelectorAll(".daily-weather-forecast-temperature");
  const dailyWeatherForecastDescription = document.querySelectorAll(".daily-weather-forecast-description");

  if (!response.ok) {
    if (response.status === 404) {
      //UC-02 báo lôỗi nếu không timf thấy ịa điểm
      throw new Error(`Rat tiet, he thong khong tim thay ${data}. Vui long kiem tra lai dia diem`);
    } else {
      throw new Error(
        "Oops! We're having trouble getting the latest weather information right now. Please try again later or contact support if the problem persists."
      );
    }
  }
  const weatherForecastData = await response.json();
  await filterForecastData(weatherForecastData);
  //UC-04: 4.10 Tra ve thong tin du bao thoi tiet vao index.html
  //UC-02: 5 Tra ve thong tin du bao thoi tiet vao index.html
  for (let index = 0; index < 5; index++) {
    hourlyWeatherForecastDate[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "day");
    hourlyWeatherForecastTime[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "hour");
    hourlyWeatherForecastTemperature[index].innerHTML = await roundDegree(weatherForecastData.list[index].main.temp);
  }

  for (let index = 0; index < 40; index++) {
    dailyWeatherForecastDate[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "short");
    dailyWeatherForecastTime[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "hour");
    dailyWeatherForecastIcon[index].src = `src/img/static/${weatherForecastData.list[index].weather[0].icon}.svg`;
    dailyWeatherForecastTemperature[index].innerHTML = await roundDegree(weatherForecastData.list[index].main.temp);
    dailyWeatherForecastDescription[index].innerHTML = weatherForecastData.list[index].weather[0].main;
  }
};
