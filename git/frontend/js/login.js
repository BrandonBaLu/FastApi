function login(){   
    var request = new XMLHttpRequest();

    let email = document.getElementById("email");
    let password  = document.getElementById("password");  
    let payload = {
        "email" : email.value,
        "password" : password.value
    }
    console.log(email.value);
    console.log(password.value );
    console.log(payload);

    
    request.open('POST', "http://0.0.0.0:8000/users/token",true);
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
 
    request.onload = () => {
        
        const response = request.responseText;
        const json = JSON.parse(response);
        console-console.log(json);
        sessionStorage.setItem("token", json.token);
        //window.location.replace("templates/inicio.html");
    
    };
    request.send(JSON.stringify(payload));
}