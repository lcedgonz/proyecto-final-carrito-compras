document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("formRegistro");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("registerUsername").value;
      const password = document.getElementById("registerPassword").value;
      const rememberMe = document.getElementById("registerRememberMe").checked;
      const errorMessage = document.getElementById("registerErrorMessage");
      const successMessage = document.getElementById("registerSuccessMessage");


      errorMessage.style.display = "none";
      successMessage.style.display = "none";

      if (!username || !password) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Por favor, complete todos los campos. :)";
        return;
      }

      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, rememberMe }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Registro exitoso:", data);
          successMessage.style.display = "block";
          successMessage.textContent = "¡Tu registro ha sido exitoso! Redirigiendo...";
          setTimeout(() => {
            window.location.href = "/user/dashboard";
          }, 2000);
        } else {
          console.log("Error en el registro:", data.message);
          errorMessage.style.display = "block";
          errorMessage.textContent = data.message || "Error en el registro.";
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        errorMessage.style.display = "block";
        errorMessage.textContent = "Oh, oh. Ha habido un error. Intente de nuevo. :(";
      }
    });
  } else {
    console.error("Ups. El formulario de registro no se encontró.");
  }
});
