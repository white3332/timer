let timer;
var timeLeftSec = 60 // 초
var countIndex = 1
var timerRunning = false;

// 핵심 // 타이머를 중지하거나 이어서 실행함
// (updateTimer, 10) <- 0.01 초에 1회 실행
function startStopTimer() {
    const button = document.getElementById('startStopButton');

    if (timerRunning) {
        clearInterval(timer);
        button.innerText = '이어서 시작';
    } else {
        if (timer == undefined || timer >= 1) {
            timer = setInterval(updateTimer, 100);
            button.innerText = '중지';
        }
    }

    timerRunning = !timerRunning;
}

// 타이머 시분초 표시 1초에 1번 반복하는 함수
function updateTimer() {
    
    if (timeLeftSec > 0) {
        // 타이머 실행중일 때
        timeLeftSec--;
        const hours = Math.floor(timeLeftSec / 3600);
        const minutes = Math.floor(timeLeftSec / 60);
        const seconds = timeLeftSec % 60;
        const displayTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('timer').innerText = displayTime;
        notificationAfterTimeDetection(displayTime);
        document.getElementById('startStopButton').disabled = false;
    } else if ((timeLeftSec <= 0) && (false)) {
        // 타이머 종료했을 때
        clearInterval(timer);
        document.getElementById('timer').innerText = '00:00:00';
        notificationAfterTimeDetection('00:00:00');
        document.getElementById('startStopButton').disabled = true;
    }
}

// 타이머 시간 초기화 및 재시작(이어서시작 X)
function restart() {
    // 시 분 초 세팅
    const lastElement = accumulateTimes[accumulateTimes.length - 1]; // 수정 필요
    const hours = Math.floor(lastElement / 3600);
    const minutes = Math.floor(lastElement / 60);
    const seconds = lastElement % 60;
    document.getElementById('timer').innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeLeftSec = lastElement
    countIndex = 1;
    // 타이머 작동 명령
    if (timerRunning) {
        // pass
    } else {
        startStopTimer()
    }
}

// 타이머 알람
function notificationAfterTimeDetection(displayTime) {
    // 경과된 시간이 배열에 입력된 시간과 일치하는지 확인하고 알림 출력
    const lastElementTime = accumulateTimes[accumulateTimes.length - 1];
    const elapseTime = lastElementTime - timeLeftSec;
    if (elapseTime >= accumulateTimes[countIndex - 1]) {
        openNotificationModal();
        countIndex ++;
    }
}

// 모달을 열기
function openEditModal() {
    const modalWrap = document.getElementById('modalWrap');
    modalWrap.style.display = 'block';
    timeFormReboot()
}
// 모달을 숨기기
function closeEditModal() {
    const modalWrap = document.getElementById('modalWrap');
    modalWrap.style.display = 'none';
}
// 모달을 열기
function openNotificationModal() {
    const modalWrap = document.getElementById('modalNotificationWrap');
    modalWrap.style.display = 'block';

    const accTimes = [];
    for (let i = 0; i < accumulateTimes.length; i++) {
        let seconds = accumulateTimes[i];
        let minutes = 0;
        let hours = 0;
        // 분, 초가 60을 초과할때
        if (seconds >= 60) {
            minutes = Math.floor(seconds / 60) + minutes;
            seconds = seconds % 60;
        }
        if (minutes >= 60) {
            hours = Math.floor(minutes / 60) + hours;
            minutes = minutes % 60;
        }

        // 시, 분, 초가 한 자리 숫자일 경우 앞에 0을 추가
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        accTimes.push(hours + ":" + minutes + ":" + seconds);
    }


    // 이전 시간을 입력
    const strTimeElement = document.getElementById('strTime');
    if (accTimes[countIndex -1] !== undefined && accTimes[countIndex -1] !== null && (countIndex -1 ) >= 0 ) {
        strTimeElement.innerText = accTimes[countIndex -1];
    } else {
        // 값이 존재하지 않으면 '시작' 출력
        strTimeElement.innerText = '시작';}

    // 현재 시간을 입력
    const curTimeElement= document.getElementById('curTime');
    if (accTimes[countIndex] !== undefined && accTimes[countIndex] !== null) {
        curTimeElement.innerText = accTimes[countIndex];
    } else {
        // 값이 존재하지 않으면 '시작' 출력
        curTimeElement.innerText = '끝';}

    // 끝 시간을 입력
    const endTimeElement = document.getElementById('endTime');
    if (accTimes[countIndex+1] !== undefined && accTimes[countIndex+1] !== null) {
        endTimeElement.innerText = accTimes[countIndex+1];
    } else {
        // 값이 존재하지 않으면 '끝' 출력
        endTimeElement.innerText = '끝';}
}


// 모달을 숨기기
function closeNotificationModal() {
    const modalWrap = document.getElementById('modalNotificationWrap');
    modalWrap.style.display = 'none';
}


// 서브 페이지
// 시간 조절 버튼 제어
function timeadjust(dir, timeinput) {
    // 방향키 눌러서 시간 -1 또는 +1
    // 시간 값 가져오기
    var currentValue = parseInt(document.getElementById(timeinput).value);
    // 값 감소 및 증가
    if (dir == 'left') { var newValue = currentValue - 1; }
    if (dir == 'right') { var newValue = currentValue + 1; }
    // 마이너스 값이면 0으로 변환
    if (currentValue < 0) { currentValue = 0 }
    // 값을 다시 입력 필드에 설정
    document.getElementById(timeinput).value = newValue;
}
// 시간을 저장할 배열
// 예시 ['00:05:00', '00:05:00', '00:05:00']
var times = ['00:00:30', '00:00:30'];
// 누적시간을 저장할 배열
// 메인 페이지에서 사용할 배열
// 예시 [300, 600, 900]
var accumulateTimes = [30, 60];

// 시간 단계를 추가함
function addTime() {
    // HH:mm:ss 형식으로 변환
    // in-sec, in-min, in-hour의 값을 가져오기
    var seconds = parseInt(document.getElementById("in-sec").value, 10);
    var minutes = parseInt(document.getElementById("in-min").value, 10);
    var hours = parseInt(document.getElementById("in-hour").value, 10);

    // 시, 분, 초가 마이너스 값일때
    if (seconds < 0) { seconds = 0 }
    if (minutes < 0) { minutes = 0 }
    if (hours < 0) { hours = 0 }

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
    accumulateTimes = [0];
    for (let i = 0; i < times.length; i++) {
        // 시, 분, 초를 초로 변환하여 더함
        let timeParts = times[i].split(":");
        let timeInSeconds = parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
        totalSeconds += timeInSeconds;
        accumulateTimes.push(totalSeconds);
    }

    // 시간을 표시할 요소와 체크박스 초기화
    timeFormReboot()
}

// 시간 단계를 삭제함
function removeTime() {
    // 선택된 체크박스의 값을 가져와서 배열에서 제거
    const checkboxes = document.querySelectorAll('input[name="timeCheckbox"]:checked');
    checkboxes.forEach(function (checkbox) {
        const selectedValue = checkbox.value;
        const index = times.indexOf(selectedValue);
        if (index !== -1) {
            times.splice(index, 1);
        }
    });

    // 모든 시간을 누적한 값 생성
    var totalSeconds = 0;
    // 누적시간을 저장할 배열
    accumulateTimes = [0];
    for (let i = 0; i < times.length; i++) {
        // 시, 분, 초를 초로 변환하여 더함
        let timeParts = times[i].split(":");
        let timeInSeconds = parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
        totalSeconds += timeInSeconds;
        accumulateTimes.push(totalSeconds);
    }

    // 시간을 표시할 요소와 체크박스 초기화
    timeFormReboot()
}

// 시간을 표시할 요소와 체크박스 초기화
function timeFormReboot() {
    var timeForm = document.getElementById("timeForm");
    timeForm.innerHTML = "";
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
        image1.addEventListener("click", function () {
            // 이미지 클릭 시, 체크박스와 라벨과 형제 요소와 교체
            var sibling = checkboxContainer.previousElementSibling;
            if (sibling) {
                sibling.parentNode.insertBefore(checkboxContainer, sibling);
            }
        });
        var image2 = document.createElement("img");
        image2.src = "down-click.png";
        image2.alt = "down";
        image2.addEventListener("click", function () {
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




// Function to fetch data
async function fetchData() {
    const id = document.getElementById('in-id').value;
    const data = { key: id };
  
    try {
      const response = await fetch('/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Data inserted:', result);
  
      // 여기에서 받은 데이터(result)를 원하는 대로 활용할 수 있습니다.
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }
  




// Function to save data
async function saveData() {
    // 데이터 객체를 만듭니다. 이 데이터는 서버로 전송될 것입니다.
    const id = document.getElementById('in-id').value;
    // id와 times 배열을 저장
    const data = { key: id, times: times }; // times 데이터를 객체에 추가

    // AJAX 요청을 보냅니다.
    fetch('/insertData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
      console.log('Data inserted:', result);
    })
    .catch(error => {
      console.error('Error inserting data:', error);
    });
  }
  
