function PostRegUser(){


    let email       = document.getElementById("email");
    let password    = document.getElementById("password");

    let payload = {
        "email"     :email.value,
        "password"  :password.value,
    }

    console.log("email: "       + email.value);
    console.log("password: "  + password.value);
    console.log(payload);
    var request = new XMLHttpRequest();
    request.open('POST', "http://127.0.0.1:8000/users/",true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Accept", "application/json");


    request.onload = () => {
        
        const response  = request.responseText;
        const json      = JSON.parse(response);     
        const status    = request.status;
    };
    request.send(JSON.stringify(payload));
    
};