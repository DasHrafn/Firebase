function login() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      swal
        .fire({
          icon: "success",
          title: "Login realizado com sucesso",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("index.html");
          }, 1000);
        });
    })

    .catch((error) => {
      const erroDeAcesso = error.code;
      switch (erroDeAcesso) {
        case "auth/wrong-password":
          swal.fire({
            icon: "error",
            title: "Senha inválida",
          });
          break;
        case "auth/invalid-email":
          swal.fire({
            icon: "warning",
            title: "E-mail informado inválido",
          });
          break;
        case "auth/user-not-found":
          swal
            .fire({
              icon: "info",
              title: "Usuário não encontrado",
            })
            .then(() => {
              setTimeout(() => {
                swal
                  .fire({
                    icon: "question",
                    text: "Deseja criar esse usuário?",
                    showCancelButton: true,
                    cancelButtonText: "Não",
                    cancelButtonColor: "#117E92",
                    confirmButtonText: "Sim",
                    confirmButtonColor: "#330867",
                  })
                  .then((result) => {
                    if (result.value) {
                      signUp(email, password);
                    }
                  });
              }, 650);
            });
      }
    });
}

function signUp(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      swal
        .fire({
          icon: "success",
          title: "Usuário criado com sucesso",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("index.html");
          }, 600);
        });
    })
    .catch((error) => {
      const erroCadastro = error.code;
      switch (erroCadastro) {
        case "auth/weak-password":
          swal.fire({
            icon: "error",
            title: "Senha muito fraca.",
          });
          break;
        default:
          swal.fire({
            icon: "error",
            title: error.message,
          });
      }
    });
}

function logout() {
  firebase.auth().signOut();
}