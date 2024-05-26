
import { handleError } from "./handleError.js";
import { currentWeatherData } from "./currentWeatherData.js";
import callApi from "./callApi.js";

const searchBoxInput = document.querySelector(".search-box-input");
// 3.Xu ly du lieu
searchBoxInput.addEventListener("keyup", async (event) => {
    if (event.keyCode === 13) { // Code of enter
        // 4. Kiem tra du lieu
        if(!checkValue(searchBoxInput.value)) {
            //4.1 bao loi du lieu trong
            handleError(
                //4.1.1 Hien thi vui long nhap ten thanh pho
                "Vui lòng nhập tên thành phố!.",
                "Refresh Page"
            )
        }else {
            console.log("dang ket noi xuong api")
            //5 ket noi xuong api
            //5.1 Tra ve du lieu
            const response = await callApi(searchBoxInput.value);
            //6 Gui du lieu
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

