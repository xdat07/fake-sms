const video = document.getElementById("qrVideo");
const scanStatus = document.getElementById("scanStatus");
const statusBox = document.getElementById("statusBox");

let cameraStream = null;
let scanning = true;


/* =========================
   MỞ CAMERA
========================= */

async function startCamera() {

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        scanStatus.textContent =
            "Trình duyệt không hỗ trợ camera.";

        return;
    }


    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });


        video.srcObject = cameraStream;

        await video.play();


        scanStatus.textContent =
            "Đưa mã QR vào trong khung.";


        startQRScanner();

    }

    catch (error) {

        console.error(error);

        scanStatus.textContent =
            "Không thể mở camera. Hãy cấp quyền Camera.";

    }

}


/* =========================
   QUÉT QR
========================= */

async function startQRScanner() {

    /* Kiểm tra trình duyệt */

    if (!("BarcodeDetector" in window)) {

        scanStatus.textContent =
            "Trình duyệt này chưa hỗ trợ quét QR.";

        return;
    }


    const detector =
        new BarcodeDetector({
            formats: ["qr_code"]
        });


    async function scan() {

        if (!scanning) {
            return;
        }


        try {

            if (video.readyState >= 2) {

                const codes =
                    await detector.detect(video);


                if (codes.length > 0) {

                    const qrContent =
                        codes[0].rawValue;


                    QRDetected(qrContent);

                    return;
                }

            }

        }

        catch (error) {

            console.error(
                "Lỗi đọc QR:",
                error
            );

        }


        requestAnimationFrame(scan);

    }


    scan();

}


/* =========================
   KHI ĐỌC ĐƯỢC QR
========================= */

function QRDetected(qrContent) {

    scanning = false;


    console.log(
        "QR:",
        qrContent
    );


    scanStatus.textContent =
        "Đã nhận diện mã QR.";


    statusBox.textContent =
        "Đang kiểm tra vị trí...";


    /* Tắt camera */

    stopCamera();


    /* Sau khi đọc QR -> kiểm tra GPS */

    getLocation(qrContent);

}


/* =========================
   TẮT CAMERA
========================= */

function stopCamera() {

    if (!cameraStream) {
        return;
    }


    cameraStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });


    cameraStream = null;

}

/* =========================
   TÍNH KHOẢNG CÁCH GPS
========================= */

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371000; // bán kính Trái Đất (mét)

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}
/* =========================
   LẤY VỊ TRÍ GPS
========================= */

function getLocation(qrContent) {

    let eventData;

    try {

        eventData = JSON.parse(qrContent);

        if (
            !eventData.eventName ||
            typeof eventData.latitude !== "number" ||
            typeof eventData.longitude !== "number" ||
            typeof eventData.radius !== "number" ||
            typeof eventData.points !== "number"
        ) {
            throw new Error("QR không hợp lệ");
        }

    } catch (error) {

        statusBox.textContent =
            "Mã QR này không phải mã check-in sự kiện hợp lệ.";

        return;
    }


    if (!navigator.geolocation) {

        statusBox.textContent =
            "Thiết bị không hỗ trợ định vị.";

        return;
    }


    statusBox.textContent =
        "Đang lấy vị trí của bạn...";


    navigator.geolocation.getCurrentPosition(

        /* THÀNH CÔNG */

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );

            console.log(
                "Accuracy:",
                accuracy,
                "m"
            );


            /* Chuẩn bị dữ liệu gửi Java */

            const checkinData = {

                qrToken: qrContent,

                latitude: latitude,

                longitude: longitude,

                accuracy: accuracy

            };


            console.log(
                "Dữ liệu check-in:",
                checkinData
            );


            const distance = calculateDistance(
    latitude,
    longitude,
    eventData.latitude,
    eventData.longitude
);

console.log(
    "Khoảng cách tới sự kiện:",
    distance,
    "m"
);


if (distance <= eventData.radius) {
     let volunteerScore =
        Number(localStorage.getItem("volunteerScore")) || 0;

    volunteerScore += Number(eventData.points);

    localStorage.setItem(
        "volunteerScore",
        volunteerScore
    );

    statusBox.innerHTML =
        `✅ Check-in <strong>${eventData.eventName}</strong> thành công!<br>` +
        `🎉 +${eventData.points} điểm Tình nguyện<br>` +
        `⭐ Tổng điểm Tình nguyện: ${volunteerScore}`;

} else {

    statusBox.textContent =
        `❌ Check-in thất bại. ` +
        `Bạn cách địa điểm sự kiện ${Math.round(distance)}m. ` +
        `Phạm vi cho phép là ${eventData.radius}m.`;

}

            /*
                BƯỚC SAU:

                sendToServer(checkinData);

                Hàm này sẽ gửi dữ liệu
                sang Java Spring Boot.
            */

        },


        /* THẤT BẠI */

        function (error) {

            console.error(
                "GPS error:",
                error
            );


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    statusBox.textContent =
                        "Bạn phải cho phép truy cập vị trí.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    statusBox.textContent =
                        "Không xác định được vị trí.";

                    break;


                case error.TIMEOUT:

                    statusBox.textContent =
                        "Lấy vị trí quá lâu. Hãy thử lại.";

                    break;


                default:

                    statusBox.textContent =
                        "Không thể lấy vị trí.";

            }

        },


        /* CẤU HÌNH GPS */

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


/* =========================
   KHỞI ĐỘNG
========================= */

startCamera();