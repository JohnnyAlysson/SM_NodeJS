

const getBTN = document.getElementById("getBTN")
const container = document.querySelector(`#container`)

getBTN.addEventListener("click",getContacts)

async function getContacts(e) {
  e.preventDefault()
  try{ 
    const response = await fetch('http://localhost:3000/users')

    const data = await response.json();

    if (response.ok) {
      console.log(data)
      data.forEach((element)=>{
        const card = document.createElement(`p`)
        card.textContent = element.email
        container.append(card)
        
        document.getElementById('message').innerText = element.email;
      })
  } else {
      document.getElementById('message').innerText = `Erro: ${data.message}`;
  }

  }
  catch(error){

  }
  
}

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

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
          document.getElementById('message').innerText = data.message;
      } else {
          document.getElementById('message').innerText = `Erro: ${data.message}`;
      }

  } catch (error) {
      document.getElementById('message').innerText = 'Erro na comunicação com a API.';
  }

  // Limpar os campos do formulário
  this.reset();
});
