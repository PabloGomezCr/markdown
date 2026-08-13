const siteSearch = document.querySelector('#site-search');
const searchResults = document.querySelector('#search-results');

if (siteSearch && searchResults) {
  const readStored = (key, fallback = []) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const pages = [
    { title: 'Inicio', detail: 'Panel, indicadores y próximas actividades', href: 'inicio.html' },
    { title: 'Académico', detail: 'Calificaciones, asignaturas y asistencia', href: 'academico.html' },
    { title: 'Comunicados', detail: 'Avisos y circulares institucionales', href: 'comunicados.html' }
  ];
  const searchDefaultActivities = [
    { date: '2026-08-14', title: 'Reunión de personal', detail: 'Sala de profesores · 2:30 p. m.' },
    { date: '2026-08-17', title: 'Examen de Matemática', detail: 'Octavo año · 8:00 a. m.' },
    { date: '2026-08-19', title: 'Feria Científica', detail: 'Gimnasio institucional · 9:00 a. m.' }
  ];
  const searchDefaultPosts = [
    { title: 'Entrega de informes del II trimestre', date: '12 AGO 2026', author: 'Dirección' },
    { title: 'Feria Científica Institucional', date: '10 AGO 2026', author: 'Comité de Ciencias' },
    { title: 'Mantenimiento del comedor', date: '08 AGO 2026', author: 'Administración' }
  ];
  if (sessionStorage.getItem('aulaclara-session') === 'admin') {
    pages.splice(1, 0, { title: 'Usuarios', detail: 'Personas, perfiles y estados', href: 'usuarios.html' });
  }

  const normalize = (value) => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const getEntries = () => {
    const activities = readStored('aulaclara-activities', searchDefaultActivities).map((item) => {
      const readableDate = new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${item.date}T12:00:00`));
      return { title: item.title, detail: `${item.date} · ${readableDate} · ${item.detail}`, href: 'inicio.html#activities' };
    });
    const posts = readStored('aulaclara-posts', searchDefaultPosts).map((item) => ({ title: item.title, detail: `${item.date} · ${item.author} · ${item.body || ''}`, href: 'comunicados.html' }));
    return [...pages, ...activities, ...posts];
  };
  const closeSearch = () => { searchResults.hidden = true; };

  siteSearch.addEventListener('input', () => {
    const query = normalize(siteSearch.value.trim());
    if (!query) {
      closeSearch();
      return;
    }
    const matches = getEntries().filter((item) => normalize(`${item.title} ${item.detail}`).includes(query)).slice(0, 8);
    searchResults.innerHTML = matches.length
      ? matches.map((item) => `<a href="${item.href}"><strong>${item.title}</strong><small>${item.detail}</small></a>`).join('')
      : '<p>No se encontraron resultados.</p>';
    searchResults.hidden = false;
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.global-search')) closeSearch();
  });
  siteSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSearch();
  });
}
