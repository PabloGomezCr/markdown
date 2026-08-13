const defaultPosts = [
  {id:1,title:'Entrega de informes del II trimestre',body:'Los informes estarán disponibles para las familias a partir del viernes 21 de agosto.',date:'12 AGO 2026',author:'Dirección',important:true},
  {id:2,title:'Feria Científica Institucional',body:'La exposición de proyectos se realizará en el gimnasio. Invitamos a toda la comunidad educativa.',date:'10 AGO 2026',author:'Comité de Ciencias'},
  {id:3,title:'Mantenimiento del comedor',body:'El comedor permanecerá cerrado el próximo lunes. Se brindará alimentación en el salón multiuso.',date:'08 AGO 2026',author:'Administración'}
];
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
let posts;
try { posts = JSON.parse(localStorage.getItem('aulaclara-posts')) || defaultPosts; } catch { posts = defaultPosts; }
const $ = selector => document.querySelector(selector);

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2600);
}

function renderPosts() {
  $('#posts-list').innerHTML = posts.map(post => `<article class="post-card ${post.important ? 'important' : ''}"><p class="eyebrow">${post.important ? 'Importante' : 'Comunicado'}</p><h2>${post.title}</h2><p>${post.body}</p><footer><span>${post.author}</span><time>${post.date}</time></footer></article>`).join('');
}

$('#user-name').textContent = profile.name;
$('#user-role').textContent = profile.label;
$('#avatar').textContent = profile.initials;
$('.role-admin').hidden = role !== 'admin';
$('.teacher-admin').hidden = role === 'family';
$('#new-post').addEventListener('click', () => $('#modal').showModal());
$('#publish-post').addEventListener('click', event => {
  event.preventDefault();
  const title = $('#post-title').value.trim();
  const body = $('#post-body').value.trim();
  if (!title || !body) return;
  posts.unshift({id:Date.now(), title, body, important:$('#post-important').checked, date:new Intl.DateTimeFormat('es-CR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date()).toUpperCase(), author:profile.label});
  localStorage.setItem('aulaclara-posts', JSON.stringify(posts));
  renderPosts();
  $('#modal-form').reset();
  $('#modal').close();
  toast('Comunicado publicado');
});
$('#menu-button').addEventListener('click', () => {
  const open = $('#sidebar').classList.toggle('open');
  $('#menu-button').setAttribute('aria-expanded', String(open));
});
renderPosts();
