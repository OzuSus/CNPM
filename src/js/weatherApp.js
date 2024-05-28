
import { handleError } from "./handleError.js";
import { currentWeatherData } from "./currentWeatherData.js";
import callApi from "./callApi.js";

const searchBoxInput = document.querySelector(".search-box-input");
//UC-01 3.Xử lý dữ liệu
searchBoxInput.addEventListener("keyup", async (event) => {
    if (event.keyCode === 13) { // Code of enter
        //UC-01 4.checkValue(data)
        if(!checkValue(searchBoxInput.value)) {
            //UC-01 5.1 Báo lỗi dữ liệu trống
            handleError(
                "Vui lòng nhập tên thành phố!.",
                "Refresh Page"
            )
        }else {
            // UC-01 5 callApi(data)
            const response = await callApi(searchBoxInput.value);
            // UC-01 6 currentWeatherData(response)
            await currentWeatherData(response)
        }
    }
});
const checkValue = (valueInput) => {
    if(valueInput.length <= 0) {
        return false;
    }
    return true;
}

