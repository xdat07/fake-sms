
        const username =
    localStorage.getItem("loggedInUser") ||
    sessionStorage.getItem("loggedInUser");

// =============================
// KIỂM TRA ĐĂNG NHẬP
// =============================

if (!username) {
    window.location.href = "index.html";
}


const form =
    document.getElementById("updateProfileForm");


// =============================
// ĐỌC THÔNG TIN CŨ
// =============================

const oldProfile =
    localStorage.getItem("profileData_" + username);

if (oldProfile) {

    try {

        const data = JSON.parse(oldProfile);

        document.getElementById("fullName").value =
            data.fullName || "";

        document.getElementById("birthDate").value =
            data.birthDate || "";

        document.getElementById("address").value =
            data.address || "";

        document.getElementById("email").value =
            data.email || "";

        document.getElementById("studentClass").value =
            data.studentClass || "";

        document.getElementById("faculty").value =
            data.faculty || "";

        document.getElementById("studentId").value =
            data.studentId || "";

        document.getElementById("introduction").value =
            data.introduction || "";

    } catch (error) {

        console.error(
            "Không đọc được thông tin hồ sơ:",
            error
        );
    }
}


// =============================
// ĐỌC MỤC TIÊU CÁ NHÂN CŨ
// =============================

const oldGoals =
    localStorage.getItem("goalData_" + username);

if (oldGoals) {

    try {

        const goals =
            JSON.parse(oldGoals);

        document.getElementById("goalTraining").value =
            goals.training ?? "";

        document.getElementById("goalAcademic").value =
            goals.academic ?? "";

        document.getElementById("goalSport").value =
            goals.sport ?? "";

        document.getElementById("goalSkill").value =
            goals.skill ?? "";

        document.getElementById("goalVolunteer").value =
            goals.volunteer ?? "";

        document.getElementById("goalArt").value =
            goals.art ?? "";

    } catch (error) {

        console.error(
            "Không đọc được mục tiêu cá nhân:",
            error
        );
    }
}


// =============================
// LƯU THÔNG TIN
// =============================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // =============================
        // THÔNG TIN CÁ NHÂN
        // =============================

        const profileData = {

            fullName:
                document
                    .getElementById("fullName")
                    .value
                    .trim(),

            birthDate:
                document
                    .getElementById("birthDate")
                    .value,

            address:
                document
                    .getElementById("address")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            studentClass:
                document
                    .getElementById("studentClass")
                    .value
                    .trim(),

            faculty:
                document
                    .getElementById("faculty")
                    .value
                    .trim(),

            studentId:
                document
                    .getElementById("studentId")
                    .value
                    .trim(),

            introduction:
                document
                    .getElementById("introduction")
                    .value
                    .trim()
        };


        // =============================
        // MỤC TIÊU CÁ NHÂN
        // =============================

        const goalData = {

            training:
                Number(
                    document
                        .getElementById("goalTraining")
                        .value || 0
                ),

            academic:
                Number(
                    document
                        .getElementById("goalAcademic")
                        .value || 0
                ),

            sport:
                Number(
                    document
                        .getElementById("goalSport")
                        .value || 0
                ),

            skill:
                Number(
                    document
                        .getElementById("goalSkill")
                        .value || 0
                ),

            volunteer:
                Number(
                    document
                        .getElementById("goalVolunteer")
                        .value || 0
                ),

            art:
                Number(
                    document
                        .getElementById("goalArt")
                        .value || 0
                )
        };


        // =============================
        // LƯU MỤC TIÊU
        // =============================

        localStorage.setItem(
            "goalData_" + username,
            JSON.stringify(goalData)
        );


        // =============================
        // LƯU HỒ SƠ
        // =============================

        localStorage.setItem(
            "profileData_" + username,
            JSON.stringify(profileData)
        );


        // Đánh dấu đã hoàn thành hồ sơ

        localStorage.setItem(
            "profileCompleted_" + username,
            "true"
        );


        // =============================
        // HIỆN POPUP THÀNH CÔNG
        // =============================

        const successPopup =
            document.getElementById("successPopup");

        if (successPopup) {

            successPopup.classList.add("show");

        } else {

            // Nếu chưa thêm popup vào HTML
            // thì vẫn chuyển về Profile

            window.location.href =
                "profile.html";
        }
    }
);


// =============================
// NÚT OK CỦA POPUP
// =============================

const closeSuccessPopup =
    document.getElementById("closeSuccessPopup");

if (closeSuccessPopup) {

    closeSuccessPopup.addEventListener(
        "click",
        function () {

            document
                .getElementById("successPopup")
                .classList.remove("show");

            window.location.href =
                "profile.html";
        }
    );
}