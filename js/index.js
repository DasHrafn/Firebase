const db = firebase.firestore();
let senhas = [];
let currentUser = {};

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid;
      readPasswords();
    } else {
      swal
        .fire({
          icon: "success",
          title: "Redirecionando para a tela de login",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("login.html");
          }, 1000);
        });
    }
  });
}

var addButton = document.querySelector("#add");

addButton.addEventListener("click", function (e) {
  e.preventDefault();

  var form = document.querySelector(".name-password-form");

  form.reset();

});

async function adicionarSenha() {
  const itemList = document.getElementById("tableList");
  const newItem = document.createElement("tr");
  newItem.setAttribute("class", "item");
  itemList.appendChild(newItem);

  const name = document.getElementById("newNome").value;
  const password = document.getElementById("newSenha").value;
  await db.collection("senhas").add({
    nome: name,
    senha: password,
    owner: currentUser.uid,
  });
  readPasswords();
    
}

function renderPassword() {

  let itemList = document.getElementById("tableList");

  itemList.innerHTML = "";

  for(let senha of senhas) {
      const newItem = document.createElement("tr");
      newItem.setAttribute("class", "item");
      newItem.id = "itemTableList";

      const newItemNome = document.createElement("td");
      newItemNome.classList.add("info-nome");
      newItemNome.appendChild(document.createTextNode(senha.nome));

      const newItemSenha = document.createElement("td");
      newItemSenha.classList.add("info-senha");

      newItemSenhaText = document.createElement("div");
      newItemSenhaText.setAttribute("class", "info-senha-text");
      newItemSenhaText.appendChild(document.createTextNode(senha.senha));

      newItemSenha.appendChild(newItemSenhaText);

      const containerIcons = document.querySelector(".container-icons");

      const containerIconsCopy = containerIcons.cloneNode(true);

      containerIconsCopy.id = "";

      newItemSenhaText.appendChild(containerIconsCopy);

      const EditIcon = containerIconsCopy.querySelector(".editIcon");

      EditIcon.setAttribute("onclick", `editPassword("${senha.id}")`);

      const DeleteIcon = containerIconsCopy.querySelector(".deleteIcon");

      DeleteIcon.setAttribute("onclick", `deletePassword("${senha.id}")`);
      
      newItem.appendChild(newItemNome);
      newItem.appendChild(newItemSenha);
      
      itemList.appendChild(newItem);
  }

}

async function readPasswords() {
  senhas = [];
  const logPasswords = await db
    .collection("senhas")
    .where("owner", "==", currentUser.uid)
    .get();
  for (doc of logPasswords.docs) {
    senhas.push({
      id: doc.id,
      nome: doc.data().nome,
      senha: doc.data().senha,
    });
  }
  renderPassword();
}

async function editPassword(id) {
  alert("Para alterar apenas um campo, deixe o outro em branco");

  var nome = prompt("Digite o nome");
  var senha = prompt("Digite a senha");

  if (nome || senha) {
    if (nome.length > 0 && senha.length == 0) {
      db.collection("senhas").doc(id).update({ nome: nome });
      readPasswords();
    } else if (nome.length == 0 && senha.length > 0) {
      db.collection("senhas").doc(id).update({ senha: senha });
      readPasswords();
      location.reload();

    } else {
      db.collection("senhas").doc(id).update({ nome: nome, senha: senha });
      readPasswords();
    }
  }
}

async function deletePassword(id) {
  await db.collection("senhas").doc(id).delete();
  readPasswords();
}

window.onload = function () {
  getUser();
};
