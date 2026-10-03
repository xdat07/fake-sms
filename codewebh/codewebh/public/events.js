const username =
        localStorage.getItem("loggedInUser") ||
        sessionStorage.getItem("loggedInUser");

    if (username) {
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("studentAccount").style.display = "inline-block";
        document.getElementById("studentName").textContent = username;
    } else {
        document.getElementById("loginLink").style.display = "inline-block";
        document.getElementById("studentAccount").style.display = "none";
    }