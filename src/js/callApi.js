// UC-04: 4.4 Tra ve response dang Json
export async function callApi(data)
{
    const API_KEY = "66251d0370e6ab0032d63bffb24c2d95";
    let API_URL;

    if (data.lat && data.lon) {
        API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`;
    } else {
        API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${API_KEY}&units=metric`;
    }

    const response = await fetch(API_URL);
    return response.json()
}
// UC-04: 4.8 Tra ve response
export async function callApiForecast(data)
{
    const API_KEY = "66251d0370e6ab0032d63bffb24c2d95";
    let API_URL;
    if (data.lat && data.lon) {
        API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`;
    } else {
        API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${data}&appid=${API_KEY}&units=metric`;
    }
    const response = await fetch(API_URL);
    return response;
}
