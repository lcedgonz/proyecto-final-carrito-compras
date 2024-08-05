document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginButton').addEventListener('click', async function(event) {
      event.preventDefault();
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('flexCheckDefault').checked;
      const errorMessage = document.getElementById('errorMessage');
  
      if (!username || !password) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Por favor, complete todos los campos.';
        return;
      }
  
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {

          if (rememberMe) {
            document.cookie = `sessionToken=${data.sessionToken}; max-age=604800; path=/`;
          }

            if (data.user.role === 'admin') {
                window.location.href = '/admin/dashboard';
              } else {
                window.location.href = '/user/dashboard';
              }
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message || 'Usuario/contraseña no encontrada. Intente de nuevo.';
        }
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Ha habido un error. Intente de nuevo.';
      }
    });
  });