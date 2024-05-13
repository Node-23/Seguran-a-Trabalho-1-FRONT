function RegisterUser(){
    const name = $('#name').val();
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();
    if(name.trim().length === 0 || username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || confirmPassword.trim().length === 0){
        alert("Preencha todos os campos!");
        return;
    }
    if(password !== confirmPassword){
        alert("Senhas não são iguais!");
        return;
    }

    const user = {
        name: name,
        username: username,
        email: email,
        password: password,
    };
    const host = 'http://3.142.149.145:8080';
    const url = host+'/users';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };

    fetch(url, options)
        .then(response => {
            debugger
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            debugger
            alert('Usuário ' + data.username + ' criado com sucesso!');
            window.location.href = "../Home/home.html";
        })
        .catch(error => {
            debugger
            console.error('Erro:', error.message);
            alert(error.message);
    });
}

function cancel(){
    window.location.href = "../Home/home.html";
}