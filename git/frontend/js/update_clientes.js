function PutCliente(){
    var token = sessionStorage.getItem('token');
    var id_cliente = window.location.search.substring(1);
    let id_cliente1 = id_cliente;
    let nombre = document.getElementById("nombre");
    let email  = document.getElementById("email");

    
    let payload = {
        "id_cliente": id_cliente1,
        "nombre": nombre.value,
        "email" : email.value,
    }

    console.log(payload);
    
    var request = new XMLHttpRequest();
    request.open('PUT', "http://0.0.0.0:8000/clientes/",true);
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Authorization", "Bearer " + btoa(token));
    request.setRequestHeader("content-type", "application/json");
    
    request.onload = () => {
        
        const response  = request.responseText;
        const json      = JSON.parse(response);     
        const status    = request.status;
        console.log(json);

        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
        }

        else if (request.status == 202){

            console.log("Response: " + response);
            console.log("JSON: " + json);
            console.log("Status: " + status);

            Swal.fire({
                title: json.message,
                text: "Regresar a la lista de clientes ",
                type: "info"
            }).then(function() {
                window.location = "/templates/get_clientes.html";
            });
        }
    };
    request.send(JSON.stringify(payload));
}