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
// ĐỌC PROFILE TỪ SERVER / D1
// =============================

async function loadProfile() {

    try {

        const response = await fetch(
            "/api/profile?username=" +
            encodeURIComponent(username)
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            console.error(
                "Không tải được hồ sơ:",
                data.message
            );

            return;
        }

        const p = data.profile;


        // =============================
        // THÔNG TIN CÁ NHÂN
        // =============================

        document.getElementById("fullName").value =
            p.full_name || "";

        document.getElementById("birthDate").value =
            p.birth_date || "";

        document.getElementById("studentId").value =
            p.student_id || "";

        document.getElementById("email").value =
            p.email || "";

        document.getElementById("address").value =
            p.address || "";

        document.getElementById("studentClass").value =
            p.student_class || "";

        document.getElementById("faculty").value =
            p.faculty || "";

        document.getElementById("introduction").value =
            p.introduction || "";


        // =============================
        // MỤC TIÊU CÁ NHÂN
        // =============================

        document.getElementById("goalTraining").value =
            p.goal_training ?? "";

        document.getElementById("goalAcademic").value =
            p.goal_academic ?? "";

        document.getElementById("goalSport").value =
            p.goal_sport ?? "";

        document.getElementById("goalSkill").value =
            p.goal_skill ?? "";

        document.getElementById("goalVolunteer").value =
            p.goal_volunteer ?? "";

        document.getElementById("goalArt").value =
            p.goal_art ?? "";

    } catch (error) {

        console.error(
            "Lỗi kết nối server:",
            error
        );
    }
}


// =============================
// LƯU THÔNG TIN
// =============================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // =============================
        // THÔNG TIN CÁ NHÂN
        // =============================

        const profileData = {

            username: username,

            fullName:
                document
                    .getElementById("fullName")
                    .value
                    .trim(),

            birthDate:
                document
                    .getElementById("birthDate")
                    .value,

            studentId:
                document
                    .getElementById("studentId")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            address:
                document
                    .getElementById("address")
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

            username: username,

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


        try {

            // =============================
            // LƯU PROFILE VÀO D1
            // =============================

            const profileResponse =
                await fetch(
                    "/api/profile",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(profileData)
                    }
                );

            const profileResult =
                await profileResponse.json();


            if (
                !profileResponse.ok ||
                !profileResult.success
            ) {

                throw new Error(
                    profileResult.message ||
                    "Không thể lưu hồ sơ."
                );
            }


            // =============================
            // LƯU MỤC TIÊU VÀO D1
            // =============================

            const goalResponse =
                await fetch(
                    "/api/goals",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(goalData)
                    }
                );

            const goalResult =
                await goalResponse.json();


            if (
                !goalResponse.ok ||
                !goalResult.success
            ) {

                throw new Error(
                    goalResult.message ||
                    "Không thể lưu mục tiêu."
                );
            }


            // =============================
            // HIỆN POPUP THÀNH CÔNG
            // =============================

            const successPopup =
                document.getElementById(
                    "successPopup"
                );

            if (successPopup) {

                successPopup
                    .classList
                    .add("show");

            } else {

                window.location.href =
                    "profile.html";
            }

        } catch (error) {

            console.error(
                "Lỗi cập nhật:",
                error
            );

            alert(
                "Không thể cập nhật thông tin. Vui lòng thử lại."
            );
        }
    }
);


// =============================
// NÚT OK CỦA POPUP
// =============================

const closeSuccessPopup =
    document.getElementById(
        "closeSuccessPopup"
    );

if (closeSuccessPopup) {

    closeSuccessPopup.addEventListener(
        "click",
        function () {

            document
                .getElementById("successPopup")
                .classList
                .remove("show");

            window.location.href =
                "profile.html";
        }
    );
}


// =============================
// ĐIỀU KIỆN TUỔI 17 - 30
// =============================

const birthDate =
    document.getElementById("birthDate");

birthDate.addEventListener(
    "change",
    function () {

        const birthYear =
            new Date(this.value).getFullYear();

        const currentYear =
            new Date().getFullYear();

        const age =
            currentYear - birthYear;

        if (age < 17 || age > 30) {

            this.setCustomValidity(
                "Độ tuổi phải từ 17 đến 30."
            );

        } else {

            this.setCustomValidity("");
        }
    }
);


// =============================
// BẮT ĐẦU
// =============================

loadProfile();