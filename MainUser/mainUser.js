
function confirmDelete() {
    return confirm("Tem certeza que deseja excluir?");
}

function openPopup() {
    // Exibe o popup
    document.getElementById('myModal').style.display = "block";
}

// Função para fechar o popup
function closePopup() {
    // Oculta o popup
    document.getElementById('myModal').style.display = "none";
}

// Fecha o popup se o usuário clicar fora dele
window.onclick = function(event) {
    var modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function sendMessage() {
    // Pega o conteúdo digitado pelo usuário
    var message = document.getElementById('messageInput').value;
    // Exibe a mensagem (aqui você pode enviar a mensagem para o servidor ou fazer qualquer outra coisa com ela)
    alert("Mensagem enviada: " + message);
    // Fecha o popup após o envio da mensagem
    closePopup();
}