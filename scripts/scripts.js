$(document).ready(function () {

    // в объект сохраняем HTML элементы для записи в них ошибок заполнения формы

    const errors = {
        'fullNameError': document.getElementById("full-name-error"),
        'userNameError': document.getElementById("user-name-error"),
        'emailError': document.getElementById("email-error"),
        'passError': document.getElementById("pass-error"),
        'confirmPassError': document.getElementById("confirm-pass-error"),
        'agreeError': document.getElementById("agree-error")
    }

    // сохраняем форму переменную:
    const form = $("form")[0];
    // сохраняем инпуты в переменные
    const fullName = form[0]
    const userName = form[1]
    const email = form[2]
    const password = form[3]
    const confirmPassword = form[4]
    const agree = form[5]

    // сохраняем поп-ап в переменную:
    const popUp = document.getElementsByClassName('pop-up-wrap')[0];

    // объявляем переменную для сохранения регистрационных данных пользователя
    let userObject = {}


    // функция очистки ошибок
    function cleanUpErrors() {
        $('.form-input').removeClass('error')
        $('.form-checkbox').removeClass('error')
        for (let error in errors) {
            errors[error].innerText = ''
        }
    }


    // функции обработчики событий / проверки полей

    function inputErrorCheckerTextInput (input, formType, errorElem, inputName, regExpErrMessage, regExp,
                                         existingUser=null, existingUserErrMsg=null, alwaysCheck=false) {
        if (input.value === "" && (formType === 'sign-up' || alwaysCheck)) {
            showError(errors[errorElem], `Please enter Your ${inputName}!`, input.parentElement);
            return true;
        } else if (!regExp.test(input.value) && formType === 'sign-up') {
            showError(errors[errorElem], regExpErrMessage, input.parentElement);
            return true;
        } else if (existingUser && existingUser[input.value] && formType === 'sign-up') {
            showError(errors[errorElem], existingUserErrMsg, input.parentElement);
            return true;
        } else {
            hideError(errors[errorElem], input.parentElement)
            return false;
        }
    }

    function inputErrorCheckerPassword (passwordInput, confirmInput, formType, errorPassElem, errorConfirmElem, passRegExp) {
        let hasError = false;

        if (password.value === "") {
            showError(errors[errorPassElem], 'Please enter password!', password.parentElement);
            hasError = true;
        } else if (!passRegExp.test(password.value) && formType === 'sign-up') {
            showError(errors[errorPassElem], 'Password must be at least 8 characters and contains at least one uppercase letter, lowercase letter, digit, special character', password.parentElement);
            hasError = true;
        } else if (password.value !== confirmPassword.value && formType === 'sign-up') {
            showError(errors[errorPassElem], 'Password and confirmation does not match!', password.parentElement);
            hasError = true;
        } else {
            hideError(errors[errorPassElem], passwordInput.parentElement)
        }

        if (confirmInput.value === "" && formType === 'sign-up') {
            showError(errors[errorConfirmElem], 'Please confirm your password!', confirmInput.parentElement);
            hasError = true;
        } else if (password.value !== confirmPassword.value && formType === 'sign-up') {
            showError(errors[errorConfirmElem], 'Password and confirmation does not match!', confirmPassword.parentElement);
            hasError = true;
        } else {
            hideError(errors[errorConfirmElem], confirmInput.parentElement)
        }

        return hasError
    }

    function inputErrorCheckerCheckBox (input, formType, errorElem, message) {
        if (!input.checked && formType === 'sign-up') {
            showError(errors[errorElem], message, input.parentElement);
            return true;
        } else {
            hideError(errors[errorElem], input.parentElement)
            return false;
        }
    }


    // функция проверки заполнения формы, принимает параметр - тип формы - регистрация или вход
    // если тип формы регистрация - проверка всех полей
    // иначе проверка только полей user name и password
    // показывает сообщения об ошибках пользователю и подсвечивает поля с ошибками
    // если проверка пройдена функция возвращает строку и именем пользователя, иначе - false
    function checkFormAndReturnUserName(formType) {

        // сохраняем существующих пользователей из localStorage
        let users = localStorage.getItem('users');
        if (users) {
            userObject = JSON.parse(users);
        }

        // сохраняем RegExp шаблоны в переменные
        const fullNameRegExp = /^[a-zа-яё ]+$/i
        const userNameRegExp = /^[a-zа-яё \-_\d]+$/i
        const emailRegExp = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/m
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?'";:/\\{}\[\]^_\-,.=<>+])[A-Za-z\d#$@!%&*?'";:/\\{}\[\]^_\-,.=<>+]{8,}$/

        //очистка ошибок
        cleanUpErrors()

        // проверка полей на ошибки

        let nameError = inputErrorCheckerTextInput(fullName, formType, 'fullNameError',
            'full name', 'This field may contains letters and space only', fullNameRegExp)

        $(fullName).on('input', inputErrorCheckerTextInput.bind(null, fullName, formType, 'fullNameError',
            'full name', 'This field may contains letters and space only', fullNameRegExp));

        let userError = inputErrorCheckerTextInput(userName, formType, 'userNameError',
            'user name', 'This field may contains letters, digits, space and signs "-_" only', userNameRegExp,
            userObject, 'Such user is already exist, please choose another Username!', true)

        $(userName).on('input', inputErrorCheckerTextInput.bind(null, userName, formType, 'userNameError',
            'user name', 'This field may contains letters, digits, space and signs "-_" only', userNameRegExp,
            userObject, 'Such user is already exist, please choose another Username!', true));

        let emailError = inputErrorCheckerTextInput(email, formType, 'emailError',
            'email address', 'You must enter a valid email in this field', emailRegExp)

        $(email).on('input', inputErrorCheckerTextInput.bind(null, email, formType, 'emailError',
            'email address', 'You must enter a valid email in this field', emailRegExp));

        let passError = inputErrorCheckerPassword(password, confirmPassword, formType,'passError',
            'confirmPassError', passwordRegExp)
        $([password, confirmPassword]).on('input', inputErrorCheckerPassword.bind(this, password, confirmPassword, formType,
            'passError', 'confirmPassError', passwordRegExp));

        let agreeError = inputErrorCheckerCheckBox(agree, formType, 'agreeError',
            'You have to agree to our Terms of Service and Privacy Statement!');
        $(agree).on('change', inputErrorCheckerCheckBox.bind(this, agree, formType, 'agreeError',
            'You have to agree to our Terms of Service and Privacy Statement!'))


        //проверка состояния флага hasError
        let hasError = [nameError, userError, emailError, passError, agreeError].some((el) => el)

        if (!hasError) {
            return userName.value
        } else return false;
    }

    // функция - обработчик события нажатия кнопки sign-up
    function formSignUpListener(event) {
        event.preventDefault();
        let userName = checkFormAndReturnUserName('sign-up')
        if (userName) {
            userObject[userName] = {}
            const data = new FormData(form);
            data.forEach((value, key) => {
                userObject[userName][key] = value;
            })

            localStorage.setItem('users', JSON.stringify(userObject));
            popUp.style.display = 'flex';
            form.reset()
        }
    }

    // функция - обработчик события нажатия кнопки sign-in
    function formSignInListener(event) {
        event.preventDefault();
        let currentUserName = checkFormAndReturnUserName('sign-in')
        let users = JSON.parse(localStorage.getItem('users'));
        if (users && users[userName.value]) {
            if (password.value === users[userName.value]['password']) {
                form.reset()
                makePersonalAccountPage(users[currentUserName]['full-name']);
                $('.header')[0].scrollIntoView({behavior: 'smooth'});
            } else if (password.value) {
                showError(errors.passError, 'Wrong password!', password.parentElement)
            }
        } else if (userName.value) {
            showError(errors.userNameError, 'Such user does not exist!', userName.parentElement)
        }
    }

    // Добавляем обработчик события submit для формы:
    form.addEventListener("submit", formSignUpListener);

    // Обработка кнопки ОК модального окна
    $('#redirect-to-login').on('click', function () {
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


    // обработчик события onclick ссылки "Already have an account?"
    let existedUser = $("#existing-user");
    existedUser.on('click', function (e) {
        e.preventDefault();
        makeSignInPage()
    });

    // При нажатии на ссылку «Already have an account?»,
    // а также на кнопку «ОК» в поп-апе реализована имитация перехода на страницу логина

    // Функция подготовки страницы-имитации логина
    function makeSignInPage() {
        $('#sign-up-in').text("Sign In");
        $('.register').addClass('register-hide');
        $('.main-title h1').text("Log in to the system");

        // удаляем прежний обработчик события submit формы
        form.removeEventListener('submit', formSignUpListener)
        // и добавляем новый
        form.addEventListener('submit', formSignInListener)

        // меняем текст и обработчик событий ссылки "Already have an account?"
        existedUser.text('Registration').on('click', () => {location.reload()})

        // предварительно очищаем ошибки
        cleanUpErrors()
    }

    // Функция подготовки страницы-имитации личного кабинета
    function makePersonalAccountPage(name) {
        $('#sign-up-in').text(`Exit`);
        $('.login').addClass('register-hide');
        $('.main-title h1').text(`Welcome, ${name}!`);

        // удаляем прежний обработчик события submit формы
        form.removeEventListener('submit', formSignInListener)
    }


    // Показываем/скрываем пароль по click на иконку глаза
    let showPass = $('#show-pass')
    let passwordInput = $('#password')
    let passwordEye = document.getElementById('pass-eye')
    let passwordSlash = document.getElementById('pass-eye-slash')

    showPass.on('click', function (e) {
        togglePassView(passwordInput, passwordEye, passwordSlash, passwordInput.is('input:password'));
    })


    // Показываем/скрываем подтверждение пароля по click на иконку глаза
    let showConfirmPass = $('#show-confirm-pass')
    let passwordConfirmInput = $('#confirm-password')
    let passwordConfirmEye = document.getElementById('confirm-pass-eye')
    let passwordConfirmEyeSlash = document.getElementById('confirm-pass-eye-slash')

    showConfirmPass.on('click', function () {
        togglePassView(passwordConfirmInput, passwordConfirmEye, passwordConfirmEyeSlash, passwordConfirmInput.is('input:password'));
    })

})


// функция - переключатель типа инпута text\password и значка - глаза - отображения пароля
function togglePassView(input, eye, eyeSlash, show) {
    if (show) {
        input[0].type = 'text'
        eye.style.display = 'none';
        eyeSlash.style.display = 'block';
    } else {
        input[0].type = 'password'
        eye.style.display = 'block';
        eyeSlash.style.display = 'none';
    }
}


// функция отображения ошибки (message) в переданном элементе (errorElem) и изменения стиля инпута (input)
function showError(errorElem, message, input) {
    errorElem.innerHTML = message;
    input.classList.add('error');
}

function hideError(errorElem, input) {
    errorElem.innerHTML = '';
    input.classList.remove('error');
}

