// JavaScript Functions Home Page (index)

function handleSearch() {
    var searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
  
    if (searchTerm === "moto" || searchTerm === "motos") {
      window.location.href = "motos.html";  
    } else {
      window.location.href = "index.html";  
    }
}

// JavaScript Functions Register Page (index)
function updateCities() {
    const community = document.getElementById("community").value;
    const citySelect = document.getElementById("city");
  
    citySelect.innerHTML = '<option value="">Select a City</option>';
  
    const citiesByCommunity = {
        "Andalucia": ["Almeria", "Cadiz", "Cordoba", "Granada", "Huelva", "Jaen", "Malaga", "Sevilla"],
        "Aragon": ["Huesca", "Teruel", "Zaragoza"],
        "Asturias": ["Asturias"],
        "Islas-Baleares": ["Islas-Baleares"],
        "Islas-Canarias": ["Las-Palmas", "Santa-Cruz-de-Tenerife"],
        "Cantabria": ["Cantabria"],
        "Castilla-Leon": ["Avila", "Burgos", "Leon", "Palencia", "Salamanca", "Segovia","Soria", "Valladolid", "Zamora"],
        "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
        "Cataluna": ["Barcelona", "Girona", "Lleida", "Tarragona"],
        "Valencia": ["Alicante", "Castellon", "Valencia"],
        "Extremadura": ["Badajoz", "Caceres"],
        "Galicia": ["Coruna","Lugo","Ourense","Pontevedra"],
        "Madrid": ["Madrid"],
        "Murcia": ["Murcia"],
        "Navarra": ["Navarra"],
        "Ceuta": ["Ceuta"],
        "Melilla": ["Melilla"],
        "Pais-Vasco": ["Alava","Bizkaia","Gipuzkoa"],
        "La-Rioja": ["La-Rioja"]
    };
  
    if (community in citiesByCommunity) {
        citiesByCommunity[community].forEach(city => {
            let option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirm-password");
      const birthInput = document.getElementById("birth-date");
      const registerButton = document.getElementById("register-button");
      const emailError = document.getElementById("email-resgister-error"); 
      const birthError = document.getElementById("birth-error");
      const passwordError = document.createElement("span");  
      const confirmPasswordError = document.createElement("span");  
      
      passwordInput.insertAdjacentElement('afterend', passwordError);
      confirmPasswordInput.insertAdjacentElement('afterend', confirmPasswordError);
      birthInput.insertAdjacentElement('afterend', birthError);  
  
      let touchedFields = {};  
    
      function validateForm() {
          const email = emailInput.value.trim();
          const password = passwordInput.value.trim();
          const confirmPassword = confirmPasswordInput.value.trim();
          const birthDate = new Date(birthInput.value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
    
          if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
              age--;
          }
  
          const emailPattern = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
          const isEmailValid = emailPattern.test(email);
          const isAgeValid = age >= 18;
          const isPasswordValid = password.length >= 5;
          const doPasswordsMatch = password === confirmPassword;
    
          const areFieldsFilled = [...document.querySelectorAll("input, select")].every(input => input.value.trim() !== "");
  
          if (touchedFields.email && email && !isEmailValid) {
              emailError.textContent = "Invalid email format";
              emailError.style.color = "red";
          } else {
              emailError.textContent = "";
          }
    
          if (touchedFields.birthDate && birthDate && !isAgeValid) {
              birthError.textContent = "You must be at least 18 years old";
              birthError.style.color = "red";
          } else {
              birthError.textContent = "";
          }
    
          if (touchedFields.password && password && !isPasswordValid) {
              passwordError.textContent = "Password must be at least 5 characters long";
              passwordError.style.color = "red";
          } else {
              passwordError.textContent = "";
          }
  
          if (touchedFields.confirmPassword && confirmPassword && !doPasswordsMatch) {
              confirmPasswordError.textContent = "Passwords do not match";
              confirmPasswordError.style.color = "red";
          } else {
              confirmPasswordError.textContent = "";
          }
    
          registerButton.disabled = !(isEmailValid && isAgeValid && isPasswordValid && doPasswordsMatch && areFieldsFilled);
      }
    
      emailInput.addEventListener("input", function () {
          touchedFields.email = true; 
          validateForm();
      });
    
      passwordInput.addEventListener("input", function () {
          touchedFields.password = true;
          validateForm();
      });
    
      confirmPasswordInput.addEventListener("input", function () {
          touchedFields.confirmPassword = true;
          validateForm();
      });
    
      birthInput.addEventListener("input", function () {
          touchedFields.birthDate = true;
          validateForm(); 
      });
    
      document.querySelectorAll("input, select").forEach(input => {
          input.addEventListener("input", function () {
              touchedFields[input.id] = true;  
              validateForm();
          });
      });
    
      registerButton.disabled = true;
    });


// JavaScript Functions LogIn Page (index)
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email-login");
    const passwordInput = document.getElementById("password-login");
    const loginButton = document.getElementById("login-button");
    const emailError = document.getElementById("email-login-error"); 
  
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const isEmailValid = emailPattern.test(email); 
        const isPasswordFilled = password !== ""; 
  
        loginButton.disabled = !(isEmailValid && isPasswordFilled);
    }
  
    emailInput.addEventListener("input", function () {
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.value)) {
            emailError.textContent = "Formato de email no válido"; 
            emailError.style.color = "red";
        } else {
            emailError.textContent = "";
        }
        validateForm(); 
    });
  
    passwordInput.addEventListener("input", validateForm);
    loginButton.disabled = true; 
  });
  
  
  
// JavaScript Functions Forgot Password Page
function generateRandomPassword() {
    const length = 8;  
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);  
        password += characters[randomIndex];  
    }
    return password;  
}


// JavaScript Functions Motos Detalles 
function changeImage(imageName) {
    document.getElementById('main-img').src = 'imgs/motos/' + imageName; // Cambiar el src de la imagen principal
  }
  
  function addToCart(name, imgSrc, description) {
    const product = { name, imgSrc, description }; // Crear un objeto del producto
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtener el carrito actual del localStorage
  
    cart.push(product); // Añadir el nuevo producto al carrito
    localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado en localStorage
    alert("Producto añadido a la cesta");
  }