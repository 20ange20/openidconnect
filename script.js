import { signInWithGoogle } from './firebaseauth.js';

const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');


signUpButton.addEventListener('click', function() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

signInButton.addEventListener('click', function() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});


const googleLoginBtn = document.getElementById('googleLoginBtn');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        signInWithGoogle()
            .then(({ user, token }) => {
                console.log("Usuário logado com Google:", user);
                // Aqui você pode redirecionar ou atualizar a UI
                // window.location.href = '/dashboard.html';
            })
            .catch((error) => {
                console.error("Erro no login com Google:", error);
                alert("Erro ao fazer login com Google.");
            });
    });
} else {
    console.warn("Botão de login com Google não encontrado (ID: googleLoginBtn)");
}
