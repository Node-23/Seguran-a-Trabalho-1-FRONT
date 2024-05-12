
let user;

function User(name, username, email, keys) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.keys = keys;
}

function confirmDelete() {
    return confirm("Tem certeza que deseja excluir?");
}

function openPopup() {
    document.getElementById('myModal').style.display = "block";
}

function closePopup() {
    document.getElementById('myModal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    alert("Mensagem enviada: " + message);
    closePopup();
}

$(function (){
    const urlAtual = window.location.href;
    const indexOfSeparator = urlAtual.indexOf('?');
    if(indexOfSeparator === -1){
        alert("Faça login para acessar a página!");
        window.location.href = "../Home/home.html";
        return;
    }

    const host = 'http://localhost:8080';
    const url = host+'/users/'+urlAtual[indexOfSeparator + 1];
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
            user = new User(data.name, data.username, data.email, data.keys);
            setUserData(user);
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

const data4 = "<td>\n" +
    "<div class=\"tooltip\">\n" +
    "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/DFCFCF/import.png\" alt=\"import\"/>\n" +
    "<span class=\"tooltiptext\">Importar</span>\n" +
    "</div>\n" +
    "<div class=\"tooltip\">\n" +
    "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/DFCFCF/export.png\" alt=\"export\"/>\n" +
    "<span class=\"tooltiptext\">Exportar</span>\n" +
    "</div>\n" +
    "<div class=\"tooltip\">\n" +
    "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/DFCFCF/create-new.png\" alt=\"create-new\"/>\n" +
    "<span class=\"tooltiptext\">Editar</span>\n" +
    "</div>\n" +
    "<div class=\"tooltip\">\n" +
    "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/material-outlined/25/DFCFCF/lock--v1.png\" onclick=\"openPopup()\" alt=\"lock--v1\"/>\n" +
    "<span class=\"tooltiptext\" style=\"width: 90px\">Criptografar</span>\n" +
    "</div>\n" +
    "<div class=\"tooltip\">\n" +
    "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/material-outlined/25/DFCFCF/open-lock.png\" onclick=\"openPopup()\" alt=\"open-lock\"/>\n" +
    "<span class=\"tooltiptext\" style=\"width: 110px\">Descriptografar</span>\n" +
    "</div>\n" +
    "<div class=\"tooltip\">\n" +
    "<img width=\"25\" height=\"25\" src=\"https://img.icons8.com/ios/25/c21f1f/delete--v1.png\" onclick=\"confirmDelete()\" alt=\"delete--v1\"/>\n" +
    "<span class=\"tooltiptext\">Deletar</span>\n" +
    "</div>\n" +
    "</td>";