
function timeadjust(dir, timeinput) {
    // 방향키 눌러서 시간 -1 또는 +1
    // 시간 값 가져오기
    var currentValue = parseInt(document.getElementById(timeinput).value);
    // 값 감소 및 증가
    if (dir == 'left') {var newValue = currentValue - 1;}
    if (dir == 'right'){var newValue = currentValue + 1;}
    // 값을 다시 입력 필드에 설정
    document.getElementById(timeinput).value = newValue;
}
// 시간을 저장할 배열
var times = [];

function addTime() {
    // HH:mm:ss 형식으로 변환
    // in-sec, in-min, in-hour의 값을 가져오기
    var seconds = parseInt(document.getElementById("in-sec").value, 10);
    var minutes = parseInt(document.getElementById("in-min").value, 10);
    var hours = parseInt(document.getElementById("in-hour").value, 10);

    // 분, 초가 60을 초과할때
    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60) + minutes
        seconds = seconds % 60
    }
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60) + hours
        minutes = minutes % 60
    }

    // 시, 분, 초가 한 자리 숫자일 경우 앞에 0을 추가
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    // 배열에 시간을 추가
    var newTime = hours + ":" + minutes + ":" + seconds;
    times.push(newTime);
    console.log(times)

    // 모든 시간을 누적한 값 생성
    var totalSeconds = 0;
    // 누적시간을 저장할 배열
    var accumulatetimes = [];
    for (var i = 0; i < times.length; i++) {
        // 시, 분, 초를 초로 변환하여 더함
        var timeParts = times[i].split(":");
        var timeInSeconds = parseInt(timeParts[0],10) * 3600 + parseInt(timeParts[1],10) * 60 + parseInt(timeParts[2],10);
        totalSeconds += timeInSeconds;
        accumulatetimes.push(totalSeconds);
    }


    // 시간을 표시할 요소에 배열의 내용을 추가
    // 체크박스와 이미지를 동적으로 생성하고 추가
    var timeForm = document.getElementById("timeForm");

    var checkboxContainer = document.createElement("div");
    checkboxContainer.className = "checkbox-container";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "timeCheckbox";
    checkbox.value = newTime;

    var label = document.createElement("label");
    label.innerHTML = newTime;

    var image1 = document.createElement("img");
    image1.src = "up-click.png";
    image1.alt = "up";
    image1.addEventListener("click", function() {
        // 이미지 클릭 시, 체크박스와 라벨과 형제 요소와 교체
        var sibling = checkboxContainer.previousElementSibling;
        if (sibling) {
            sibling.parentNode.insertBefore(checkboxContainer, sibling);
        }
    });

    var image2 = document.createElement("img");
    image2.src = "down-click.png";
    image2.alt = "down";
    image2.addEventListener("click", function() {
        // 이미지 클릭 시, 체크박스와 라벨과 앞의 형제 요소와 교체
        var sibling = checkboxContainer.nextElementSibling;
        if (sibling) {
            sibling.parentNode.insertBefore(sibling, checkboxContainer);
        }
    });

    checkboxContainer.appendChild(image1);
    checkboxContainer.appendChild(image2);
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    timeForm.appendChild(checkboxContainer);
}

function removeTime() {
    // 선택된 체크박스의 값을 가져와서 배열에서 제거
    var checkboxes = document.querySelectorAll('input[name="timeCheckbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        var selectedValue = checkbox.value;
        var index = times.indexOf(selectedValue);
        if (index !== -1) {
            times.splice(index, 1);
        }
    });

    // 시간을 표시할 요소와 체크박스 초기화
    var timeForm = document.getElementById("timeForm");
    timeForm.innerHTML = "";

    // 배열의 내용을 다시 표시
    // 남아있는 시간에 대해 체크박스와 이미지 재생성
    for (var i = 0; i < times.length; i++) {
        var checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "timeCheckbox";
        checkbox.value = times[i];

        var label = document.createElement("label");
        label.innerHTML = times[i];

        var image1 = document.createElement("img");
        image1.src = "up-click.png";
        image1.alt = "up";
        image1.addEventListener("click", function() {
            // 이미지 클릭 시, 체크박스와 라벨과 형제 요소와 교체
            var sibling = checkboxContainer.previousElementSibling;
            if (sibling) {
                sibling.parentNode.insertBefore(checkboxContainer, sibling);
            }
        });

        var image2 = document.createElement("img");
        image2.src = "down-click.png";
        image2.alt = "down";
        image2.addEventListener("click", function() {
            // 이미지 클릭 시, 체크박스와 라벨과 앞의 형제 요소와 교체
            var sibling = checkboxContainer.nextElementSibling;
            if (sibling) {
                sibling.parentNode.insertBefore(sibling, checkboxContainer);
            }
        });
    

        checkboxContainer.appendChild(image1);
        checkboxContainer.appendChild(image2);
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        timeForm.appendChild(checkboxContainer);
    }
}
