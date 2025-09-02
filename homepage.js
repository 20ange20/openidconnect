// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

// Monitora o estado de autenticação do usuário
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const loggedInUserId = localStorage.getItem('loggedInUserId');

        // tenta recuperar dados do Firestore (para login por email/senha)
        if (loggedInUserId) {
            try {
                const docRef = doc(db, "users", loggedInUserId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName || "";
                    document.getElementById('loggedUserLName').innerText = userData.lastName || "";
                    document.getElementById('loggedUserEmail').innerText = userData.email || "";
                }
            } catch (error) {
                console.error("Erro ao buscar documento:", error);
            }
        }

        // dados diretos do objeto user (quando login com Google)
        if (user.displayName) {
            document.getElementById('loggedUserFName').innerText = user.displayName;
        }
        if (user.email) {
            document.getElementById('loggedUserEmail').innerText = user.email;
        }
        if (user.photoURL) {
            const img = document.getElementById('userPhoto');
            img.src = user.photoURL;
            img.style.display = "block";
        }
    } else {
        console.log("Nenhum usuário autenticado");
    }
});

// Lógica de Logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Erro ao sair:', error);
        });
});
