// 1. Обработчик события полной загрузки страницы:
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

    // сохраняем форму и поп-ап в переменные:
    const form = document.querySelector("form");
    const popUp = document.getElementsByClassName('pop-up-wrap')[0];


    // функция проверки заполнения формы, принимает параметр - тип формы - регистрация или вход
    // если тип формы регистрация - проверка всех полей
    // иначе проверка только полей user name и password
    // показывает сообщения об ошибках пользователю и подсвечивает поля с ошибками (вместо алертов)
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

    // функция - обработчик события нажатия кнопки sign-up
    function formSingUpListener (event) {
        event.preventDefault();
        if (checkFormAndReturnUserName('sign-up')) {
            popUp.style.display = 'flex';
            form.reset()
        }
    }

    // функция - обработчик события нажатия кнопки sign-in
    function formSingInListener (event) {
        event.preventDefault();
        let userName = checkFormAndReturnUserName('sign-in')
        if (userName) {
            form.reset()
            alert(`Добро пожаловать, ${userName}!`)
        }

    }

    // При нажатии на кнопку “Sign Up” добавляем обработчик событий:
    form.addEventListener("submit", formSingUpListener);

    // Обработка кнопки ОК модального окна
    document.getElementById('redirect-to-login').addEventListener('click', function () {
        popUp.style.display = 'none';
        makeSignInPage()
    })

    // Закрытие модального окна по клику вне окна. Такое же действие как при нажатии ОК
    popUp.addEventListener('click', function (e) {
        if (e.target === this) {
            popUp.style.display = 'none';
            makeSignInPage()
        }
    })


    // 6. При нажатии на ссылку «Already have an account?»,
    // а также на кнопку «ОК» в поп-апе реализована имитация перехода на страницу логина

    // Функция подготовки страницы-имитации логина
    function makeSignInPage() {
        document.getElementById('sign-up-in').innerText = "Sign In";
        document.querySelectorAll('.register').forEach(function (element) {
            element.classList.add('register-hide');
        })
        document.querySelector('.main-title h1').innerText = "Log in to the system";

        // удаляем прежний обработчик события submit формы
        form.removeEventListener('submit', formSingUpListener)
        // и добавляем новый
        form.addEventListener('submit', formSingInListener)

    }

    // обработчик события onclick ссылки "Already have an account?"
    document.getElementById("existing-user").onclick = function (e) {
        e.preventDefault();
        makeSignInPage()
    };


    // Факультатив:)
    // Показываем/скрываем пароль по click на иконку глаза
    let showPass = document.getElementById('show-pass')
    let passwordInput = document.getElementById('password')
    let passwordEye = document.getElementById('pass-eye')
    let passwordSlash = document.getElementById('pass-eye-slash')

    showPass.addEventListener('click', function () {
        togglePassView(passwordInput, passwordEye, passwordSlash, passwordInput.type === 'password');
    })

    // Показываем/скрываем подтверждение пароля по click на иконку глаза
    let showConfirmPass = document.getElementById('show-confirm-pass')
    let passwordConfirmInput = document.getElementById('confirm-password')
    let passwordConfirmEye = document.getElementById('confirm-pass-eye')
    let passwordConfirmEyeSlash = document.getElementById('confirm-pass-eye-slash')

    showConfirmPass.addEventListener('click', function () {
        togglePassView(passwordConfirmInput, passwordConfirmEye, passwordConfirmEyeSlash, passwordConfirmInput.type === 'password');

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