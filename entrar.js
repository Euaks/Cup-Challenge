document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const dados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioValido = dados.find((u) => u.usuario === usuario && u.senha === senha);

    if (usuarioValido) {
        alert("Login realizado com sucesso!");
        localStorage.setItem("usuarioLogado", usuario); // salvar para o jogo
        window.location.href = "index.html";
    } else {
        alert("Usuário ou senha inválidos.");
    }
});
