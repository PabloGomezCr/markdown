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
  ],
  activities: [
    { id: 1, date: '2026-08-14', title: 'Reunión de personal', detail: 'Sala de profesores · 2:30 p. m.' },
    { id: 2, date: '2026-08-17', title: 'Examen de Matemática', detail: 'Octavo año · 8:00 a. m.' },
    { id: 3, date: '2026-08-19', title: 'Feria Científica', detail: 'Gimnasio institucional · 9:00 a. m.' }
  ]
};

const profiles = {
  admin: {
    name: 'Ana Rodríguez',
    label: 'Administración',
    initials: 'AR',
    copy: 'Este es el resumen de la institución para hoy.'
  },
  teacher: {
    name: 'Luis Vargas',
    label: 'Docente',
    initials: 'LV',
    copy: 'Tus grupos, actividades y avisos para hoy.'
  },
  family: {
    name: 'Sofía Mora',
    label: 'Estudiante / familia',
    initials: 'SM',
    copy: 'Estas son tus novedades académicas para hoy.'
  }
};

const sessionKey = 'aulaclara-session';
const page = document.body.dataset.page;
const $ = (selector) => document.querySelector(selector);

const store = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(`aulaclara-${key}`)) || seed[key];
    } catch {
      return seed[key];
    }
  },

  set(key, value) {
    localStorage.setItem(`aulaclara-${key}`, JSON.stringify(value));
  }
};

function getRole() {
  const role = sessionStorage.getItem(sessionKey);
  return profiles[role] ? role : null;
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

function showToast(message) {
  const toast = $('#toast');

  toast.textContent = message;
  toast.classList.add('show');

  window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
function activityDate(date) {
  const value = new Date(`${date}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat('es-CR', { day: '2-digit' }).format(value),
    month: new Intl.DateTimeFormat('es-CR', { month: 'short' }).format(value).replace('.', '').toUpperCase(),
    long: new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }).format(value)
  };
}

function protectPage() {
  if (page === 'login') {
    return null;
  }

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

  if (adminLink) {
    adminLink.hidden = role !== 'admin';
  }

  $('#menu-button').addEventListener('click', () => {
    const open = $('#sidebar').classList.toggle('open');

    $('#menu-button').setAttribute(
      'aria-expanded',
      String(open)
    );
  });
}

function setupLogin() {
  if (getRole()) {
    window.location.replace('inicio.html');
    return;
  }

  $('#login-form').addEventListener('submit', (event) => {
    event.preventDefault();

    sessionStorage.setItem(
      sessionKey,
      $('#role-select').value
    );

    window.location.href = 'inicio.html';
  });

  $('#toggle-password').addEventListener('click', () => {
    const password = $('#password');

    password.type =
      password.type === 'password'
        ? 'text'
        : 'password';

    $('#toggle-password').setAttribute(
      'aria-label',
      password.type === 'password'
        ? 'Mostrar contraseña'
        : 'Ocultar contraseña'
    );
  });
}

function renderHome(role) {
  const profile = profiles[role];

  $('#first-name').textContent =
    profile.name.split(' ')[0];

  $('#welcome-copy').textContent =
    profile.copy;

  $('#today').textContent =
    new Intl.DateTimeFormat(
      'es-CR',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }
    ).format(new Date());

  const stats =
    role === 'admin'
      ? [
          ['Matrícula', '486', '↑ 12 este año'],
          ['Personal', '42', 'Plantilla activa'],
          ['Asistencia hoy', '94%', '↑ 2% semanal'],
          ['Comunicados', '3', 'Sin leer']
        ]
      : role === 'teacher'
        ? [
            ['Grupos', '4', '128 estudiantes'],
            ['Clases hoy', '5', 'Próxima 10:20'],
            ['Asistencia', '94%', 'Promedio semanal'],
            ['Pendientes', '7', 'Por calificar']
          ]
        : [
            ['Promedio', '91', 'Muy bueno'],
            ['Asistencia', '97%', 'Al día'],
            ['Próxima clase', 'Matemática', '10:20 a. m.'],
            ['Avisos', '3', 'Sin leer']
          ];

  $('#stats').innerHTML =
    stats
      .map(
        (item) => `
          <div class="stat${item[0] === 'Comunicados' || item[0] === 'Avisos' ? ' stat-link' : ''}">
            <span>${item[0]}</span>
            <strong>${item[1]}</strong>
            ${item[0] === 'Comunicados' || item[0] === 'Avisos' ? `<a href="comunicados.html">${item[2]} →</a>` : `<small>${item[2]}</small>`}
          </div>
        `
      )
      .join('');

  const activities = store.get('activities').sort((a, b) => a.date.localeCompare(b.date));

  $('#activities').innerHTML =
    activities
      .map(
        (item) => `
          <a class="activity content-link" href="academico.html">
            <div class="date-box">
              <strong>${activityDate(item.date).day}</strong>
              <small>${activityDate(item.date).month}</small>
            </div>

            <div>
              <strong>${item.title}</strong>
              <small>${item.detail}</small>
            </div>
          </a>
        `
      )
      .join('');

  $('#recent-posts').innerHTML =
    store
      .get('posts')
      .slice(0, 3)
      .map(
        (post) => `
          <a class="post-mini content-link" href="comunicados.html">
            <span class="post-dot"></span>

            <div>
              <strong>${post.title}</strong>
              <small>${post.author} · ${post.date}</small>
            </div>
          </a>
        `
      )
      .join('');
}

function setupUsers() {
  let users = store.get('users');

  function renderUsers() {
    const query =
      $('#user-search').value.toLowerCase();

    const filter =
      $('#role-filter').value;

    const filtered = users.filter(
      (user) =>
        (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        ) &&
        (
          filter === 'all' ||
          user.role === filter
        )
    );

    $('#users-body').innerHTML =
      filtered
        .map(
          (user) => `
            <tr>
              <td>
                <div class="person">
                  <span class="person-avatar">
                    ${initials(user.name)}
                  </span>

                  <div>
                    <strong>${user.name}</strong>
                    <small>${user.email}</small>
                  </div>
                </div>
              </td>

              <td>${user.role}</td>

              <td>
                <span class="status ${
                  user.active
                    ? 'success'
                    : 'inactive'
                }">
                  ${
                    user.active
                      ? 'Activo'
                      : 'Inactivo'
                  }
                </span>
              </td>

              <td>
                <button
                  class="table-action edit-user"
                  data-id="${user.id}"
                >
                  Editar
                </button>
              </td>
            </tr>
          `
        )
        .join('') ||
      '<tr><td colspan="4">No hay resultados.</td></tr>';
  }

  function openUserModal(user) {
    $('#modal-eyebrow').textContent =
      user
        ? 'Editar registro'
        : 'Nuevo registro';

    $('#modal-title').textContent =
      user
        ? 'Editar persona'
        : 'Agregar persona';

    $('#modal-fields').innerHTML = `
      <label for="m-name">
        Nombre completo
      </label>

      <input
        id="m-name"
        required
        value="${user?.name || ''}"
      >

      <label for="m-email">
        Correo institucional
      </label>

      <input
        id="m-email"
        type="email"
        required
        value="${user?.email || ''}"
      >

      <label for="m-role">
        Perfil
      </label>

      <select id="m-role">
        <option ${
          user?.role === 'Administración'
            ? 'selected'
            : ''
        }>
          Administración
        </option>

        <option ${
          user?.role === 'Docente'
            ? 'selected'
            : ''
        }>
          Docente
        </option>

        <option ${
          user?.role === 'Estudiante / familia'
            ? 'selected'
            : ''
        }>
          Estudiante / familia
        </option>
      </select>

      <label>
        <input
          id="m-active"
          type="checkbox"
          class="inline-control"
          ${
            user?.active !== false
              ? 'checked'
              : ''
          }
        >
        Cuenta activa
      </label>
    `;

    $('#modal-submit').onclick = (event) => {
      event.preventDefault();

      if (!$('#modal-form').reportValidity()) {
        return;
      }

      const data = {
        id: user?.id || Date.now(),
        name: $('#m-name').value.trim(),
        email: $('#m-email').value.trim(),
        role: $('#m-role').value,
        active: $('#m-active').checked
      };

      users = user
        ? users.map(
            (item) =>
              item.id === user.id
                ? data
                : item
          )
        : [...users, data];

      store.set('users', users);

      renderUsers();

      $('#modal').close();

      showToast(
        'Usuario guardado correctamente'
      );
    };

    $('#modal').showModal();
  }

  $('#user-search').addEventListener(
    'input',
    renderUsers
  );

  $('#role-filter').addEventListener(
    'change',
    renderUsers
  );

  $('#new-user').addEventListener(
    'click',
    () => openUserModal()
  );

  $('#users-body').addEventListener(
    'click',
    (event) => {
      const button =
        event.target.closest('.edit-user');

      if (button) {
        openUserModal(
          users.find(
            (user) =>
              user.id === Number(
                button.dataset.id
              )
          )
        );
      }
    }
  );

  renderUsers();
}

function setupCalendar(role) {
  const dialog = $('#calendar-dialog');
  const form = $('#activity-form');
  let activities = store.get('activities');

  function resetActivityForm() {
    form.reset();
    $('#activity-id').value = '';
    $('#cancel-activity').hidden = true;
  }
  function renderCalendar() {
    activities.sort((a, b) => a.date.localeCompare(b.date));
    $('#calendar-list').innerHTML = activities.length ? activities.map((item) => `
      <article class="calendar-item">
        <time datetime="${item.date}">${activityDate(item.date).long}</time>
        <div><strong>${item.title}</strong><small>${item.detail}</small></div>
        ${role === 'family' ? '' : `<div class="calendar-actions"><button class="table-action edit-activity" data-id="${item.id}">Editar</button><button class="table-action delete-activity" data-id="${item.id}">Eliminar</button></div>`}
      </article>`).join('') : '<p class="muted">No hay actividades registradas.</p>';
  }
  $('#open-calendar').addEventListener('click', () => {
    renderCalendar();
    dialog.showModal();
  });
  $('#close-calendar').addEventListener('click', () => dialog.close());
  if (role === 'family') {
    form.hidden = true;
    return;
  }
  $('#cancel-activity').addEventListener('click', resetActivityForm);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = Number($('#activity-id').value);
    const data = { id: id || Date.now(), title: $('#activity-title').value.trim(), date: $('#activity-date').value, detail: $('#activity-detail').value.trim() };
    activities = id ? activities.map((item) => item.id === id ? data : item) : [...activities, data];
    store.set('activities', activities);
    resetActivityForm();
    renderCalendar();
    renderHome(role);
    showToast(id ? 'Actividad actualizada' : 'Actividad agregada');
  });
  $('#calendar-list').addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit-activity');
    const deleteButton = event.target.closest('.delete-activity');
    if (editButton) {
      const item = activities.find((activity) => activity.id === Number(editButton.dataset.id));
      $('#activity-id').value = item.id;
      $('#activity-title').value = item.title;
      $('#activity-date').value = item.date;
      $('#activity-detail').value = item.detail;
      $('#cancel-activity').hidden = false;
      $('#activity-title').focus();
    }
    if (deleteButton) {
      activities = activities.filter((item) => item.id !== Number(deleteButton.dataset.id));
      store.set('activities', activities);
      renderCalendar();
      renderHome(role);
      showToast('Actividad eliminada');
    }
  });
}

if (page === 'login') {
  setupLogin();
} else {
  const role = protectPage();

  if (role) {
    setupShell(role);

    if (page === 'inicio') {
      renderHome(role);
      setupCalendar(role);
    }

    if (page === 'usuarios') {
      setupUsers();
    }
  }
}
