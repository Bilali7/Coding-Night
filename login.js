const emailLogin = document.querySelector('#email');
const passwordLogin = document.querySelector('#password');
const login = document.querySelector('#login');

login.addEventListener('click', function(e) {
    e.preventDefault();

    let allUsers = JSON.parse(localStorage.getItem('allUsers'));
    let email = emailLogin.value.toLowerCase().trim();
    let password = passwordLogin.value.trim();

    if(!email || !password) {
        swal("Fill Out All Input Field!", "Press OK For Retry!", "error");
        // alert('All fields must be filled');
        return;
    }
    
    const isExist = allUsers.find(function(userData) {
        return userData && userData.emails && userData.emails.toLowerCase() === email;
    });
    
    if(!isExist) {
        swal("Please create your account first !", "Press OK For Retry!", "error");
        // alert('Please create your account first');
        return;
    }

    if(isExist.passwords === password) {
        alert('Congratulations, Login Successful');
        // swal("SignUp Success!", "success");
        // swal(`Good job!, You clicked the button!, success login`);
        localStorage.setItem('loginUser', JSON.stringify(isExist));
        window.location.href = 'social-media.html';
    } else {
        // swal("Incorrect Password !", "Press OK For Retry!", "error");
        alert('Incorrect password');
    }

    emailLogin.value = "";
    passwordLogin.value = "";
});
