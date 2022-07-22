function PostRegUser(){
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

    request.open('POST', "http://0.0.0.0:8000/users/",true);
    request.setRequestHeader("accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
 
    request.onload = () => {
        // Almacena la respuesta en una variable, si es 202 es que se obtuvo correctamente
        const response = request.responseText;
        const json = JSON.parse(response);
        console-console.log(json);
        sessionStorage.setItem("token", json.token);
        Swal.fire({
            title: json.message,
            text: "Regresar al login ",
            type: "success"
        }).then(function() {
            window.location = "/templates/login.html";
        });
    
    };
    request.send(JSON.stringify(payload));
}