const students = ['Sofía Mora', 'Diego Solano', 'Valentina Rojas', 'Mateo Herrera'];
const defaultAcademicData = {
  matematica: [
    {name:'Sofía Mora',task:92,project:88,exam:95,attendance:97},
    {name:'Diego Solano',task:78,project:84,exam:81,attendance:91},
    {name:'Valentina Rojas',task:86,project:91,exam:89,attendance:95},
    {name:'Mateo Herrera',task:94,project:96,exam:90,attendance:99}
  ],
  espanol: [
    {name:'Sofía Mora',task:90,project:94,exam:91,attendance:98},
    {name:'Diego Solano',task:85,project:79,exam:83,attendance:93},
    {name:'Valentina Rojas',task:93,project:95,exam:92,attendance:96},
    {name:'Mateo Herrera',task:88,project:86,exam:90,attendance:97}
  ],
  ciencias: [
    {name:'Sofía Mora',task:96,project:93,exam:94,attendance:97},
    {name:'Diego Solano',task:82,project:88,exam:80,attendance:92},
    {name:'Valentina Rojas',task:89,project:94,exam:91,attendance:98},
    {name:'Mateo Herrera',task:95,project:97,exam:93,attendance:99}
  ]
};
const subjectNames = {matematica:'Matemática 8°A', espanol:'Español 8°A', ciencias:'Ciencias 8°A'};
const fieldNames = {task:'Tarea 1', project:'Proyecto', exam:'Examen'};
const profiles = {
  admin:{name:'Ana Rodríguez',label:'Administración',initials:'AR'},
  teacher:{name:'Luis Vargas',label:'Docente',initials:'LV'},
  family:{name:'Sofía Mora',label:'Estudiante / familia',initials:'SM'}
};
const role = sessionStorage.getItem('aulaclara-session');
if (!profiles[role]) {
  document.body.hidden = true;
  location.replace('index.html');
}
const profile = profiles[role] || {name:'',label:'',initials:''};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let activeSubject = 'matematica';
let hasUnsavedChanges = false;
let academicData = loadAcademicData();

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaultAcademicData));
}

function loadAcademicData() {
  try {
    const savedBySubject = JSON.parse(localStorage.getItem('aulaclara-academic-data'));
    if (savedBySubject?.matematica && savedBySubject?.espanol && savedBySubject?.ciencias) return savedBySubject;

    // Migra las calificaciones de la versión anterior a la pestaña de Matemática.
    const legacyGrades = JSON.parse(localStorage.getItem('aulaclara-grades'));
    const data = cloneDefaults();
    if (Array.isArray(legacyGrades) && legacyGrades.length) data.matematica = legacyGrades;
    return data;
  } catch {
    return cloneDefaults();
  }
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2600);
}

function updateSaveStatus() {
  $('#save-status').textContent = hasUnsavedChanges ? 'Cambios sin guardar' : 'Al día';
  $('#save-status').classList.toggle('success', !hasUnsavedChanges);
  $('#save-status').classList.toggle('pending', hasUnsavedChanges);
}

function renderGrades() {
  const subjectGrades = academicData[activeSubject];
  const visible = role === 'family' ? subjectGrades.filter(grade => grade.name === 'Sofía Mora') : subjectGrades;
  $('#subject-title').textContent = `Registro de ${subjectNames[activeSubject]}`;
  $('#grades-panel').setAttribute('aria-labelledby', `tab-${activeSubject}`);
  $('#grades-body').innerHTML = visible.map(grade => {
    const index = subjectGrades.indexOf(grade);
    const average = Math.round((Number(grade.task) + Number(grade.project) + Number(grade.exam)) / 3);
    const cells = ['task','project','exam'].map(key => `<td><input class="grade-input" type="number" min="0" max="100" value="${grade[key]}" data-index="${index}" data-key="${key}" aria-label="${fieldNames[key]} de ${grade.name} en ${subjectNames[activeSubject]}" ${role === 'family' ? 'disabled' : ''}></td>`).join('');
    return `<tr><td><strong>${grade.name}</strong></td>${cells}<td class="average"><strong>${average}</strong></td><td>${grade.attendance}%</td></tr>`;
  }).join('');
  updateSaveStatus();
}

function selectSubject(subject) {
  activeSubject = subject;
  $$('.subject-tabs [role="tab"]').forEach(tab => {
    const selected = tab.dataset.subject === subject;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  renderGrades();
}

$('#user-name').textContent = profile.name;
$('#user-role').textContent = profile.label;
$('#avatar').textContent = profile.initials;
$('.role-admin').hidden = role !== 'admin';
$('.teacher-admin').hidden = role === 'family';
$('#academic-copy').textContent = role === 'family' ? 'Consulta tus calificaciones y asistencia por materia.' : 'Calificaciones y asistencia del grupo por materia.';

$('.subject-tabs').addEventListener('click', event => {
  const tab = event.target.closest('[data-subject]');
  if (tab) selectSubject(tab.dataset.subject);
});
$('.subject-tabs').addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const tabs = $$('.subject-tabs [role="tab"]');
  const current = tabs.findIndex(tab => tab.dataset.subject === activeSubject);
  const next = event.key === 'ArrowRight' ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
  selectSubject(tabs[next].dataset.subject);
  tabs[next].focus();
});
$('#grades-body').addEventListener('change', event => {
  if (!event.target.matches('.grade-input')) return;
  const input = event.target;
  const value = Math.max(0, Math.min(100, Number(input.value)));
  academicData[activeSubject][Number(input.dataset.index)][input.dataset.key] = value;
  input.value = value;
  hasUnsavedChanges = true;
  renderGrades();
});
$('#save-grades').addEventListener('click', () => {
  try {
    localStorage.setItem('aulaclara-academic-data', JSON.stringify(academicData));
    // Mantiene compatibilidad con el resumen anterior de Matemática.
    localStorage.setItem('aulaclara-grades', JSON.stringify(academicData.matematica));
    hasUnsavedChanges = false;
    updateSaveStatus();
    toast('Calificaciones de las tres materias guardadas');
  } catch {
    toast('No fue posible guardar las calificaciones');
  }
});
$('#menu-button').addEventListener('click', () => {
  const open = $('#sidebar').classList.toggle('open');
  $('#menu-button').setAttribute('aria-expanded', String(open));
});
window.addEventListener('beforeunload', event => {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
  event.returnValue = '';
});
selectSubject(activeSubject);
