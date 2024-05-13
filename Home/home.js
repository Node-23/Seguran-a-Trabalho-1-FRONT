function register(){
    window.location.href = "../CreateUser/createUser.html";
}

function Login(){
    const email = $('#email').val();
    const password = $('#password').val();
    if(email.trim().length === 0 || password.trim().length === 0){
        alert("Preencha todos os campos!");
        return;
    }

    const login = {
        email: email,
        password: password,
    };
    const host = 'http://3.142.149.145:8080';
    const url = host+'/users/login';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Bem vindo ' + data.username + '!');
            window.location.href = "../MainUser/mainUser.html?" + data.id;
        })
        .catch(error => {
            console.error('Erro:', error.message);
            alert(error.message);
    });
}