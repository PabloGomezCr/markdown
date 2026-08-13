// ========================================
// COMUNICADOS - AULA CLARA
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // SELECTOR
  // ========================================

  const $ = selector => document.querySelector(selector);


  // ========================================
  // DATOS INICIALES
  // ========================================

  const defaultPosts = [
    {
      id: 1,
      title: 'Entrega de informes del II trimestre',
      body: 'Los informes estarán disponibles para las familias a partir del viernes 21 de agosto.',
      date: '12 AGO 2026',
      createdAt: '2026-08-12',
      author: 'Dirección',
      important: true
    },
    {
      id: 2,
      title: 'Feria Científica Institucional',
      body: 'La exposición de proyectos se realizará en el gimnasio. Invitamos a toda la comunidad educativa.',
      date: '10 AGO 2026',
      createdAt: '2026-08-10',
      author: 'Comité de Ciencias',
      important: false
    },
    {
      id: 3,
      title: 'Mantenimiento del comedor',
      body: 'El comedor permanecerá cerrado el próximo lunes. Se brindará alimentación en el salón multiuso.',
      date: '08 AGO 2026',
      createdAt: '2026-08-08',
      author: 'Administración',
      important: false
    }
  ];


  // ========================================
  // PERFILES
  // ========================================

  const profiles = {

    admin: {
      name: 'Ana Rodríguez',
      label: 'Administración',
      initials: 'AR'
    },

    teacher: {
      name: 'Luis Vargas',
      label: 'Docente',
      initials: 'LV'
    },

    family: {
      name: 'Sofía Mora',
      label: 'Estudiante / familia',
      initials: 'SM'
    }

  };


  // ========================================
  // SESIÓN
  // ========================================

  const role =
    sessionStorage.getItem('aulaclara-session');


  if (!profiles[role]) {

    document.body.hidden = true;

    location.replace('index.html');

    return;
  }


  const profile = profiles[role];


  const canManagePosts =
    role === 'admin' ||
    role === 'teacher';


  // ========================================
  // VARIABLES
  // ========================================

  let posts = [];

  let editingPostId = null;

  let postToDeleteId = null;

  let deletedPosts = [];


  // ========================================
  // CREAR BOTÓN DESHACER
  // ========================================

  function createUndoButton() {

    let undoButton =
      $('#undo-delete');


    if (undoButton) {
      return undoButton;
    }


    const clearButton =
      $('#clear-filters');


    if (!clearButton) {
      return null;
    }


    undoButton =
      document.createElement('button');


    undoButton.type = 'button';

    undoButton.id = 'undo-delete';

    undoButton.className = 'secondary';

    undoButton.textContent = '↶ Deshacer';

    undoButton.hidden = true;


    clearButton.before(undoButton);


    return undoButton;
  }


  const undoButton =
    createUndoButton();


  // ========================================
  // FECHA ACTUAL
  // ========================================

  const getTodayISO = () => {

    const date =
      new Date();


    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');


    const day =
      String(
        date.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;
  };


  // ========================================
  // FORMATEAR FECHA
  // ========================================

  const formatDate = isoDate => {

    const [year, month, day] =
      isoDate
        .split('-')
        .map(Number);


    const date =
      new Date(
        year,
        month - 1,
        day
      );


    return new Intl.DateTimeFormat(
      'es-CR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
      .format(date)
      .replace(/\./g, '')
      .toUpperCase();
  };


  // ========================================
  // CONVERTIR FECHAS ANTIGUAS
  // ========================================

  const parseOldDate = dateText => {

    if (!dateText) {
      return getTodayISO();
    }


    const months = {

      ENE: '01',
      FEB: '02',
      MAR: '03',
      ABR: '04',
      MAY: '05',
      JUN: '06',
      JUL: '07',
      AGO: '08',
      SEP: '09',
      OCT: '10',
      NOV: '11',
      DIC: '12'

    };


    const parts =
      dateText
        .replace(/\./g, '')
        .trim()
        .split(' ');


    if (parts.length < 3) {
      return getTodayISO();
    }


    const day =
      parts[0].padStart(2, '0');


    const month =
      months[parts[1]];


    const year =
      parts[2];


    if (!month) {
      return getTodayISO();
    }


    return `${year}-${month}-${day}`;
  };


  // ========================================
  // GUARDAR COMUNICADOS
  // ========================================

  function savePosts() {

    localStorage.setItem(
      'aulaclara-posts',
      JSON.stringify(posts)
    );

  }


  // ========================================
  // CARGAR COMUNICADOS
  // ========================================

  function loadPosts() {

    try {

      const savedPosts =
        localStorage.getItem(
          'aulaclara-posts'
        );


      if (savedPosts) {

        const parsedPosts =
          JSON.parse(savedPosts);


        if (Array.isArray(parsedPosts)) {

          posts =
            parsedPosts.map(post => ({

              ...post,

              important:
                Boolean(post.important),

              createdAt:
                post.createdAt ||
                parseOldDate(post.date)

            }));

        } else {

          posts =
            [...defaultPosts];

        }

      } else {

        posts =
          [...defaultPosts];

      }


      savePosts();

    } catch (error) {

      console.error(
        'Error cargando comunicados:',
        error
      );


      posts =
        [...defaultPosts];


      savePosts();

    }

  }


  // ========================================
  // SEGURIDAD PARA TEXTO
  // ========================================

  const escapeHTML = text => {

    return String(text ?? '')

      .replaceAll('&', '&amp;')

      .replaceAll('<', '&lt;')

      .replaceAll('>', '&gt;')

      .replaceAll('"', '&quot;')

      .replaceAll("'", '&#039;');

  };


  // ========================================
  // NOTIFICACIONES
  // ========================================

  function toast(message) {

    const element =
      $('#toast');


    if (!element) {
      return;
    }


    element.textContent =
      message;


    element.classList.add(
      'show'
    );


    setTimeout(() => {

      element.classList.remove(
        'show'
      );

    }, 2600);

  }


  // ========================================
  // NORMALIZAR TEXTO
  // ========================================

  const normalizeText = text => {

    return String(text ?? '')

      .normalize('NFD')

      .replace(
        /[\u0300-\u036f]/g,
        ''
      )

      .toLowerCase();

  };


  // ========================================
  // FILTRAR COMUNICADOS
  // ========================================

  function getFilteredPosts() {

    const searchInput =
      $('#search-posts');


    const dateInput =
      $('#filter-date');


    const importantSelect =
      $('#filter-important');


    const orderSelect =
      $('#filter-order');


    const search =
      normalizeText(
        searchInput
          ? searchInput.value.trim()
          : ''
      );


    const selectedDate =
      dateInput
        ? dateInput.value
        : '';


    const importantFilter =
      importantSelect
        ? importantSelect.value
        : 'all';


    const order =
      orderSelect
        ? orderSelect.value
        : 'newest';


    let filteredPosts =
      [...posts];


    // BÚSQUEDA

    if (search) {

      filteredPosts =
        filteredPosts.filter(post => {

          const searchableText =
            normalizeText(
              `${post.title} ${post.body} ${post.author}`
            );


          return searchableText.includes(
            search
          );

        });

    }


    // FECHA

    if (selectedDate) {

      filteredPosts =
        filteredPosts.filter(post => {

          return (
            post.createdAt ===
            selectedDate
          );

        });

    }


    // IMPORTANTES

    if (
      importantFilter ===
      'important'
    ) {

      filteredPosts =
        filteredPosts.filter(
          post => post.important
        );

    }


    // COMUNICADOS NORMALES

    if (
      importantFilter ===
      'normal'
    ) {

      filteredPosts =
        filteredPosts.filter(
          post => !post.important
        );

    }


    // MÁS RECIENTES

    if (order === 'newest') {

      filteredPosts.sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt
          )
      );

    }


    // MÁS ANTIGUOS

    if (order === 'oldest') {

      filteredPosts.sort(
        (a, b) =>
          a.createdAt.localeCompare(
            b.createdAt
          )
      );

    }


    // A - Z

    if (order === 'az') {

      filteredPosts.sort(
        (a, b) =>
          a.title.localeCompare(
            b.title,
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

    }


    // Z - A

    if (order === 'za') {

      filteredPosts.sort(
        (a, b) =>
          b.title.localeCompare(
            a.title,
            'es',
            {
              sensitivity: 'base'
            }
          )
      );

    }


    return filteredPosts;
  }


  // ========================================
  // MOSTRAR COMUNICADOS
  // ========================================

  function renderPosts() {

    const postsList =
      $('#posts-list');


    if (!postsList) {
      return;
    }


    const filteredPosts =
      getFilteredPosts();


    const postCount =
      $('#post-count');


    if (postCount) {

      postCount.textContent =
        posts.length;


      postCount.hidden =
        posts.length === 0;

    }


    if (
      filteredPosts.length === 0
    ) {

      postsList.innerHTML = `

        <div class="empty-state">

          <strong>
            No se encontraron comunicados
          </strong>

          <p>
            Pruebe cambiando los filtros o la búsqueda.
          </p>

        </div>

      `;


      return;
    }


    postsList.innerHTML =
      filteredPosts
        .map(post => {

          const actions =
            canManagePosts
              ? `

                <div class="post-actions">

                  <button
                    type="button"
                    class="secondary"
                    data-action="edit"
                    data-id="${post.id}"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    class="secondary"
                    data-action="delete"
                    data-id="${post.id}"
                  >
                    Eliminar
                  </button>

                </div>

              `
              : '';


          return `

            <article
              class="post-card ${
                post.important
                  ? 'important'
                  : ''
              }"
            >

              <p class="eyebrow">

                ${
                  post.important
                    ? 'Importante'
                    : 'Comunicado'
                }

              </p>


              <h2>
                ${escapeHTML(post.title)}
              </h2>


              <p>
                ${escapeHTML(post.body)}
              </p>


              <footer>

                <span>
                  ${escapeHTML(post.author)}
                </span>

                <time>
                  ${escapeHTML(post.date)}
                </time>

              </footer>


              ${actions}

            </article>

          `;

        })

        .join('');

  }


  // ========================================
  // INFORMACIÓN DEL USUARIO
  // ========================================

  const userName =
    $('#user-name');


  const userRole =
    $('#user-role');


  const avatar =
    $('#avatar');


  if (userName) {

    userName.textContent =
      profile.name;

  }


  if (userRole) {

    userRole.textContent =
      profile.label;

  }


  if (avatar) {

    avatar.textContent =
      profile.initials;

  }


  // ========================================
  // ROLES
  // ========================================

  document
    .querySelectorAll(
      '.role-admin'
    )
    .forEach(element => {

      element.hidden =
        role !== 'admin';

    });


  document
    .querySelectorAll(
      '.teacher-admin'
    )
    .forEach(element => {

      element.hidden =
        role === 'family';

    });


  // ========================================
  // MODAL CREAR / EDITAR
  // ========================================

  const modal =
    $('#modal');


  const modalForm =
    $('#modal-form');


  const newPostButton =
    $('#new-post');


  const closeModalButton =
    $('#close-modal');


  const cancelPostButton =
    $('#cancel-post');


  const modalTitle =
    $('#modal-title');


  const modalEyebrow =
    $('#modal-eyebrow');


  const publishButton =
    $('#publish-post');


  function resetModal() {

    editingPostId = null;


    if (modalForm) {

      modalForm.reset();

    }


    if (modalTitle) {

      modalTitle.textContent =
        'Nuevo comunicado';

    }


    if (modalEyebrow) {

      modalEyebrow.textContent =
        'Publicación oficial';

    }


    if (publishButton) {

      publishButton.textContent =
        'Publicar';

    }

  }


  function closeModal() {

    resetModal();


    if (
      modal &&
      modal.open
    ) {

      modal.close();

    }

  }


  if (
    newPostButton &&
    modal
  ) {

    newPostButton
      .addEventListener(
        'click',
        () => {

          resetModal();

          modal.showModal();

        }
      );

  }


  if (closeModalButton) {

    closeModalButton
      .addEventListener(
        'click',
        closeModal
      );

  }


  if (cancelPostButton) {

    cancelPostButton
      .addEventListener(
        'click',
        closeModal
      );

  }


  // ========================================
  // EDITAR COMUNICADO
  // ========================================

  function editPost(id) {

    const post =
      posts.find(post => {

        return (
          String(post.id) ===
          String(id)
        );

      });


    if (!post) {
      return;
    }


    editingPostId =
      String(post.id);


    const titleInput =
      $('#post-title');


    const bodyInput =
      $('#post-body');


    const importantInput =
      $('#post-important');


    if (titleInput) {

      titleInput.value =
        post.title;

    }


    if (bodyInput) {

      bodyInput.value =
        post.body;

    }


    if (importantInput) {

      importantInput.checked =
        Boolean(
          post.important
        );

    }


    if (modalTitle) {

      modalTitle.textContent =
        'Editar comunicado';

    }


    if (modalEyebrow) {

      modalEyebrow.textContent =
        'Modificar publicación';

    }


    if (publishButton) {

      publishButton.textContent =
        'Guardar cambios';

    }


    if (modal) {

      modal.showModal();

    }

  }


  // ========================================
  // ELIMINAR COMUNICADO
  // ========================================

  function deletePost(id) {

    postToDeleteId =
      String(id);


    const deleteModal =
      $('#delete-modal');


    if (deleteModal) {

      deleteModal.showModal();

    }

  }


  // ========================================
  // BOTONES DE LAS TARJETAS
  // ========================================

  const postsList =
    $('#posts-list');


  if (postsList) {

    postsList.addEventListener(
      'click',
      event => {

        const button =
          event.target.closest(
            '[data-action]'
          );


        if (!button) {
          return;
        }


        const action =
          button.dataset.action;


        const id =
          button.dataset.id;


        if (
          action === 'edit'
        ) {

          editPost(id);

        }


        if (
          action === 'delete'
        ) {

          deletePost(id);

        }

      }
    );

  }


  // ========================================
  // CANCELAR ELIMINACIÓN
  // ========================================

  const cancelDelete =
    $('#cancel-delete');


  if (cancelDelete) {

    cancelDelete
      .addEventListener(
        'click',
        () => {

          postToDeleteId =
            null;


          const deleteModal =
            $('#delete-modal');


          if (
            deleteModal &&
            deleteModal.open
          ) {

            deleteModal.close();

          }

        }
      );

  }


  // ========================================
  // CONFIRMAR ELIMINACIÓN
  // ========================================

  const confirmDelete =
    $('#confirm-delete');


  if (confirmDelete) {

    confirmDelete
      .addEventListener(
        'click',
        () => {

          if (
            postToDeleteId ===
            null
          ) {

            return;
          }


          const postIndex =
            posts.findIndex(
              post => {

                return (
                  String(post.id) ===
                  postToDeleteId
                );

              }
            );


          if (
            postIndex === -1
          ) {

            return;
          }


          const deletedPost =
            posts[postIndex];


          // GUARDAMOS EL COMUNICADO
          // ANTES DE ELIMINARLO

          deletedPosts.push({

            post: {
              ...deletedPost
            },

            index: postIndex

          });


          // ELIMINAR

          posts.splice(
            postIndex,
            1
          );


          savePosts();

          renderPosts();


          // MOSTRAR DESHACER

          if (undoButton) {

            undoButton.hidden =
              false;

          }


          const deleteModal =
            $('#delete-modal');


          if (
            deleteModal &&
            deleteModal.open
          ) {

            deleteModal.close();

          }


          postToDeleteId =
            null;


          toast(
            'Comunicado eliminado. Puede deshacer la acción.'
          );

        }
      );

  }


  // ========================================
  // DESHACER ELIMINACIÓN
  // ========================================

  if (undoButton) {

    undoButton.addEventListener(
      'click',
      () => {

        if (
          deletedPosts.length === 0
        ) {

          undoButton.hidden =
            true;

          return;
        }


        const lastDeleted =
          deletedPosts.pop();


        let restoreIndex =
          lastDeleted.index;


        if (
          restoreIndex >
          posts.length
        ) {

          restoreIndex =
            posts.length;

        }


        posts.splice(
          restoreIndex,
          0,
          lastDeleted.post
        );


        savePosts();

        renderPosts();


        if (
          deletedPosts.length === 0
        ) {

          undoButton.hidden =
            true;

        }


        toast(
          'Comunicado restaurado'
        );

      }
    );

  }


  // ========================================
  // CREAR / EDITAR
  // ========================================

  if (modalForm) {

    modalForm.addEventListener(
      'submit',
      event => {

        event.preventDefault();


        const titleInput =
          $('#post-title');


        const bodyInput =
          $('#post-body');


        const importantInput =
          $('#post-important');


        const title =
          titleInput
            ? titleInput.value.trim()
            : '';


        const body =
          bodyInput
            ? bodyInput.value.trim()
            : '';


        const important =
          importantInput
            ? importantInput.checked
            : false;


        if (
          !title ||
          !body
        ) {

          toast(
            'Complete el título y el mensaje'
          );

          return;
        }


        // ========================================
        // EDITAR
        // ========================================

        if (
          editingPostId !== null
        ) {

          const post =
            posts.find(post => {

              return (
                String(post.id) ===
                editingPostId
              );

            });


          if (!post) {
            return;
          }


          post.title =
            title;


          post.body =
            body;


          post.important =
            important;


          savePosts();

          renderPosts();

          closeModal();


          toast(
            'Comunicado actualizado'
          );


          return;
        }


        // ========================================
        // CREAR
        // ========================================

        const createdAt =
          getTodayISO();


        const newPost = {

          id: Date.now(),

          title,

          body,

          important,

          createdAt,

          date:
            formatDate(
              createdAt
            ),

          author:
            profile.label

        };


        posts.unshift(
          newPost
        );


        savePosts();

        renderPosts();

        closeModal();


        toast(
          'Comunicado publicado'
        );

      }
    );

  }


  // ========================================
  // FILTROS
  // ========================================

  const searchPosts =
    $('#search-posts');


  const filterDate =
    $('#filter-date');


  const filterImportant =
    $('#filter-important');


  const filterOrder =
    $('#filter-order');


  const clearFilters =
    $('#clear-filters');


  if (searchPosts) {

    searchPosts.addEventListener(
      'input',
      renderPosts
    );

  }


  if (filterDate) {

    filterDate.addEventListener(
      'change',
      renderPosts
    );

  }


  if (filterImportant) {

    filterImportant.addEventListener(
      'change',
      renderPosts
    );

  }


  if (filterOrder) {

    filterOrder.addEventListener(
      'change',
      renderPosts
    );

  }


  if (clearFilters) {

    clearFilters.addEventListener(
      'click',
      () => {

        if (searchPosts) {

          searchPosts.value =
            '';

        }


        if (filterDate) {

          filterDate.value =
            '';

        }


        if (filterImportant) {

          filterImportant.value =
            'all';

        }


        if (filterOrder) {

          filterOrder.value =
            'newest';

        }


        renderPosts();

      }
    );

  }


  // ========================================
  // MENÚ RESPONSIVE
  // ========================================

  const menuButton =
    $('#menu-button');


  const sidebar =
    $('#sidebar');


  if (
    menuButton &&
    sidebar
  ) {

    menuButton.addEventListener(
      'click',
      () => {

        const open =
          sidebar.classList.toggle(
            'open'
          );


        menuButton.setAttribute(
          'aria-expanded',
          String(open)
        );

      }
    );

  }


  // ========================================
  // CERRAR SESIÓN
  // ========================================

  const logout =
    $('#logout');


  if (logout) {

    logout.addEventListener(
      'click',
      () => {

        sessionStorage.removeItem(
          'aulaclara-session'
        );


        location.href =
          'index.html';

      }
    );

  }


  // ========================================
  // INICIAR
  // ========================================

  loadPosts();

  renderPosts();

});