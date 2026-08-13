const seed = {
  users: [
    { id: 1, name: 'Ana Rodríguez', email: 'ana.rodriguez@valleverde.ed.cr', role: 'Administración', active: true },
    { id: 2, name: 'Luis Vargas', email: 'luis.vargas@valleverde.ed.cr', role: 'Docente', active: true },
    { id: 3, name: 'María Chaves', email: 'maria.chaves@valleverde.ed.cr', role: 'Docente', active: true },
    { id: 4, name: 'Sofía Mora', email: 'familia.mora@est.valleverde.ed.cr', role: 'Estudiante / familia', active: true },
    { id: 5, name: 'Diego Solano', email: 'familia.solano@est.valleverde.ed.cr', role: 'Estudiante / familia', active: false }
  ],
  posts: [
    { id: 1, title: 'Entrega de informes del II trimestre', date: '12 AGO 2026', author: 'Dirección' },
    { id: 2, title: 'Feria Científica Institucional', date: '10 AGO 2026', author: 'Comité de Ciencias' },
    { id: 3, title: 'Mantenimiento del comedor', date: '08 AGO 2026', author: 'Administración' }
  ]
};
const profiles = {
  admin: { name: 'Ana Rodríguez', label: 'Administración', initials: 'AR', copy: 'Este es el resumen de la institución para hoy.' },
  teacher: { name: 'Luis Vargas', label: 'Docente', initials: 'LV', copy: 'Tus grupos, actividades y avisos para hoy.' },
  family: { name: 'Sofía Mora', label: 'Estudiante / familia', initials: 'SM', copy: 'Estas son tus novedades académicas para hoy.' }
};
const sessionKey = 'aulaclara-session';
const page = document.body.dataset.page;
const $ = (selector) => document.querySelector(selector);
const store = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(`aulaclara-${key}`)) || seed[key]; } catch { return seed[key]; }
  },
  set(key, value) { localStorage.setItem(`aulaclara-${key}`, JSON.stringify(value)); }
};

function getRole() {
  const role = localStorage.getItem(sessionKey);
  return profiles[role] ? role : null;
}
function initials(name) { return name.split(' ').slice(0, 2).map((part) => part[0]).join(''); }
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}
function protectPage() {
  if (page === 'login') return null;
  const role = getRole();
  if (!role) {
    window.location.replace('index.html');
    return null;
  }
  if (page === 'usuarios' && role !== 'admin') {
    window.location.replace('inicio.html');
    return null;
  }
  return role;
}
function setupShell(role) {
  const profile = profiles[role];
  $('#user-name').textContent = profile.name;
  $('#user-role').textContent = profile.label;
  $('#avatar').textContent = profile.initials;
  const adminLink = $('.role-admin');
  if (adminLink) adminLink.hidden = role !== 'admin';
  $('#logout').addEventListener('click', () => {
    localStorage.removeItem(sessionKey);
    window.location.href = 'index.html';
  });
  $('#menu-button').addEventListener('click', () => {
    const open = $('#sidebar').classList.toggle('open');
    $('#menu-button').setAttribute('aria-expanded', String(open));
  });
}
function setupLogin() {
  if (getRole()) {
    window.location.replace('inicio.html');
    return;
  }
  $('#login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem(sessionKey, $('#role-select').value);
    window.location.href = 'inicio.html';
  });
  $('#toggle-password').addEventListener('click', () => {
    const password = $('#password');
    password.type = password.type === 'password' ? 'text' : 'password';
    $('#toggle-password').setAttribute('aria-label', password.type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
  });
}
function renderHome(role) {
  const profile = profiles[role];
  $('#first-name').textContent = profile.name.split(' ')[0];
  $('#welcome-copy').textContent = profile.copy;
  $('#today').textContent = new Intl.DateTimeFormat('es-CR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const stats = role === 'admin'
    ? [['Matrícula', '486', '↑ 12 este año'], ['Personal', '42', 'Plantilla activa'], ['Asistencia hoy', '94%', '↑ 2% semanal'], ['Comunicados', '3', 'Sin leer']]
    : role === 'teacher'
      ? [['Grupos', '4', '128 estudiantes'], ['Clases hoy', '5', 'Próxima 10:20'], ['Asistencia', '94%', 'Promedio semanal'], ['Pendientes', '7', 'Por calificar']]
      : [['Promedio', '91', 'Muy bueno'], ['Asistencia', '97%', 'Al día'], ['Próxima clase', 'Matemática', '10:20 a. m.'], ['Avisos', '3', 'Sin leer']];
  $('#stats').innerHTML = stats.map((item) => `<div class="stat"><span>${item[0]}</span><strong>${item[1]}</strong><small>${item[2]}</small></div>`).join('');
  const activities = [['14', 'AGO', 'Reunión de personal', 'Sala de profesores · 2:30 p. m.'], ['17', 'AGO', 'Examen de Matemática', 'Octavo año · 8:00 a. m.'], ['19', 'AGO', 'Feria Científica', 'Gimnasio institucional · 9:00 a. m.']];
  $('#activities').innerHTML = activities.map((item) => `<div class="activity"><div class="date-box"><strong>${item[0]}</strong><small>${item[1]}</small></div><div><strong>${item[2]}</strong><small>${item[3]}</small></div></div>`).join('');
  $('#recent-posts').innerHTML = store.get('posts').slice(0, 3).map((post) => `<div class="post-mini"><span class="post-dot"></span><div><strong>${post.title}</strong><small>${post.author} · ${post.date}</small></div></div>`).join('');
}
function setupUsers() {
  let users = store.get('users');
  function renderUsers() {
    const query = $('#user-search').value.toLowerCase();
    const filter = $('#role-filter').value;
    const filtered = users.filter((user) => (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) && (filter === 'all' || user.role === filter));
    $('#users-body').innerHTML = filtered.map((user) => `<tr><td><div class="person"><span class="person-avatar">${initials(user.name)}</span><div><strong>${user.name}</strong><small>${user.email}</small></div></div></td><td>${user.role}</td><td><span class="status ${user.active ? 'success' : 'inactive'}">${user.active ? 'Activo' : 'Inactivo'}</span></td><td><button class="table-action edit-user" data-id="${user.id}">Editar</button></td></tr>`).join('') || '<tr><td colspan="4">No hay resultados.</td></tr>';
  }
  function openUserModal(user) {
    $('#modal-eyebrow').textContent = user ? 'Editar registro' : 'Nuevo registro';
    $('#modal-title').textContent = user ? 'Editar persona' : 'Agregar persona';
    $('#modal-fields').innerHTML = `<label for="m-name">Nombre completo</label><input id="m-name" required value="${user?.name || ''}"><label for="m-email">Correo institucional</label><input id="m-email" type="email" required value="${user?.email || ''}"><label for="m-role">Perfil</label><select id="m-role"><option ${user?.role === 'Administración' ? 'selected' : ''}>Administración</option><option ${user?.role === 'Docente' ? 'selected' : ''}>Docente</option><option ${user?.role === 'Estudiante / familia' ? 'selected' : ''}>Estudiante / familia</option></select><label><input id="m-active" type="checkbox" class="inline-control" ${user?.active !== false ? 'checked' : ''}> Cuenta activa</label>`;
    $('#modal-submit').onclick = (event) => {
      event.preventDefault();
      if (!$('#modal-form').reportValidity()) return;
      const data = { id: user?.id || Date.now(), name: $('#m-name').value.trim(), email: $('#m-email').value.trim(), role: $('#m-role').value, active: $('#m-active').checked };
      users = user ? users.map((item) => item.id === user.id ? data : item) : [...users, data];
      store.set('users', users);
      renderUsers();
      $('#modal').close();
      showToast('Usuario guardado correctamente');
    };
    $('#modal').showModal();
  }
  $('#user-search').addEventListener('input', renderUsers);
  $('#role-filter').addEventListener('change', renderUsers);
  $('#new-user').addEventListener('click', () => openUserModal());
  $('#users-body').addEventListener('click', (event) => {
    const button = event.target.closest('.edit-user');
    if (button) openUserModal(users.find((user) => user.id === Number(button.dataset.id)));
  });
  renderUsers();
}

if (page === 'login') {
  setupLogin();
} else {
  const role = protectPage();
  if (role) {
    setupShell(role);
    if (page === 'inicio') renderHome(role);
    if (page === 'usuarios') setupUsers();
  }
}
