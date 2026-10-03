const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


/* =========================
   DRAWER
========================= */

const drawer = $('#drawer');

$('#hamb').onclick = () => drawer.classList.add('open');

$('#closeDrawer').onclick = () => drawer.classList.remove('open');

$$('.drawer a').forEach(a => {
    a.onclick = () => drawer.classList.remove('open');
});


/* =========================
   EVENT FILTER
========================= */

$$('.filter').forEach(btn => {

    btn.onclick = () => {

        $$('.filter').forEach(x => {
            x.classList.remove('active');
        });

        btn.classList.add('active');

        const f = btn.dataset.filter;

        $$('.event').forEach(card => {

            card.style.display =
                (f === 'all' || card.dataset.status === f)
                    ? 'grid'
                    : 'none';

        });

    };

});


/* =========================
   FEATURE EVENT SLIDER
========================= */

const featureTrack = $('#featureTrack');
const featureSlides = featureTrack.querySelectorAll('.feature');

const featurePrev = $('#featurePrev');
const featureNext = $('#featureNext');

let featureIndex = 0;

if (featureSlides.length > 0) {
    featureSlides[0].classList.add('active');
}

function showFeature(index) {

    if (index < 0) {
        featureIndex = featureSlides.length - 1;
    }
    else if (index >= featureSlides.length) {
        featureIndex = 0;
    }
    else {
        featureIndex = index;
    }

    featureTrack.scrollTo({
        left: featureTrack.clientWidth * featureIndex,
        behavior: 'smooth'
    });
}

featurePrev.onclick = () => {
    showFeature(featureIndex - 1);
};

featureNext.onclick = () => {
    showFeature(featureIndex + 1);
};


/* =========================
   QUICK SCROLL
========================= */

$$('[data-scroll]').forEach(b => {

    b.onclick = () => {

        const target =
            document.getElementById(b.dataset.scroll);

        if (target) {

            target.scrollIntoView({
                behavior: 'smooth'
            });

        }

    };

});


/* ==================================================
   LOGIN / REGISTER SYSTEM
================================================== */

const authOverlay = $('#authOverlay');
const authClose = $('#authClose');

const loginForm = $('#loginForm');
const registerForm = $('#registerForm');

const accountArea = $('#accountArea');


/* ---------- OPEN LOGIN ---------- */

$('#loginButton').onclick = () => {

    const savedUser =
        JSON.parse(
            localStorage.getItem('studentAccount')
        );

    if (savedUser) {
        showUserMenu();
    }
    else {
        openAuth('login');
    }

};


/* ---------- OPEN REGISTER ---------- */

$('#registerButton').onclick = () => {

    const savedUser =
        JSON.parse(
            localStorage.getItem('studentAccount')
        );

    if (savedUser) {
        showUserMenu();
    }
    else {
        openAuth('register');
    }

};


/* ---------- OPEN AUTH ---------- */

function openAuth(type = 'login') {

    authOverlay.classList.add('open');

    $('#loginError').textContent = '';
    $('#registerError').textContent = '';

    if (type === 'register') {

        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');

    }
    else {

        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');

    }

}


/* ---------- CLOSE AUTH ---------- */

authClose.onclick = () => {
    authOverlay.classList.remove('open');
};


/* ---------- CLICK OUTSIDE ---------- */

authOverlay.onclick = e => {

    if (e.target === authOverlay) {
        authOverlay.classList.remove('open');
    }

};


/* ---------- LOGIN -> REGISTER ---------- */

$('#showRegister').onclick = () => {

    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');

    $('#registerError').textContent = '';

};


/* ---------- REGISTER -> LOGIN ---------- */

$('#showLogin').onclick = () => {

    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');

    $('#loginError').textContent = '';

};


/* ==================================================
   REGISTER
================================================== */

$('#registerSubmit').onclick = () => {

    const username =
        $('#registerUsername').value.trim();

    const email =
        $('#registerEmail').value.trim();

    const password =
        $('#registerPassword').value;

    const confirm =
        $('#registerConfirm').value;

    const error =
        $('#registerError');

    error.textContent = '';


    /* ---------- VALIDATE USERNAME ---------- */

    if (!username) {

        error.textContent =
            'Vui lòng nhập tên người dùng.';

        return;
    }

    if (username.length < 3) {

        error.textContent =
            'Tên người dùng phải có ít nhất 3 ký tự.';

        return;
    }


    /* ---------- VALIDATE EMAIL ---------- */

    if (!email) {

        error.textContent =
            'Vui lòng nhập email.';

        return;
    }

    if (!email.includes('@')) {

        error.textContent =
            'Email không hợp lệ.';

        return;
    }


    /* ---------- VALIDATE PASSWORD ---------- */

    if (password.length < 6) {

        error.textContent =
            'Mật khẩu phải có ít nhất 6 ký tự.';

        return;
    }

    if (password !== confirm) {

        error.textContent =
            'Mật khẩu nhập lại không khớp.';

        return;
    }


    /* ---------- SAVE ACCOUNT ---------- */

    const account = {
        username: username,
        email: email,
        password: password
    };

    localStorage.setItem(
        'studentAccount',
        JSON.stringify(account)
    );


    /*
       Đăng ký xong thì đăng nhập ngay,
       nhưng chỉ giữ trong phiên hiện tại.
    */

    sessionStorage.setItem(
        'loggedInUser',
        username
    );

    localStorage.removeItem(
        'loggedInUser'
    );


    /* ---------- CLOSE REGISTER ---------- */

    authOverlay.classList.remove('open');


    /* ---------- UPDATE HEADER ---------- */

    renderAccount();


    /* ---------- CLEAR FORM ---------- */

    $('#registerUsername').value = '';
    $('#registerEmail').value = '';
    $('#registerPassword').value = '';
    $('#registerConfirm').value = '';

};


/* ==================================================
   LOGIN
================================================== */

function login() {

    const usernameOrEmail =
        $('#loginUsername').value.trim();

    const password =
        $('#loginPassword').value;

    const error =
        $('#loginError');

    error.textContent = '';


    const account =
        JSON.parse(
            localStorage.getItem('studentAccount')
        );


    /* ---------- ACCOUNT NOT FOUND ---------- */

    if (!account) {

        error.textContent =
            'Chưa có tài khoản. Hãy đăng ký trước.';

        return;
    }


    /* ---------- CHECK USERNAME / EMAIL ---------- */

    const correctUser =
        usernameOrEmail === account.username ||
        usernameOrEmail === account.email;


    /* ---------- CHECK PASSWORD ---------- */

    if (!correctUser ||
        password !== account.password) {

        error.textContent =
            'Tên đăng nhập hoặc mật khẩu không đúng.';

        return;
    }


    /* ==================================================
       REMEMBER LOGIN
    ================================================== */

    const rememberCheckbox =
        $('#rememberLogin');

    const rememberLogin =
        rememberCheckbox
            ? rememberCheckbox.checked
            : false;


    /*
       Có tick "Ghi nhớ đăng nhập"
       -> lưu bằng localStorage
       -> đóng trình duyệt rồi mở lại vẫn đăng nhập.
    */

    if (rememberLogin) {

        localStorage.setItem(
            'loggedInUser',
            account.username
        );

        sessionStorage.removeItem(
            'loggedInUser'
        );

    }

    /*
       Không tick
       -> lưu bằng sessionStorage
       -> refresh vẫn còn đăng nhập
       -> đóng phiên trình duyệt thì mất.
    */

    else {

        sessionStorage.setItem(
            'loggedInUser',
            account.username
        );

        localStorage.removeItem(
            'loggedInUser'
        );

    }


    /* ---------- CLOSE LOGIN ---------- */

    authOverlay.classList.remove('open');


    /* ---------- UPDATE ACCOUNT AREA ---------- */

    renderAccount();


    /* ---------- CLEAR LOGIN FORM ---------- */

    $('#loginUsername').value = '';
    $('#loginPassword').value = '';

}


/* ---------- BẤM NÚT ĐĂNG NHẬP ---------- */

$('#loginSubmit').onclick = login;


/* ==================================================
   NHẤN ENTER ĐỂ ĐĂNG NHẬP
================================================== */

$('#loginPassword').addEventListener(
    'keydown',
    e => {

        if (e.key === 'Enter') {
            login();
        }

    }
);


/* ==================================================
   RENDER ACCOUNT
================================================== */

function renderAccount() {

    /*
       Ưu tiên tài khoản được ghi nhớ lâu dài.
       Nếu không có thì kiểm tra session hiện tại.
    */

    const username =
        localStorage.getItem('loggedInUser') ||
        sessionStorage.getItem('loggedInUser');


    /* ==================================================
       CHƯA ĐĂNG NHẬP
    ================================================== */

    if (!username) {

        accountArea.innerHTML = `

            <button
                id="loginButton"
                class="account-button"
            >

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-user preview-icon"
                >

                    <path
                        d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
                    />

                    <circle
                        cx="12"
                        cy="7"
                        r="4"
                    />

                </svg>

                <b>ĐĂNG NHẬP</b>

            </button>


            <button
                id="registerButton"
                class="account-button"
            >

                <b>ĐĂNG KÝ</b>

            </button>

        `;


        $('#loginButton').onclick = () => {
            openAuth('login');
        };


        $('#registerButton').onclick = () => {
            openAuth('register');
        };


        return;
    }


    /* ==================================================
       ĐÃ ĐĂNG NHẬP
    ================================================== */

    accountArea.innerHTML = `

        <div class="user-area">

            <button
                class="user-button"
                id="userButton"
            >

                <span class="user-avatar">

                    ${username.charAt(0).toUpperCase()}

                </span>

                <b>${username}</b>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-chevron-down preview-icon"
                >

                    <path d="m6 9 6 6 6-6"/>

                </svg>

            </button>


            <div
                class="user-menu"
                id="userMenu"
            >

                <button id="profileButton">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-user-round preview-icon"
                    >

                        <circle
                            cx="12"
                            cy="8"
                            r="5"
                        />

                        <path
                            d="M20 21a8 8 0 0 0-16 0"
                        />

                    </svg>

                    Thông tin tài khoản

                </button>


                <button id="logoutButton">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-log-in preview-icon"
                    >

                        <path d="m10 17 5-5-5-5"/>

                        <path d="M15 12H3"/>

                        <path
                            d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                        />

                    </svg>

                    Đăng xuất

                </button>

            </div>

        </div>

    `;


    /* ---------- OPEN USER MENU ---------- */

    $('#userButton').onclick = () => {

        $('#userMenu')
            .classList.toggle('open');

    };


    /* ---------- LOGOUT ---------- */

    $('#logoutButton').onclick = logout;


    /* ---------- PROFILE ---------- */

    $('#profileButton').onclick = () => {

        window.location.href =
            'profile.html';

    };

}


/* ==================================================
   USER MENU
================================================== */

function showUserMenu() {

    const menu =
        $('#userMenu');

    if (menu) {

        menu.classList.toggle(
            'open'
        );

    }

}


/* ==================================================
   LOGOUT
================================================== */

function logout() {

    /*
       Xóa cả 2 loại đăng nhập.
    */

    localStorage.removeItem(
        'loggedInUser'
    );

    sessionStorage.removeItem(
        'loggedInUser'
    );

    renderAccount();

}


/* ==================================================
   KEEP LOGIN AFTER REFRESH
================================================== */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        renderAccount();

    }
);


/* ==================================================
   COUNTDOWN
================================================== */

const eventDate =
    new Date(
        "2026-09-26T00:00:00"
    ).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        eventDate - now;


    if (distance <= 0) {

        $('#countDays').textContent =
            '00';

        $('#countHours').textContent =
            '00';

        $('#countMinutes').textContent =
            '00';

        return;

    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(

            (
                distance %
                (1000 * 60 * 60 * 24)
            ) /

            (1000 * 60 * 60)

        );


    const minutes =
        Math.floor(

            (
                distance %
                (1000 * 60 * 60)
            ) /

            (1000 * 60)

        );


    $('#countDays').textContent =
        String(days).padStart(
            2,
            '0'
        );


    $('#countHours').textContent =
        String(hours).padStart(
            2,
            '0'
        );


    $('#countMinutes').textContent =
        String(minutes).padStart(
            2,
            '0'
        );

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* ==================================================
   PROTECTED QUICK BUTTONS
================================================== */

const eventBtn =
    document.getElementById('eventBtn');

const checkinBtn =
    document.getElementById('checkinBtn');

const profileBtn =
    document.getElementById('profileBtn');

const loginPopup =
    document.getElementById('loginPopup');

const closeLoginPopup =
    document.getElementById('closeLoginPopup');


/* Kiểm tra người dùng đã đăng nhập chưa */

function isLoggedIn() {

    return (
        localStorage.getItem('loggedInUser') ||
        sessionStorage.getItem('loggedInUser')
    );

}


/* Hàm dùng chung cho các trang cần đăng nhập */

function protectedPage(url) {

    if (!isLoggedIn()) {

        if (loginPopup) {
            loginPopup.classList.add('show');
        }

        return;
    }

    window.location.href = url;
}


/* =========================
   SỰ KIỆN
========================= */

if (eventBtn) {

    eventBtn.addEventListener('click', function () {

        protectedPage('events.html');

    });

}


/* =========================
   CHECK IN
========================= */

if (checkinBtn) {

    checkinBtn.addEventListener('click', function () {

        protectedPage('checkin.html');

    });

}


/* =========================
   PROFILE
========================= */

if (profileBtn) {

    profileBtn.addEventListener('click', function () {

        protectedPage('profile.html');

    });

}


/* =========================
   ĐÓNG POPUP
========================= */

if (closeLoginPopup) {

    closeLoginPopup.addEventListener('click', function () {

        loginPopup.classList.remove('show');

    });

}


/* Click ra ngoài popup cũng đóng */

if (loginPopup) {

    loginPopup.addEventListener('click', function (event) {

        if (event.target === loginPopup) {

            loginPopup.classList.remove('show');

        }

    });

}
/* ==================================================
   CLOSE PROFILE LOGIN POPUP
================================================== */

if (closeLoginPopup) {

    closeLoginPopup.addEventListener(
        'click',
        function () {

            loginPopup.classList.remove(
                'show'
            );

        }
    );

}


/* ==================================================
   CLICK OUTSIDE POPUP TO CLOSE
================================================== */

if (loginPopup) {

    loginPopup.addEventListener(
        'click',
        function (event) {

            if (
                event.target === loginPopup
            ) {

                loginPopup.classList.remove(
                    'show'
                );

            }

        }
    );

}
