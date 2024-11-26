$(document).ready(function () {

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
    const form = $("form")[0];
    const popUp = document.getElementsByClassName('pop-up-wrap')[0];


    // функция проверки заполнения формы, принимает параметр - тип формы - регистрация или вход
    // если тип формы регистрация - проверка всех полей
    // иначе проверка только полей user name и password
    // показывает сообщения об ошибках пользователю и подсвечивает поля с ошибками (вместо алертов)
    // если проверка пройдена функция возвращает строку и именем пользователя, иначе - false
    function checkFormAndReturnUserName(formType) {
        const fullName = form[0]
        const userName = form[1]
        const email = form[2]
        const password = form[3]
        const confirmPassword = form[4]
        const agree = form[5]
        let hasError = false;

        const fullNameRegExp = /^[a-zа-яё ]+$/gi
        const userNameRegExp = /^[a-zа-яё \-_\d]+$/gi
        const emailRegExp = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/

        //очистка ошибок
        $('.form-input').removeClass('error')
        for (let error in errors) {
            errors[error].innerText = ''
        }

        // проверка полей на ошибки
        if (fullName.value === "" && formType === 'sign-up') {
            showError(errors.fullNameError, 'Please enter Your full name!', fullName.parentElement);
            hasError = true;
        } else if (!fullNameRegExp.test(fullName.value) && formType === 'sign-up') {
            showError(errors.fullNameError, 'This field may contains letters and space only', fullName.parentElement);
            hasError = true;
        }
        if (userName.value === "") {
            showError(errors.userNameError, 'Please enter Your user name!', userName.parentElement);
            hasError = true;
        } else if (!userNameRegExp.test(userName.value)) {
            showError(errors.userNameError, 'This field may contains letters, digits, space and signs "-_" only', userName.parentElement);
            hasError = true;
        }
        if (email.value === "" && formType === 'sign-up') {
            showError(errors.emailError, 'Please enter Your email address!', email.parentElement);
            hasError = true;
        } else if (!emailRegExp.test(email.value) && formType === 'sign-up') {
            showError(errors.emailError, 'You must enter a valid email in this field', email.parentElement);
            hasError = true;
        }
        if (password.value === "") {
            showError(errors.passError, 'Please enter password!', password.parentElement);
            hasError = true;
        } else if (!passwordRegExp.test(password.value) && formType === 'sign-up') {
            showError(errors.passError, 'Password must be at least 8 characters and contains at least one uppercase letter, lowercase letter, digit, special character', password.parentElement);
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
    function formSignUpListener(event) {
        event.preventDefault();
        let userName = checkFormAndReturnUserName('sign-up')
        if (userName) {
            let formObject = {}
            let users = localStorage.getItem('users');
            if (users) {
                formObject = JSON.parse(users);
            }
            formObject[userName] = {}
            const data = new FormData(form);
            data.forEach((value, key) => {
                formObject[userName][key] = value;
            })

            localStorage.setItem('users', JSON.stringify(formObject));
            console.log(JSON.parse(localStorage.getItem('users')));
            popUp.style.display = 'flex';
            form.reset()
        }
    }

    // функция - обработчик события нажатия кнопки sign-in
    function formSignInListener(event) {
        event.preventDefault();
        const password = event.target[3]
        const user = event.target[1]
        let userName = checkFormAndReturnUserName('sign-in')
        let users = JSON.parse(localStorage.getItem('users'));
        if (users && users[user.value]) {
            if (password.value === users[userName]['password']) {
                form.reset()
                makePersonalAccountPage(users[userName]['full-name']);
            } else {
                showError(errors.passError, 'Wrong password!', password.parentElement)
            }
        } else if (user.value) {
            showError(errors.userNameError, 'Such user does not exist!', user.parentElement)
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


    // 6. При нажатии на ссылку «Already have an account?»,
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

    }

    // Функция подготовки страницы-имитации личного кабинета
    function makePersonalAccountPage(name) {
        $('#sign-up-in').text(`Exit`);
        $('.form-input').addClass('register-hide');
        $('.main-text').addClass('register-hide');
        $('label').addClass('register-hide');
        $('.main-title h1').text(`Welcome, ${name}!`);

        // удаляем прежний обработчик события submit формы
        form.removeEventListener('submit', formSignInListener)

    }

    // обработчик события onclick ссылки "Already have an account?"
    $("#existing-user").on('click', function (e) {
        e.preventDefault();
        makeSignInPage()
    });


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

})


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

