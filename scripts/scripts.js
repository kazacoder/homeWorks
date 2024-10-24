window.onload = function () {

    // 2. Запрет ввода цифр в поле fullName
    let fullName = document.getElementById("full-name");
    fullName.onkeydown = function (e) {
        if (/\d/.test(e.key)) {
            return false;
        }
    }

    // 3. Запрет ввода точки и запятой в поле userName
    let userName = document.getElementById("user-name");
    userName.onkeydown = function (e) {
        if (/[.,]/.test(e.key)) {
            return false;
        }
    }

    // 4. При изменении значения чекбокса вывод в консоль соответствующее сообщение: “Согласен” или “Не согласен”.
    let agree = document.getElementById("agree");
    agree.onchange = function (e) {
        if (e.target.checked) {
            console.log('Согласен');
        } else {
            console.log('Не согласен');
        }
    }


    // 5.
    // в объект сохранены необходимые элементы

    const errors = {
        'fullNameError': document.getElementById("full-name-error"),
        'userNameError': document.getElementById("user-name-error"),
        'emailError': document.getElementById("email-error"),
        'passError': document.getElementById("pass-error"),
        'confirmPassError': document.getElementById("confirm-pass-error"),
        'agreeError': document.getElementById("agree-error")
    }

    const form = document.querySelector("form");
    const popUp = document.getElementsByClassName('pop-up-wrap')[0];

    // функция проверки заполнения формы, принимает параметр - тип формы - регистрация или вход
    // если тип формы регистрация - проверка всех полей
    // иначе проверка только полей user name и password
    // если проверка пройдена функция возвращает строку и именем пользователя, иначе - false
    function checkFormAndReturnUserName (formType) {
        const fullName = form[0]
        const userName = form[1]
        const email = form[2]
        const password = form[3]
        const confirmPassword = form[4]
        const agree = form[5]
        let hasError = false;

        //очистка ошибок
        document.querySelectorAll('input').forEach(input => {
            input.parentElement.classList.remove('error')
        })
        for (let error in errors) {
            errors[error].innerText = ''
        }

        // проверка полей на ошибки
        if (fullName.value === "" && formType === 'sign-up') {
            showError(errors.fullNameError, 'Please enter Your full name!', fullName.parentElement);
            hasError = true;
        }
        if (userName.value === "") {
            showError(errors.userNameError, 'Please enter Your user name!', userName.parentElement);
            hasError = true;
        }
        if (email.value === "" && formType === 'sign-up') {
            showError(errors.emailError, 'Please enter Your email address!', email.parentElement);
            hasError = true;
        }
        if (password.value === "") {
            showError(errors.passError, 'Please enter password!', password.parentElement);
            hasError = true;
        } else if (password.value.length < 8) {
            showError(errors.passError, 'Password must be at least 8 characters!', password.parentElement);
            hasError = true;
        } else if (password.value !== confirmPassword.value && formType === 'sign-up') {
            showError(errors.passError, 'Password and confirmation do not match!', password.parentElement);
            showError(errors.confirmPassError, 'Password and confirmation do not match!', confirmPassword.parentElement);
            hasError = true;
        }
        if (confirmPassword.value === "" && formType === 'sign-up') {
            showError(errors.confirmPassError, 'Please confirm your password!', confirmPassword.parentElement);
            hasError = true;
        }
        if (!agree.checked && formType === 'sign-up') {
            showError(errors.agreeError, 'You have to agree to our Terms of Service and Privacy Statement!', agree.parentElement);
            hasError = true;
        }
        //проверка пройдена
        if (!hasError) {
            return userName.value
        } else return false;

    }

    function formSingUpListener (event) {
        event.preventDefault();
        if (checkFormAndReturnUserName('sign-up')) {
            popUp.style.display = 'flex';
            form.reset()
        }
    }

    function formSingInListener (event) {
        event.preventDefault();
        let userName = checkFormAndReturnUserName('sign-in')
        if (userName) {
            form.reset()
            alert(`Добро пожаловать, ${userName}!`)
        }

    }

    // При нажатии на кнопку “Sign Up”:
    form.addEventListener("submit", formSingUpListener);

    // Обработка кнопки ОК модального окна
    document.getElementById('redirect-to-login').addEventListener('click', function (e) {
        popUp.style.display = 'none';
        makeSignInPage()
    })

    // Закрытие модального окна по клику вне окна
    popUp.addEventListener('click', function (e) {
        if (e.target === this) {
            popUp.style.display = 'none';
            makeSignInPage()
        }
    })


    // 6. При нажатии на ссылку «Already have an account?»,
    // а также на кнопку «ОК» в поп-апе реализована имитация перехода на страницу логина

    function makeSignInPage() {
        document.getElementById('sign-up-in').innerText = "Sign In";
        document.querySelectorAll('.register').forEach(function (element) {
            element.classList.add('register-hide');
        })
        document.querySelector('.main-title h1').innerText = "Log in to the system";
        form.removeEventListener('submit', formSingUpListener)
        form.addEventListener('submit', formSingInListener)

    }

    document.getElementById("existing-user").onclick = function (e) {
        e.preventDefault();
        makeSignInPage()
    };


    // Факультатив:)
    // Показываем пароль по mousedown на иконку глаза. Скрываем - по mouseup/mouseleave
    let showPass = document.getElementById('show-pass')
    let passwordInput = document.getElementById('password')
    let passwordEye = document.getElementById('pass-eye')
    let passwordSlash = document.getElementById('pass-eye-slash')

    showPass.addEventListener('mousedown', function () {
        togglePassView(passwordInput, passwordEye, passwordSlash, passwordInput.type === 'password');
    })
    // showPass.addEventListener('mouseup', () => {
    //     togglePassView(passwordInput, passwordEye, passwordSlash, false);
    // })
    // showPass.addEventListener('mouseleave', () => {
    //     togglePassView(passwordInput, passwordEye, passwordSlash, false);
    // })


    // Показываем подтверждение пароля по mousedown на иконку глаза. Скрываем - по mouseup/mouseleave
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

    showConfirmPass.addEventListener('mouseleave', function (e) {
        togglePassView(passwordConfirmInput, passwordConfirmEye, passwordConfirmEyeSlash, false);
    })

}


// функция - переключатель типа инпута text\password и значка - глаза - отображения пароля
function togglePassView(input, eye, eyeSlash, show) {
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


// функция отображения ошибки (message) в переданном элементе (errorElem) и изменения стиля инпута (input)
function showError(errorElem, message, input) {
    errorElem.innerHTML = message;
    input.classList.add('error');
}