const username =
    localStorage.getItem("loggedInUser") ||
    sessionStorage.getItem("loggedInUser");

const CENTER_POINTS =
    "250,250 250,250 250,250 250,250 250,250 250,250";


// =============================
// CHƯA ĐĂNG NHẬP
// =============================

if (!username) {

    document.getElementById("loginLink").style.display =
        "inline-block";

    document.getElementById("studentAccount").style.display =
        "none";

} else {

    // =============================
    // HEADER
    // =============================

    document.getElementById("loginLink").style.display =
        "none";

    document.getElementById("studentAccount").style.display =
        "inline-block";

    document.getElementById("studentNameHeader").textContent =
        username;


    // =============================
    // LOAD PROFILE TỪ D1
    // =============================

    loadProfile();
}


// ==================================================
// HÀM TÍNH TỌA ĐỘ RADAR
// ==================================================

function createRadarPoints(values) {

    const centerX = 250;
    const centerY = 250;
    const maxRadius = 180;

    const angles = [
        -90,
        -30,
        30,
        90,
        150,
        210
    ];

    return values.map(function (value, index) {

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


// ==================================================
// LẤY TOÀN BỘ PROFILE TỪ SERVER
// ==================================================

async function loadProfile() {

    try {

        const response = await fetch(
            "/api/profile?username=" +
            encodeURIComponent(username)
        );

        const result =
            await response.json();


        if (!response.ok || !result.success) {

            console.error(
                "Không tải được profile:",
                result.message
            );

            return;
        }


        const p = result.profile;


        // =========================================
        // THÔNG TIN SINH VIÊN
        // =========================================

        document.getElementById(
            "studentFullName"
        ).textContent =
            p.full_name || "";


        document.getElementById(
            "studentFaculty"
        ).textContent =
            p.faculty || "Không";


        document.getElementById(
            "studentClass"
        ).textContent =
            p.student_class || "Không";


        const introText =
            document.querySelector(".intro-text");

        if (introText) {

            introText.textContent =
                p.introduction || "";
        }


        // =========================================
        // SỐ HUY HIỆU + SỰ KIỆN
        // =========================================

        document.getElementById(
            "medalCount"
        ).textContent =
            p.medal_count ?? 0;


        document.getElementById(
            "eventCount"
        ).textContent =
            p.event_count ?? 0;


        // =========================================
        // ĐIỂM THÀNH TÍCH
        // =========================================

        document.getElementById(
            "trainingScore"
        ).textContent =
            p.training_score ?? 0;


        document.getElementById(
            "academicScore"
        ).textContent =
            p.academic_score ?? 0;


        document.getElementById(
            "sportScore"
        ).textContent =
            p.sport_score ?? 0;


        document.getElementById(
            "skillScore"
        ).textContent =
            p.skill_score ?? 0;


        document.getElementById(
            "volunteerScore"
        ).textContent =
            p.volunteer_score ?? 0;


        document.getElementById(
            "artScore"
        ).textContent =
            p.art_score ?? 0;


        // =========================================
        // RADAR KỲ VỌNG
        // =========================================

        const expectedRadar =
            document.getElementById(
                "expectedRadar"
            );


        if (expectedRadar) {

            const goalValues = [

                p.goal_training ?? 0,

                p.goal_academic ?? 0,

                p.goal_sport ?? 0,

                p.goal_skill ?? 0,

                p.goal_volunteer ?? 0,

                p.goal_art ?? 0
            ];


            expectedRadar.setAttribute(
                "points",
                createRadarPoints(goalValues)
            );
        }


        // =========================================
        // RADAR ĐẠT ĐƯỢC
        // =========================================

        const actualRadar =
            document.getElementById(
                "actualRadar"
            );


        if (actualRadar) {

            const actualValues = [

                p.training_score ?? 0,

                p.academic_score ?? 0,

                p.sport_score ?? 0,

                p.skill_score ?? 0,

                p.volunteer_score ?? 0,

                p.art_score ?? 0
            ];


            actualRadar.setAttribute(
                "points",
                createRadarPoints(actualValues)
            );
        }


    } catch (error) {

        console.error(
            "Lỗi kết nối server:",
            error
        );
    }
}