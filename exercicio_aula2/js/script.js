// DOM Elements
console.log("script.js loaded")
const form = document.getElementById('cadastroForm');
const email = document.getElementById('email');
const senha = document.getElementById('senha');
const confirmarSenha = document.getElementById('confirmarSenha');
const feedbackMessage = document.getElementById('feedbackMessage');

//validation password
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var symbol = document.getElementById("symbol");

// Form submission event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        const emailValue = email.value.trim();
        const senhaValue = senha.value.trim();

        createNewUser(emailValue, senhaValue)
            
    } else {
        showFeedback('Por favor, corrija os erros no formulário.', 'error');
        shakeForm();
    }
    form.reset()
});

// Create new user function VIA API
async function createNewUser( email, password) {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
        
        if (response.ok) {
            showFeedback('Cadastro realizado com sucesso!', 'success');
        } else {
            showFeedback('Erro ao cadastrar. Por favor, tente novamente.', 'error');
                console.error('Error creating new user:', error);
        }
  
    } catch (error) {
        showFeedback('Erro de comunicação com API.', 'error');
    }

}

// Form validation function
function validateForm() {
    let isValid = true;
    if (!validateEmail()) isValid = false;
    if (!validateSenha()) isValid = false;
    if (!validateConfirmarSenha()) isValid = false;
    return isValid;
}


function validateEmail() {
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === '') {
        setError(email, 'O e-mail é obrigatório');
        return false;
    } else if (!emailRegex.test(emailValue)) {
        setError(email, 'Digite um e-mail válido');
        return false;
    } else {
        setSuccess(email);
        return true;
    }
}

function validateSenha() {
    const senhaValue = senha.value.trim();
    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
    if (senhaValue === '') {
        setError(senha, 'A senha é obrigatória');
        return false;
    } else if (!senhaRegex.test(senhaValue)) {
        setError(senha, 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial');
        return false;
    } else {
        setSuccess(senha);
        return true;
    }
}

// When the user clicks on the password field, show the message box
senha.onfocus = function() {
    document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
senha.onblur = function() {
    document.getElementById("message").style.display = "none";
}

  // When the user starts to type something inside the password field
senha.onkeyup = function() {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if(senha.value.match(lowerCaseLetters)) {  
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }
    
    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if(senha.value.match(upperCaseLetters)) {  
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }
  
    // Validate numbers
    var numbers = /[0-9]/g;
    if(senha.value.match(numbers)) {  
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
    
    // Validate length
    if(senha.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  
    // Validate symbols
    var symbols = /[$*&@#]/g;
    if(senha.value.match(symbols)) {
      symbol.classList.remove("invalid");
      symbol.classList.add("valid");
    } else {
      symbol.classList.remove("valid");
      symbol.classList.add("invalid");
    }
  }

function validateConfirmarSenha() {
    const confirmarSenhaValue = confirmarSenha.value.trim();
    const senhaValue = senha.value.trim();
    if (confirmarSenhaValue === '') {
        setError(confirmarSenha, 'A confirmação de senha é obrigatória');
        return false;
    } else if (confirmarSenhaValue !== senhaValue) {
        setError(confirmarSenha, 'As senhas não coincidem');
        return false;
    } else {
        setSuccess(confirmarSenha);
        return true;
    }
}

function setError(input, message) {
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.error');
    errorDisplay.innerText = message;
    input.classList.add('error');
    input.classList.remove('success');
}

function setSuccess(input) {
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.error');
    errorDisplay.innerText = '';
    input.classList.add('success');
    input.classList.remove('error');
}

// Feedback display function
function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = `show ${type}`;
    setTimeout(() => {
        feedbackMessage.className = '';
    }, 5000);
}

// Form shake animation function
function shakeForm() {
    form.classList.add('shake');
    setTimeout(() => {
        form.classList.remove('shake');
    }, 820);
}