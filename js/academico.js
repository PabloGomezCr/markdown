const defaultGrades = [
  {name:'Sofía Mora',task:92,project:88,exam:95,attendance:97},
  {name:'Diego Solano',task:78,project:84,exam:81,attendance:91},
  {name:'Valentina Rojas',task:86,project:91,exam:89,attendance:95},
  {name:'Mateo Herrera',task:94,project:96,exam:90,attendance:99}
];
const profiles = {
  admin:{name:'Ana Rodríguez',label:'Administración',initials:'AR'},
  teacher:{name:'Luis Vargas',label:'Docente',initials:'LV'},
  family:{name:'Sofía Mora',label:'Estudiante / familia',initials:'SM'}
};
const role = sessionStorage.getItem('aulaclara-role') || 'admin';
const profile = profiles[role] || profiles.admin;
let grades;
try { grades = JSON.parse(localStorage.getItem('aulaclara-grades')) || defaultGrades; } catch { grades = defaultGrades; }
const $ = selector => document.querySelector(selector);

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2600);
}

function renderGrades() {
  const visible = role === 'family' ? grades.filter(grade => grade.name === 'Sofía Mora') : grades;
  $('#grades-body').innerHTML = visible.map(grade => {
    const index = grades.indexOf(grade);
    const average = Math.round((Number(grade.task) + Number(grade.project) + Number(grade.exam)) / 3);
    const cells = ['task','project','exam'].map(key => `<td><input class="grade-input" type="number" min="0" max="100" value="${grade[key]}" data-index="${index}" data-key="${key}" aria-label="${key} de ${grade.name}" ${role === 'family' ? 'disabled' : ''}></td>`).join('');
    return `<tr><td><strong>${grade.name}</strong></td>${cells}<td><strong>${average}</strong></td><td>${grade.attendance}%</td></tr>`;
  }).join('');
}

$('#user-name').textContent = profile.name;
$('#user-role').textContent = profile.label;
$('#avatar').textContent = profile.initials;
$('.role-admin').hidden = role !== 'admin';
$('.teacher-admin').hidden = role === 'family';
$('#academic-copy').textContent = role === 'family' ? 'Consulta tus calificaciones y asistencia.' : 'Calificaciones y asistencia del grupo.';
$('#grades-body').addEventListener('input', event => {
  if (!event.target.matches('.grade-input')) return;
  grades[Number(event.target.dataset.index)][event.target.dataset.key] = Math.max(0, Math.min(100, Number(event.target.value)));
  renderGrades();
});
$('#save-grades').addEventListener('click', () => {
  localStorage.setItem('aulaclara-grades', JSON.stringify(grades));
  toast('Calificaciones guardadas');
});
$('#menu-button').addEventListener('click', () => {
  const open = $('#sidebar').classList.toggle('open');
  $('#menu-button').setAttribute('aria-expanded', String(open));
});
$('#logout').addEventListener('click', () => {
  sessionStorage.removeItem('aulaclara-role');
  location.href = 'index.html';
});
renderGrades();
