window.addEventListener('load', function(){
    //タイマー設定コード
    let timerSlider = document.getElementById("timer_slider");
    let timerValue = document.getElementById("timer_value");
    let rangeValue = function(ipt, spn){
        return function(){
            spn.textContent = "タイマー秒数:" + ipt.value;
        };
    };
    timerSlider.addEventListener("input", rangeValue(timerSlider, timerValue));
});

//カメラ起動コード

const cameraWidth = 350;
const cameraHeight = 350;
const cameraWidthMobile = 200;
const cameraHeightMobile = 200;
//スマホからの閲覧か
const isMobile = navigator.userAgent.match(/iPhone|Android/);

const cameraInitSmartphoneSupport = () => {
    const video = document.getElementById("camera");
    const cameraSetting = {
        audio: false,
        video: {
            width: isMobile ? cameraWidthMobile : cameraWidth,
            height: isMobile ? cameraHeightMobile: cameraHeight,
            facingMode: "environment",
        }
    }

    navigator.mediaDevices.getUserMedia(cameraSetting)
        .then((mediaStream) => {
            video.srcObject = mediaStream;
        })
        .catch((err) => {
            console.log(err.toString());
        });
}

let okimono = new Array(999999);
let iftake = new Array(999999);

const Beep = (num) =>{
    if(iftake[num] == true){
        return 0;
    }
    if(window.navigator.vibrate){
        window.navigator.vibrate([400,200,400]);
    }else if(window.navigator.mozVibrate){
        window.navigator.mozVibrate([400,200,400]);
    }else if(window.navigator.webkitVibrate){
        window.navigator.webkitVibrate([400]);
    }
    audio = document.getElementById("beep_audio");
    audio.currentTime = 0;
    audio.play();
    let intervalID = setInterval(() => {
        alert("置物" + (num + 1) + "はちゃんと取りましたか？");
        clearInterval(intervalID)
    }, 1000);
}

const Timer = () => {
    const taker = document.getElementById("take");
    taker.disabled = null;
    let arrayNum = 0;
    while(okimono[arrayNum] == true){
        arrayNum++;
    }
    okimono[arrayNum] = true;
    const timerSlider = document.getElementById("timer_slider");
    const tlist = document.getElementById("timer_form")
    const tli = document.createElement("li");
    const num = document.getElementById("num_things");
    num.innerHTML = tlist.childElementCount + 1;
    tli.innerHTML = "置物" + (arrayNum + 1) + "を" + timerSlider.value + "秒後に通知します。";
    let intervalID = setInterval(() => {
        Beep(arrayNum);
        clearInterval(intervalID);
    }, timerSlider.value * 1000);
    tlist.prepend(tli);
}

const shoot = () => {
    const list = document.getElementById("picture_form");
    const li = document.createElement("li");
    //video要素
    const video = document.getElementById("camera");
    //canvas要素
    const canvas = document.createElement("canvas");
    //canvas要素の大きさを変更
    canvas.width = isMobile ? cameraWidthMobile : cameraWidth;
    canvas.height = isMobile ? cameraHeightMobile : cameraHeight;
    //描画用オブジェクトを取得
    const ctx = canvas.getContext("2d");
    //描画する
    ctx.drawImage(
        video,          // データソース 
        0,              // 描画開始x座標  
        0,              // 描画開始y座標
        cameraWidth,    // 描画横サイズ
        cameraHeight    // 描画縦サイズ
    );
    li.appendChild(canvas);
    list.prepend(li);
    Timer();
}

const Take = () =>{
    const taker = document.getElementById("take");
    let arrayNum = 0;
    while(iftake[arrayNum] == true){
        arrayNum++;
    }
    iftake[arrayNum] = true;
    const pictures = document.getElementById("picture_form");
    const tlist = document.getElementById("timer_form");
    pictures.lastElementChild.remove();
    tlist.lastElementChild.remove();
    const num = document.getElementById("num_things");
    num.innerHTML -= 1;
    if(num.innerHTML == 0) taker.disabled = "disabled";
}

window.addEventListener('load', function(){
    const taker = document.getElementById("take");
    taker.disabled = "disabled";
    let timerSlider = document.getElementById("timer_slider");
    timerSlider.addEventListener("input", cameraInitSmartphoneSupport());
})
