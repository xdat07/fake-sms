const username =
    localStorage.getItem("loggedInUser") ||
    sessionStorage.getItem("loggedInUser");

const CENTER_POINTS =
    "250,250 250,250 250,250 250,250 250,250 250,250";

if (username) {

    // =========================
    // HEADER
    // =========================

    document.getElementById("loginLink").style.display = "none";
    document.getElementById("studentAccount").style.display = "inline-block";
    document.getElementById("studentNameHeader").textContent = username;


    // =========================
    // LẤY DỮ LIỆU
    // =========================

    const profileDataRaw =
        localStorage.getItem("profileData_" + username);

    const achievementDataRaw =
        localStorage.getItem("achievementData_" + username);

    const goalDataRaw =
        localStorage.getItem("goalData_" + username);


    // =========================
    // THÔNG TIN SINH VIÊN
    // =========================

    if (!profileDataRaw) {

        document.getElementById("studentFullName").textContent = "";
        document.getElementById("studentFaculty").textContent = "Không";
        document.getElementById("studentClass").textContent = "Không";
        const introText =
            document.querySelector(".intro-text");

        if (introText) {
            introText.textContent = "";
        }

    } else {

        try {

            const profileData =
                JSON.parse(profileDataRaw);

            document.getElementById("studentFullName").textContent =
                profileData.fullName || "";
            document.getElementById("studentFaculty").textContent =
                profileData.faculty || "Không";    
            document.getElementById("studentClass").textContent =
                profileData.studentClass || "Không";

            // GIỚI THIỆU
            const introText =
                document.querySelector(".intro-text");

            if (introText) {
                introText.textContent =
                    profileData.introduction || "";
            }

        } catch (error) {

            console.error(
                "Không đọc được thông tin hồ sơ:",
                error
            );

            document.getElementById("studentFullName").textContent = "";
        }
    }


    // ==================================================
    // HÀM TÍNH TỌA ĐỘ MẠNG NHỆN TỪ GIÁ TRỊ 0 - 100
    // ==================================================

    function createRadarPoints(values) {

        const centerX = 250;
        const centerY = 250;

        // 100 = chạm vòng ngoài cùng
        const maxRadius = 180;

        /*
            Thứ tự 6 trục:

            1. Rèn luyện
            2. Học thuật
            3. Thể thao
            4. Kỹ năng
            5. Tình nguyện
            6. Nghệ thuật
        */

        const angles = [
            -90,
            -30,
            30,
            90,
            150,
            210
        ];

        return values.map(function (value, index) {

            // Giới hạn từ 0 đến 100
            const safeValue =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(value) || 0
                    )
                );

            const radius =
                maxRadius * (safeValue / 100);

            const angle =
                angles[index] * Math.PI / 180;

            const x =
                centerX +
                radius * Math.cos(angle);

            const y =
                centerY +
                radius * Math.sin(angle);

            return (
                x.toFixed(1) +
                "," +
                y.toFixed(1)
            );

        }).join(" ");
    }


    // =========================
    // RADAR KỲ VỌNG
    // =========================

    const expectedRadar =
        document.getElementById("expectedRadar");

    if (expectedRadar) {

        // Chưa nhập kỳ vọng
        if (!goalDataRaw) {

            expectedRadar.setAttribute(
                "points",
                CENTER_POINTS
            );

        } else {

            try {

                const goals =
                    JSON.parse(goalDataRaw);

                /*
                    Phải đúng thứ tự trục mạng nhện
                */

                const goalValues = [

                    goals.training || 0,

                    goals.academic || 0,

                    goals.sport || 0,

                    goals.skill || 0,

                    goals.volunteer || 0,

                    goals.art || 0
                ];

                const expectedPoints =
                    createRadarPoints(goalValues);

                expectedRadar.setAttribute(
                    "points",
                    expectedPoints
                );

            } catch (error) {

                console.error(
                    "Không đọc được dữ liệu kỳ vọng:",
                    error
                );

                expectedRadar.setAttribute(
                    "points",
                    CENTER_POINTS
                );
            }
        }
    }


    // =========================
    // THÀNH TÍCH ĐẠT ĐƯỢC
    // =========================

    const actualRadar =
        document.getElementById("actualRadar");

    if (!achievementDataRaw) {

        // Tài khoản mới = tất cả bằng 0

        document.getElementById("medalCount").textContent = "0";

        document.getElementById("eventCount").textContent = "0";


        document.getElementById("trainingScore").textContent = "0";

        document.getElementById("sportScore").textContent = "0";

        document.getElementById("volunteerScore").textContent = "0";

        document.getElementById("academicScore").textContent = "0";

        document.getElementById("skillScore").textContent = "0";

        document.getElementById("artScore").textContent = "0";


        if (actualRadar) {

            actualRadar.setAttribute(
                "points",
                CENTER_POINTS
            );
        }

    } else {

        try {

            const a =
                JSON.parse(achievementDataRaw);


            document.getElementById("medalCount").textContent =
                a.medalCount ?? 0;

            document.getElementById("eventCount").textContent =
                a.eventCount ?? 0;


            document.getElementById("trainingScore").textContent =
                a.trainingScore ?? 0;

            document.getElementById("sportScore").textContent =
                a.sportScore ?? 0;

            document.getElementById("volunteerScore").textContent =
                a.volunteerScore ?? 0;

            document.getElementById("academicScore").textContent =
                a.academicScore ?? 0;

            document.getElementById("skillScore").textContent =
                a.skillScore ?? 0;

            document.getElementById("artScore").textContent =
                a.artScore ?? 0;


            if (actualRadar) {

                actualRadar.setAttribute(
                    "points",
                    a.radarPoints || CENTER_POINTS
                );
            }

        } catch (error) {

            console.error(
                "Không đọc được dữ liệu thành tích:",
                error
            );

            if (actualRadar) {

                actualRadar.setAttribute(
                    "points",
                    CENTER_POINTS
                );
            }
        }
    }


} else {

    // =========================
    // CHƯA ĐĂNG NHẬP
    // =========================

    document.getElementById("loginLink").style.display =
        "inline-block";

    document.getElementById("studentAccount").style.display =
        "none";
}
function loadVolunteerScore() {

    const volunteerScore =
        Number(localStorage.getItem("volunteerScore")) || 0;

    const volunteerElement =
        document.getElementById("volunteerScore");

    if (volunteerElement) {
        volunteerElement.textContent = volunteerScore;
    }
}

loadVolunteerScore();