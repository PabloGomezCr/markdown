const logoutButton = document.querySelector('#logout');

if (logoutButton) {
  const logoutDialog = document.createElement('dialog');
  logoutDialog.id = 'logout-dialog';
  logoutDialog.setAttribute('aria-labelledby', 'logout-title');
  logoutDialog.innerHTML = `
    <form method="dialog" class="confirm-dialog">
      <div class="modal-head">
        <div>
          <p class="eyebrow">Cerrar sesión</p>
          <h2 id="logout-title">¿Deseas salir?</h2>
        </div>
        <button class="icon-button" value="cancel" aria-label="Cerrar">×</button>
      </div>
      <p class="muted">Tendrás que ingresar nuevamente para volver a la intranet.</p>
      <div class="modal-actions">
        <button class="secondary" value="cancel">Cancelar</button>
        <button class="primary" value="confirm">Sí, deseo salir</button>
      </div>
    </form>
  `;
  document.body.append(logoutDialog);

  logoutButton.addEventListener('click', () => logoutDialog.showModal());
  logoutDialog.addEventListener('close', () => {
    if (logoutDialog.returnValue !== 'confirm') return;
    sessionStorage.removeItem('aulaclara-session');
    window.location.href = 'index.html';
  });
}
