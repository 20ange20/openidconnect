// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDisCpz9FQnmMqQHlWd1hoQeaW7NDBesbc",
    authDomain: "openidconnect-d806f.firebaseapp.com",
    projectId: "openidconnect-d806f",
    storageBucket: "openidconnect-d806f.firebasestorage.app",
    messagingSenderId: "561067357753",
    appId: "1:561067357753:web:36b9c9f85124705432ffe8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    if (!messageDiv) return;
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// ==========================
// Lógica de Cadastro (SignUp)
// ==========================
const signUp = document.getElementById('submitSignUp');
if (signUp) {
    signUp.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('rEmail').value;
        const password = document.getElementById('rPassword').value;
        const firstName = document.getElementById('fName').value;
        const lastName = document.getElementById('lName').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = { email, firstName, lastName };

                showMessage('Conta criada com sucesso', 'signUpMessage');

                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData)
                    .then(() => {
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error("Erro ao salvar documento", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode == 'auth/email-already-in-use') {
                    showMessage('Endereço de email já existe', 'signUpMessage');
                } else {
                    showMessage('Não foi possível criar usuário', 'signUpMessage');
                }
            });
    });
}

// ==========================
// Lógica de Login (SignIn)
// ==========================
const signIn = document.getElementById('submitSignIn');
if (signIn) {
    signIn.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showMessage('Usuário logado com sucesso', 'signInMessage');
                const user = userCredential.user;
                localStorage.setItem('loggedInUserId', user.uid);
                window.location.href = 'homepage.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/invalid-credential') {
                    showMessage('Email ou Senha incorretos', 'signInMessage');
                } else {
                    showMessage('Essa conta não existe', 'signInMessage');
                }
            });
    });
}

// ==========================
// Login com Google (Exportado)
// ==========================
export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homepage.html';

        return { user, token };
    } catch (error) {
        console.error("Erro no login com Google:", error);
        throw error;
    }
}
