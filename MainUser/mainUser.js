
let loggedUser;
const host = 'http://localhost:8080';
function User(id, name, username, email, keys) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.keys = keys;
}

function confirmDelete(keyId) {
     if(confirm("Tem certeza que deseja excluir as chaves?")){
         deleteKeys(keyId);
     }
}

function deleteKeys(keyId){
    const overlay = $('#overlay');
    $('#overlay').css('display', 'block');
    const url = host + "/keys/" + keyId;
    fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocorreu um erro ao excluir as chaves.');
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return {};
            }
        })
        .then(data => {
            if (Object.keys(data).length === 0) {
                alert('Recurso excluído com sucesso!');
            } else {
                alert('Info: ' + data);
            }
            window.location.reload();
        })
        .catch(error => {
            alert('Erro ao excluir o recurso: ' + error.message);
            throw error;
        }).finally(() => {
        overlay.css('display', 'none');
    });
}

function openPopup(popupId) {
    document.getElementById(popupId).style.display = "block";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}

window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
}

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    alert("Mensagem enviada: " + message);
    closePopup();
}

$(function (){
    $('#overlay').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    const urlAtual = window.location.href;
    const indexOfSeparator = urlAtual.indexOf('?');
    if(indexOfSeparator === -1){
        alert("Faça login para acessar a página!");
        window.location.href = "../Home/home.html";
        return;
    }

    const url = host+'/users/'+urlAtual.split('?')[1];
    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            loggedUser = new User(data.id, data.name, data.username, data.email, data.keys);
            setUserData(loggedUser);
        })
        .catch(error => {
            console.error('Erro:', error.message);
            alert(error.message);
            window.location.href = "../Home/home.html";
    });
});

function setUserData(user){
    $('#username').text(upperFirstLetter(user.name));
    user.keys.forEach(key => {
        const data1 = "<td>" + key.id + "</td>";
        const data2 = "<td>" + key.name + "</td>";
        const data3 = "<td>" + formatarData(key.createAt) + " às " +  formatarHorario(key.createAt) + "</td>";
        const data4 = createKeyOptions(key);
        const data = "<tr>" + data1 + data2 + data3+ data4 + "</tr>"
        $('#key-table').append(data);
    });
}

function upperFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarHorario(dataString) {
    const data = new Date(dataString);
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}


function createKeyOptions(key){
    return "<td>\n" +
        "<div class=\"tooltip\">\n" +
        "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/DFCFCF/import.png\" onclick=\"openImportPopup("+key.id+",'" + key.name + "')\" alt=\"import\"/>\n" +
        "<span class=\"tooltiptext\">Importar</span>\n" +
        "</div>\n" +
        "<div class=\"tooltip\">\n" +
        "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/DFCFCF/export.png\" onclick=\"openExportPopup("+key.id+")\" alt=\"export\"/>\n" +
        "<span class=\"tooltiptext\">Exportar</span>\n" +
        "</div>\n" +
        "<div class=\"tooltip\">\n" +
        "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/DFCFCF/create-new.png\" alt=\"create-new\"/>\n" +
        "<span class=\"tooltiptext\">Editar</span>\n" +
        "</div>\n" +
        "<div class=\"tooltip\">\n" +
        "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/material-outlined/25/DFCFCF/lock--v1.png\" onclick=\"openPopup('message-catcher-popup')\" alt=\"lock--v1\"/>\n" +
        "<span class=\"tooltiptext\" style=\"width: 90px\">Criptografar</span>\n" +
        "</div>\n" +
        "<div class=\"tooltip\">\n" +
        "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/material-outlined/25/DFCFCF/open-lock.png\" onclick=\"openPopup('message-catcher-popup')\" alt=\"open-lock\"/>\n" +
        "<span class=\"tooltiptext\" style=\"width: 110px\">Descriptografar</span>\n" +
        "</div>\n" +
        "<div class=\"tooltip\">\n" +
        "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/c21f1f/delete--v1.png\" onclick=\"confirmDelete("+key.id+")\" alt=\"delete--v1\"/>\n" +
        "<span class=\"tooltiptext\">Deletar</span>\n" +
        "</div>\n" +
        "</td>";
}

function createPair(){
    const overlay = $('#overlay');
    overlay.css('display', 'block');
    const password = $('#create-password').val();
    const confirmPassword = $('#create-confirm-password').val();
    if(password !== confirmPassword){
        alert("As senhas precisam ser iguais!");
        return;
    }
    const dados = {
        ownerId: loggedUser.id,
        name: $('#create-name').val(),
        password: password
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    const url = host + "/keys";
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
            alert("Chaves criadas com sucesso!");
            closePopup('create-key-popup');
            window.location.reload();
        })
        .catch(error => {
            console.error('Erro:', error.message);
            alert(error.message);
    }).finally(() => {
        overlay.css('display', 'none');
    });
}

function openImportPopup(keyId, keyName){
    $('#choice-label').text("Selecione o que deseja importar");
    $('#import-choice-button').css('display', 'block');
    $('#export-choice-button').css('display', 'none');
    $('#key-files-holder').css('display', 'none');
    $('#id-holder').text(keyId);
    $('#key-name-holder').text(keyName);
    openPopup("choice-popup");
}

function importKey(){
    const keyId = $('#id-holder').text();
    const $password = $('#password');
    const password = $password.val();
    $password.val("");
    const choiceSelectorValue = $('#choice-selector').val();

    const importKey = {
        keyId: keyId,
        password: password
    };
    const suffix = choiceSelectorValue === 'public'? '/public' : '';
    const url = host+'/keys/import' + suffix;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(importKey)
    };
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = choiceSelectorValue === 'public'? $('#key-name-holder').text()+'.pem' : 'key_pair.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            closePopup("choice-popup");
        })
        .catch(error => {
            alert(error.message);
    });
}

function openExportPopup(keyId){
    $('#choice-label').text("Selecione o que deseja exportar");
    $('#import-choice-button').css('display', 'none');
    $('#export-choice-button').css('display', 'block');
    $('#key-files-holder').css('display', 'flex');
    $('#id-holder').text(keyId);
    openPopup("choice-popup");
}

function exportKey() {
    const formData = new FormData();
    const keyId = $('#id-holder').text();
    const $password = $('#password');
    const password = $password.val();
    $password.val("");
    const publicKeyFile = document.getElementById('public-key').files[0];
    if (!publicKeyFile) {
        alert('Por favor, selecione uma chave publica.');
        return;
    }
    if (!publicKeyFile.name.endsWith('.pem')) {
        alert('Por favor, selecione um arquivo .pem!');
        return;
    }
    const choiceSelectorValue = $('#choice-selector').val();
    let privateKeyFile;
    if(choiceSelectorValue === "pair"){
        privateKeyFile = document.getElementById('private-key').files[0];
        if (!privateKeyFile) {
            alert('Por favor, selecione uma chave privada.');
            return;
        }
        if (!privateKeyFile.name.endsWith('.pem')) {
            alert('Por favor, selecione um arquivo .pem!');
            return;
        }
    }

    let options;
    if(choiceSelectorValue === "public"){
        formData.append('id', keyId);
        formData.append('password', password);
        formData.append('file', publicKeyFile);
        options = {
            method: 'POST',
            body: formData
        };
    }else{
        formData.append('id', keyId);
        formData.append('password', password);
        formData.append('privateKeyFile', privateKeyFile);
        formData.append('publicKeyFile', publicKeyFile);
        options = {
            method: 'POST',
            body: formData
        };
    }


    const suffix = choiceSelectorValue === 'public'? '/public' : '';
    const url = host+'/keys/export' + suffix;
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return {};
            }
        })
        .then(data => {
            alert("Chave(s) exportada(s) com sucesso!");
            $('#key-files-holder').css('display', 'none');
            closePopup("choice-popup");
        })
        .catch(error => {
            console.error('Erro:', error.message);
            alert(error.message);
    });
}

function togglePrivateFileInput(element) {
    const option = $(element).val();
    switch (option) {
        case 'pair':
            showPrivateFileInput();
            break;
        case 'public':
            hidePrivateFileInput();
            break;
    }
}

function showPrivateFileInput(){
    $('#private-key').css('display', 'block');
    $('#private-key-label').css('display', 'block');
}

function hidePrivateFileInput(){
    $('#private-key').css('display', 'none');
    $('#private-key-label').css('display', 'none');
}

