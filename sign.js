const user = document.querySelector('#user');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const btn = document.querySelector('#sum');

function isValidPassword(password){
    let passwordSyntax = /^.{8}$/;
    return passwordSyntax.test(password);
}

btn.addEventListener('click',function(e) {
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    e.preventDefault();
    let uNots = user.value.toLowerCase().trim();
    // let fNots = first.value.toLowerCase().trim();
    // let lNots = last.value.toLowerCase().trim();
    let eNots = email.value.toLowerCase().trim();
    let pNots = password.value.trim();
    let cpNots = confirmPassword.value.trim(); 
    if(!uNots || !eNots || !pNots || !cpNots) {
            // alert("all field fill");
            swal("Fill Out All Input Field!", "Press OK For Retry!", "error");
            return;
        }
        
        if(pNots !== cpNots) {
            // alert(`your password is not same`);
            swal ("Password Should Be Same!", "Press OK For Retry!", "error");
            return;
        }
        
        if(!isValidPassword(pNots)) {
            // return alert('8 allow');
            swal("8 Characters allow", "Press OK For Retry!", "error");
        }
        
        eNots = eNots.toLowerCase();
        if(!eNots.endsWith("@gmail.com")) {
            // alert("includes @gmail.com");
            swal("includes a @gmail.com!", "Press OK For Retry!", "error");
            // Swal.fire ({
            //     position: "top-end",
            //     icon: "error",
            //     title: "includes a @gmail.com!",
            // });
            return;
        }
        
        const uuName = allUsers.find(function(userData) {
            return userData && userData.users && userData.users.toLowerCase() === uNots.toLowerCase();
        })
        if(uuName) {
            swal (
            "This Email Is Already Taken Try Another Email!",
            "Press OK For Retry!",
            "error"
            );
            return;
        } 
        // return alert('user name already taken');

        const uuEmail = allUsers.find(function(userData) {
            return userData && userData.emails && userData.emails.toLowerCase() === eNots.toLowerCase();
        })
        if(uuEmail) return alert('your email already exit try to login');

        
        // let id = [];
        // localStorage.setItem('id',JSON.stringify(id));
        let id = Number(localStorage.getItem('id')) || 100;

        let userRecord = {
            users: uNots,
            emails: eNots,
            passwords: pNots,
            id: id + 1,
        }
        allUsers.push(userRecord);
        localStorage.setItem('allUsers',JSON.stringify(allUsers));
        localStorage.setItem('id',id + 1);
        // alert('successfully ');
        swal("SignUp Success!", `${uNots} Go To LogIn Page`, "success");
        // console.log(allUsers);
        // console.log(userRecord);
        // console.log('touch');
        // console.log('success login');

        
        user.value = "";
        email.value = "";
    password.value = "";
    confirmPassword.value = "";
    
    setTimeout(() => {
        window.location.href = 'login.html';
    },1000);    
});
