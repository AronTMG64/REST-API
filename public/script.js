
getMovies();

async function getMovies() {
  const parent = document.querySelector('#parent');

  const res = await fetch('/api/movies');
  const data = await res.json();

  parent.innerHTML = `
    <table>
      <tr>
        <th>Title</th>
        <th>Year</th>
      </tr>
      ${data.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.year}</td>
          <td><button class="delete-btn" onclick="deleteMovies(${item.id})" id="${item.id}">delete</button></td>
          <td><button class="edit-btn" onclick="editMovies(${item.id})" id="${item.id}">Edit</button></td>
        </tr>
      `).join('')}
    </table>
  `;

  document.querySelector('#add').addEventListener('click', e => {
    e.preventDefault();
    postMovies();
    getMovies();
  });
};



async function postMovies() {
  const title = document.querySelector('#add-title-input').value;
  const year = document.querySelector('#add-year-input').value;

  const data = {name: title, year: year};
  console.log(data);

  try {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resData = await res.json();
    console.log('Success:', resData);
  } catch (error) {
    console.error('Error:', error);
  }
};

async function deleteMovies(id) {
  try {
    const res = await fetch(`/api/movies/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    console.log('Success: Movie deleted');
    // Refresh the movie list
    getMovies();
  } catch (error) {
    console.error('Error:', error);
  };
};

async function editMovies(id) {
  const editParent = document.querySelector('#edit-parent');
  const confirmEdit = document.querySelector('#edit-confirm');

  editParent.hidden = false;

  confirmEdit.addEventListener('click', async () => {
    const title = document.querySelector('#edit-name');
    const year = document.querySelector('#edit-year');

    const data = {name: title.value, year: year.value};

    console.log(data);
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      console.log('Success: Movie edited');
      title.value = '';
      year.value = '';
      editParent.hidden = true;
      // Refresh the movie list
      getMovies();
    } catch (error) {
      console.error('Error:', error);
    };
  });
};