window.onload = function () {
    let fullName = document.getElementById("full-name");
    fullName.onkeydown = function (e) {
        if (/\d/.test(e.key)) {
            return false;
        }
    }

    let userName = document.getElementById("user-name");
    userName.onkeydown = function (e) {
        if (/[.,]/.test(e.key)) {
            return false;
        }
    }

    let agree = document.getElementById("agree");
    agree.onchange = function (e) {
        if (e.target.checked) {
            console.log('Согласен');
        } else {
            console.log('Не согласен');
        }
    }

    document.getElementById("existing-user").onclick = function (e) {
        e.preventDefault();
        document.getElementById('sign-up-in').innerText = "Sign In";
        document.querySelectorAll('.register').forEach(function (element) {
            element.classList.add('register-hide');
        })
    };


    let showConfirmPass = document.getElementById('show-confirm-pass')
    let passwordConfirmInput = document.getElementById('confirm-password')
    let passwordConfirmEye = document.getElementById('confirm-pass-eye')
    let passwordConfirmEyeSlash = document.getElementById('confirm-pass-eye-slash')
    showConfirmPass.addEventListener('mousedown', function () {
        togglePassView(passwordConfirmInput, passwordConfirmEye, passwordConfirmEyeSlash, true);

    })
    showConfirmPass.addEventListener('mouseup', () => {
        togglePassView(passwordConfirmInput, passwordConfirmEye, passwordConfirmEyeSlash, false);
    })

    let showPass = document.getElementById('show-pass')
    let passwordInput = document.getElementById('password')
    showPass.addEventListener('mousedown', function () {
        passwordInput.type = 'text';


    })
    showPass.addEventListener('mouseup', () => {
        passwordInput.type = 'password'
        showPass.style.display = 'block';
    })
}

function togglePassView (input, eye, eyeSlash, show) {
    if (show) {
        input.type = 'text'
        eye.style.display = 'none';
        eyeSlash.style.display = 'block';
    } else {
        input.type = 'password'
        eye.style.display = 'block';
        eyeSlash.style.display = 'none';
    }
}