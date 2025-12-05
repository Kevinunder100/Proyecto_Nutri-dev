document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const navActions = document.querySelector('.nav-actions');

    if (navActions) {
        if (token) {
            // User is logged in
            navActions.innerHTML = `
      <a href="#" class="btn btn-outline" id="logout-btn">Cerrar Sesión</a>
    `;

            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            // User is not logged in
            navActions.innerHTML = `
      <a href="login.html" class="btn btn-outline">Ingresar</a>
      <a href="registrar.html" class="btn btn-primary">Crear cuenta</a>
    `;
        }
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
