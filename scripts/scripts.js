window.onload = function () {
    document.getElementById("sign-up-in").onclick = function (e) {
        e.preventDefault();
        e.target.innerText = "Sign In";
        document.querySelectorAll('.register').forEach(function (element) {
            element.classList.add('register-hide');
        })
    };
}