const seed = {
  users: [
    {id:1,name:'Ana Rodríguez',email:'ana.rodriguez@valleverde.ed.cr',role:'Administración',active:true},
    {id:2,name:'Luis Vargas',email:'luis.vargas@valleverde.ed.cr',role:'Docente',active:true},
    {id:3,name:'María Chaves',email:'maria.chaves@valleverde.ed.cr',role:'Docente',active:true},
    {id:4,name:'Sofía Mora',email:'familia.mora@est.valleverde.ed.cr',role:'Estudiante / familia',active:true},
    {id:5,name:'Diego Solano',email:'familia.solano@est.valleverde.ed.cr',role:'Estudiante / familia',active:false}
  ],
  grades:[
    {name:'Sofía Mora',task:92,project:88,exam:95,attendance:97},
    {name:'Diego Solano',task:78,project:84,exam:81,attendance:91},
    {name:'Valentina Rojas',task:86,project:91,exam:89,attendance:95},
    {name:'Mateo Herrera',task:94,project:96,exam:90,attendance:99}
  ],
  posts:[
    {id:1,title:'Entrega de informes del II trimestre',body:'Los informes estarán disponibles para las familias a partir del viernes 21 de agosto.',date:'12 AGO 2026',author:'Dirección',important:true},
    {id:2,title:'Feria Científica Institucional',body:'La exposición de proyectos se realizará en el gimnasio. Invitamos a toda la comunidad educativa.',date:'10 AGO 2026',author:'Comité de Ciencias'},
    {id:3,title:'Mantenimiento del comedor',body:'El comedor permanecerá cerrado el próximo lunes. Se brindará alimentación en el salón multiuso.',date:'08 AGO 2026',author:'Administración'}
  ]
};

const store = {
  get(key){ try{return JSON.parse(localStorage.getItem(`aulaclara-${key}`)) || seed[key]}catch{return seed[key]} },
  set(key,value){localStorage.setItem(`aulaclara-${key}`,JSON.stringify(value))}
};
let users=store.get('users'), posts=store.get('posts'), role='admin';
const profiles={
  admin:{name:'Ana Rodríguez',label:'Administración',initials:'AR',copy:'Este es el resumen de la institución para hoy.'},
  teacher:{name:'Luis Vargas',label:'Docente',initials:'LV',copy:'Tus grupos, actividades y avisos para hoy.'},
  family:{name:'Sofía Mora',label:'Estudiante / familia',initials:'SM',copy:'Estas son tus novedades académicas para hoy.'}
};
const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];

function initials(name){return name.split(' ').slice(0,2).map(x=>x[0]).join('')}
function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function go(page){
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${page}`));
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $('#current-page').textContent=page[0].toUpperCase()+page.slice(1); $('#sidebar').classList.remove('open'); $('#menu-button').setAttribute('aria-expanded','false');
  $('#contenido').focus();
}
function applyRole(){
  const p=profiles[role]; $('#user-name').textContent=p.name;$('#user-role').textContent=p.label;$('#avatar').textContent=p.initials;$('#first-name').textContent=p.name.split(' ')[0];$('#welcome-copy').textContent=p.copy;
  $$('.role-admin').forEach(x=>x.hidden=role!=='admin');
  renderAll();
}
function renderStats(){
  const data=role==='admin'?[['Matrícula','486','↑ 12 este año'],['Personal','42','Plantilla activa'],['Asistencia hoy','94%','↑ 2% semanal'],['Comunicados','3','Sin leer']]:role==='teacher'?[['Grupos','4','128 estudiantes'],['Clases hoy','5','Próxima 10:20'],['Asistencia','94%','Promedio semanal'],['Pendientes','7','Por calificar']]:[['Promedio','91','Muy bueno'],['Asistencia','97%','Al día'],['Próxima clase','Matemática','10:20 a. m.'],['Avisos','3','Sin leer']];
  $('#stats').innerHTML=data.map(x=>`<div class="stat"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('');
}
function renderHome(){
  $('#today').textContent=new Intl.DateTimeFormat('es-CR',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  const acts=[['14','AGO','Reunión de personal','Sala de profesores · 2:30 p. m.'],['17','AGO','Examen de Matemática','Octavo año · 8:00 a. m.'],['19','AGO','Feria Científica','Gimnasio institucional · 9:00 a. m.']];
  $('#activities').innerHTML=acts.map(a=>`<div class="activity"><div class="date-box"><strong>${a[0]}</strong><small>${a[1]}</small></div><div><strong>${a[2]}</strong><small>${a[3]}</small></div></div>`).join('');
  $('#recent-posts').innerHTML=posts.slice(0,3).map(p=>`<div class="post-mini"><span class="post-dot"></span><div><strong>${p.title}</strong><small>${p.author} · ${p.date}</small></div></div>`).join('');
}
function renderUsers(){
  const q=$('#user-search').value.toLowerCase(), f=$('#role-filter').value;
  const filtered=users.filter(u=>(u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q))&&(f==='all'||u.role===f));
  $('#users-body').innerHTML=filtered.map(u=>`<tr><td><div class="person"><span class="person-avatar">${initials(u.name)}</span><div><strong>${u.name}</strong><small>${u.email}</small></div></div></td><td>${u.role}</td><td><span class="status ${u.active?'success':'inactive'}">${u.active?'Activo':'Inactivo'}</span></td><td><button class="table-action edit-user" data-id="${u.id}">Editar</button></td></tr>`).join('')||'<tr><td colspan="4">No hay resultados.</td></tr>';
}
function renderAll(){renderStats();renderHome();renderUsers()}

function userModal(user){
  $('#modal-eyebrow').textContent=user?'Editar registro':'Nuevo registro';$('#modal-title').textContent=user?'Editar persona':'Agregar persona';
  $('#modal-fields').innerHTML=`<label for="m-name">Nombre completo</label><input id="m-name" required value="${user?.name||''}"><label for="m-email">Correo institucional</label><input id="m-email" type="email" required value="${user?.email||''}"><label for="m-role">Perfil</label><select id="m-role"><option ${user?.role==='Administración'?'selected':''}>Administración</option><option ${user?.role==='Docente'?'selected':''}>Docente</option><option ${user?.role==='Estudiante / familia'?'selected':''}>Estudiante / familia</option></select><label><input id="m-active" type="checkbox" style="width:auto" ${user?.active!==false?'checked':''}> Cuenta activa</label>`;
  $('#modal-submit').onclick=(e)=>{e.preventDefault();const data={id:user?.id||Date.now(),name:$('#m-name').value.trim(),email:$('#m-email').value.trim(),role:$('#m-role').value,active:$('#m-active').checked};if(!data.name||!data.email)return;if(user) users=users.map(u=>u.id===user.id?data:u);else users.push(data);store.set('users',users);renderUsers();$('#modal').close();showToast('Usuario guardado correctamente')};$('#modal').showModal();
}
$('#login-form').addEventListener('submit',e=>{e.preventDefault();role=$('#role-select').value;sessionStorage.setItem('aulaclara-role',role);$('#login-view').hidden=true;$('#app-view').hidden=false;applyRole();go(location.hash==='#usuarios'&&role==='admin'?'usuarios':'inicio')});
$('#toggle-password').onclick=()=>{const p=$('#password');p.type=p.type==='password'?'text':'password';$('#toggle-password').setAttribute('aria-label',p.type==='password'?'Mostrar contraseña':'Ocultar contraseña')};
$('#logout').onclick=()=>{$('#app-view').hidden=true;$('#login-view').hidden=false};
$('#menu-button').onclick=()=>{const open=$('#sidebar').classList.toggle('open');$('#menu-button').setAttribute('aria-expanded',String(open))};
$$('.nav-item[data-page]').forEach(b=>b.onclick=()=>go(b.dataset.page));
$('#user-search').oninput=renderUsers;$('#role-filter').onchange=renderUsers;$('#new-user').onclick=()=>userModal();
$('#users-body').onclick=e=>{const b=e.target.closest('.edit-user');if(b)userModal(users.find(u=>u.id===+b.dataset.id))};
renderAll();
