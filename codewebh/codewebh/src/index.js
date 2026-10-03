export default {
    async fetch(request, env) {

        const url = new URL(request.url);


        /* ==============================
           TEST DATABASE
        ============================== */

        if (
            url.pathname === "/api/test-db" &&
            request.method === "GET"
        ) {
            try {

                const result = await env.DB
                    .prepare(`
                        SELECT id, username, email, created_at
                        FROM users
                    `)
                    .all();

                return json({
                    success: true,
                    message: "Kết nối D1 thành công",
                    users: result.results
                });

            } catch (error) {

                return json({
                    success: false,
                    error: error.message
                }, 500);
            }
        }


        /* ==============================
           REGISTER
        ============================== */

        if (
            url.pathname === "/api/register" &&
            request.method === "POST"
        ) {
            try {

                const body = await request.json();

                const username =
                    String(body.username || "").trim();

                const email =
                    String(body.email || "")
                        .trim()
                        .toLowerCase();

                const password =
                    String(body.password || "");


                /* ---------- VALIDATE ---------- */

                if (username.length < 3) {

                    return json({
                        success: false,
                        message:
                            "Tên người dùng phải có ít nhất 3 ký tự."
                    }, 400);
                }


                if (!email.includes("@")) {

                    return json({
                        success: false,
                        message: "Email không hợp lệ."
                    }, 400);
                }


                if (password.length < 6) {

                    return json({
                        success: false,
                        message:
                            "Mật khẩu phải có ít nhất 6 ký tự."
                    }, 400);
                }


                /* ---------- CHECK DUPLICATE ---------- */

                const existing = await env.DB
                    .prepare(`
                        SELECT id
                        FROM users
                        WHERE username = ?
                           OR email = ?
                        LIMIT 1
                    `)
                    .bind(username, email)
                    .first();


                if (existing) {

                    return json({
                        success: false,
                        message:
                            "Tên người dùng hoặc email đã tồn tại."
                    }, 409);
                }


                /* ---------- HASH PASSWORD ---------- */

                const passwordHash =
                    await hashPassword(password);


                /* ---------- INSERT USER ---------- */

                await env.DB
                    .prepare(`
                        INSERT INTO users
                        (username, email, password_hash)
                        VALUES (?, ?, ?)
                    `)
                    .bind(
                        username,
                        email,
                        passwordHash
                    )
                    .run();


                /* ---------- CREATE PROFILE ---------- */

                await env.DB
                    .prepare(`
                        INSERT INTO profiles (username)
                        VALUES (?)
                    `)
                    .bind(username)
                    .run();


                return json({
                    success: true,
                    message: "Đăng ký thành công.",
                    username: username
                });


            } catch (error) {

                return json({
                    success: false,
                    message:
                        "Không thể đăng ký tài khoản.",
                    error: error.message
                }, 500);
            }
        }


        /* ==============================
           LOGIN
        ============================== */

        if (
            url.pathname === "/api/login" &&
            request.method === "POST"
        ) {
            try {

                const body = await request.json();

                const usernameOrEmail =
                    String(
                        body.usernameOrEmail || ""
                    ).trim();

                const password =
                    String(body.password || "");


                const account = await env.DB
                    .prepare(`
                        SELECT
                            id,
                            username,
                            email,
                            password_hash
                        FROM users
                        WHERE username = ?
                           OR email = ?
                        LIMIT 1
                    `)
                    .bind(
                        usernameOrEmail,
                        usernameOrEmail.toLowerCase()
                    )
                    .first();


                if (!account) {

                    return json({
                        success: false,
                        message:
                            "Tên đăng nhập hoặc mật khẩu không đúng."
                    }, 401);
                }


                const passwordHash =
                    await hashPassword(password);


                if (
                    passwordHash !==
                    account.password_hash
                ) {

                    return json({
                        success: false,
                        message:
                            "Tên đăng nhập hoặc mật khẩu không đúng."
                    }, 401);
                }


                return json({
                    success: true,
                    message:
                        "Đăng nhập thành công.",
                    username:
                        account.username
                });


            } catch (error) {

                return json({
                    success: false,
                    message:
                        "Không thể đăng nhập.",
                    error: error.message
                }, 500);
            }
        }


        /* =========================================
           GET PROFILE
        ========================================= */

        if (
            url.pathname === "/api/profile" &&
            request.method === "GET"
        ) {
            try {

                const username =
                    url.searchParams.get("username");


                if (!username) {

                    return json({
                        success: false,
                        message: "Thiếu username."
                    }, 400);
                }


                 const profile = await env.DB
    .prepare(`
        SELECT
            username,

            full_name,
            birth_date,
            student_id,
            email,
            address,

            faculty,
            student_class,
            introduction,

            medal_count,
            event_count,

            training_score,
            academic_score,
            sport_score,
            skill_score,
            volunteer_score,
            art_score,

            goal_training,
            goal_academic,
            goal_sport,
            goal_skill,
            goal_volunteer,
            goal_art

        FROM profiles

        WHERE username = ?

        LIMIT 1
    `)
    .bind(username)
    .first();

                if (!profile) {

                    return json({
                        success: false,
                        message:
                            "Không tìm thấy hồ sơ."
                    }, 404);
                }


                return json({
                    success: true,
                    profile: profile
                });


            } catch (error) {

                return json({
                    success: false,
                    message:
                        "Không thể tải hồ sơ.",
                    error: error.message
                }, 500);
            }
        }


        /* =========================================
           UPDATE PROFILE
        ========================================= */

        if (
            url.pathname === "/api/profile" &&
            request.method === "PUT"
        ) {
            try {

                const body =
                    await request.json();

                const username =
                    String(
                        body.username || ""
                    ).trim();


                if (!username) {

                    return json({
                        success: false,
                        message: "Thiếu username."
                    }, 400);
                }


               await env.DB
    .prepare(`
        UPDATE profiles

        SET
            full_name = ?,
            birth_date = ?,
            student_id = ?,
            email = ?,
            address = ?,
            faculty = ?,
            student_class = ?,
            introduction = ?,
            updated_at = CURRENT_TIMESTAMP

        WHERE username = ?
    `)
    .bind(
        body.fullName || "",
        body.birthDate || "",
        body.studentId || "",
        body.email || "",
        body.address || "",
        body.faculty || "",
        body.studentClass || "",
        body.introduction || "",
        username
    )
    .run();
                    


                return json({
                    success: true,
                    message:
                        "Cập nhật hồ sơ thành công."
                });


            } catch (error) {

                return json({
                    success: false,
                    message:
                        "Không thể cập nhật hồ sơ.",
                    error: error.message
                }, 500);
            }
        }


        /* =========================================
           UPDATE ACHIEVEMENTS
        ========================================= */

        if (
            url.pathname === "/api/achievements" &&
            request.method === "PUT"
        ) {
            try {

                const body =
                    await request.json();

                const username =
                    String(
                        body.username || ""
                    ).trim();


                if (!username) {

                    return json({
                        success: false,
                        message: "Thiếu username."
                    }, 400);
                }


                await env.DB
                    .prepare(`
                        UPDATE profiles

                        SET
                            medal_count = ?,
                            event_count = ?,

                            training_score = ?,
                            academic_score = ?,
                            sport_score = ?,
                            skill_score = ?,
                            volunteer_score = ?,
                            art_score = ?,

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE username = ?
                    `)
                    .bind(
                        Number(body.medalCount) || 0,
                        Number(body.eventCount) || 0,

                        Number(body.trainingScore) || 0,
                        Number(body.academicScore) || 0,
                        Number(body.sportScore) || 0,
                        Number(body.skillScore) || 0,
                        Number(body.volunteerScore) || 0,
                        Number(body.artScore) || 0,

                        username
                    )
                    .run();


                return json({
                    success: true,
                    message:
                        "Cập nhật thành tích thành công."
                });


            } catch (error) {

                return json({
                    success: false,
                    message:
                        "Không thể cập nhật thành tích.",
                    error: error.message
                }, 500);
            }
        }


        /* =========================================
           UPDATE GOALS
        ========================================= */

        if (
            url.pathname === "/api/goals" &&
            request.method === "PUT"
        ) {
            try {

                const body =
                    await request.json();

                const username =
                    String(
                        body.username || ""
                    ).trim();


                if (!username) {

                    return json({
                        success: false,
                        message: "Thiếu username."
                    }, 400);
                }


                await env.DB
                    .prepare(`
                        UPDATE profiles

                        SET
                            goal_training = ?,
                            goal_academic = ?,
                            goal_sport = ?,
                            goal_skill = ?,
                            goal_volunteer = ?,
                            goal_art = ?,

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE username = ?
                    `)
                    .bind(
                        Number(body.training) || 0,
                        Number(body.academic) || 0,
                        Number(body.sport) || 0,
                        Number(body.skill) || 0,
                        Number(body.volunteer) || 0,
                        Number(body.art) || 0,

                        username
                    )
                    .run();


                return json({
                    success: true,
                    message:
                        "Cập nhật mục tiêu thành công."
                });


            } catch (error) {

                return json({
                    success: false,
                    message:
                        "Không thể cập nhật mục tiêu.",
                    error: error.message
                }, 500);
            }
        }

    /* =========================================
   CHECK-IN SỰ KIỆN
========================================= */

if (
    url.pathname === "/api/checkin" &&
    request.method === "POST"
) {
    try {

        const body = await request.json();

        const username =
            String(body.username || "").trim();

        const points =
            Number(body.points) || 0;


        if (!username) {

            return json({
                success: false,
                message: "Chưa đăng nhập."
            }, 400);
        }


        if (points <= 0) {

            return json({
                success: false,
                message: "Điểm check-in không hợp lệ."
            }, 400);
        }


        await env.DB
            .prepare(`
                UPDATE profiles

                SET
                    volunteer_score =
                        volunteer_score + ?,

                    event_count =
                        event_count + 1,

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE username = ?
            `)
            .bind(
                points,
                username
            )
            .run();


        const profile =
            await env.DB
                .prepare(`
                    SELECT
                        volunteer_score,
                        event_count

                    FROM profiles

                    WHERE username = ?

                    LIMIT 1
                `)
                .bind(username)
                .first();


        if (!profile) {

            return json({
                success: false,
                message: "Không tìm thấy tài khoản."
            }, 404);
        }


        return json({

            success: true,

            message:
                "Check-in thành công.",

            volunteerScore:
                profile.volunteer_score,

            eventCount:
                profile.event_count
        });


    } catch (error) {

        return json({

            success: false,

            message:
                "Không thể check-in.",

            error:
                error.message

        }, 500);
    }
}
        /* ==============================
           STATIC WEBSITE
        ============================== */

        return env.ASSETS.fetch(request);
    }
};


/* =========================================
   JSON RESPONSE
========================================= */

function json(data, status = 200) {

    return new Response(
        JSON.stringify(data),
        {
            status: status,

            headers: {
                "Content-Type":
                    "application/json; charset=UTF-8"
            }
        }
    );
}


/* =========================================
   PASSWORD HASH
========================================= */

async function hashPassword(password) {

    const data =
        new TextEncoder().encode(password);

    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    return Array.from(
        new Uint8Array(hash)
    )
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}