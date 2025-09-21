const filmListEl = document.getElementById('film-list');
const filmTitleEl = document.getElementById('film-title');
const filmPosterEl = document.getElementById('film-poster');
const filmDescriptionEl = document.getElementById('film-description');
const filmRuntimeEl = document.getElementById('film-runtime');
const filmShowtimeEl = document.getElementById('film-showtime');
const filmTicketsAvailableEl = document.getElementById('film-tickets-available');
const buyTicketBtn = document.getElementById('buy-ticket-btn');
const messageEl = document.getElementById('message');

let films = [];
let selectedFilm = null;

async function fetchFilms() {
  try {
    const response = await fetch('db.json');
    const data = await response.json();
    films = data.films;
    renderFilmList();
    if (films.length > 0) {
      selectFilm(films[0].id);
    }
  } catch (error) {
    filmListEl.innerHTML = '<p>Error loading films.</p>';
    console.error('Error fetching films:', error);
  }
}

function renderFilmList() {
  filmListEl.innerHTML = '';
  films.forEach(film => {
    const btn = document.createElement('button');
    btn.textContent = film.title;
    btn.dataset.id = film.id;
    btn.addEventListener('click', () => selectFilm(film.id));
    filmListEl.appendChild(btn);
  });
}

function selectFilm(id) {
  selectedFilm = films.find(film => film.id === id);
  if (!selectedFilm) return;

  // Highlight selected button
  Array.from(filmListEl.children).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });

  filmTitleEl.textContent = selectedFilm.title;
  filmPosterEl.src = selectedFilm.poster;
  filmPosterEl.alt = `Poster of ${selectedFilm.title}`;
  filmDescriptionEl.textContent = selectedFilm.description;
  filmRuntimeEl.textContent = selectedFilm.runtime;
  filmShowtimeEl.textContent = selectedFilm.showtime;

  updateTicketsAvailable();
  messageEl.textContent = '';
}

function updateTicketsAvailable() {
  const ticketsAvailable = selectedFilm.capacity - selectedFilm.tickets_sold;
  filmTicketsAvailableEl.textContent = ticketsAvailable;
  buyTicketBtn.disabled = ticketsAvailable <= 0;
}

buyTicketBtn.addEventListener('click', () => {
  if (!selectedFilm) return;

  const ticketsAvailable = selectedFilm.capacity - selectedFilm.tickets_sold;
  if (ticketsAvailable > 0) {
    selectedFilm.tickets_sold++;
    updateTicketsAvailable();

    if (selectedFilm.capacity - selectedFilm.tickets_sold === 0) {
      messageEl.textContent = 'Sold out!';
      buyTicketBtn.disabled = true;
    } else {
      messageEl.textContent = 'Ticket purchased successfully!';
      setTimeout(() => {
        messageEl.textContent = '';
      }, 2000);
    }
  } else {
    buyTicketBtn.disabled = true;
    messageEl.textContent = 'Sold out!';
  }
});

// Initialize
fetchFilms();