const urlPoster500 = 'https://image.tmdb.org/t/p/w500';
const urlPosterOriginal = 'https://image.tmdb.org/t/p/original';
const filterContainer = document.getElementById('filter');
const movieList = document.getElementById('movies');
const textInfo = document.getElementById('infoText');
const controlPanel = document.getElementById('checkTopWeekDay');

function changeTopContent() {
  const valueTopShow = JSON.parse(localStorage.getItem('topWatch')) || "day";
  return `<div class="col-12 row justify-content-center">
    <h4 class="text-center text-info col-12">Популярное за:</h4> 
    <h4 class="text-right text-info col-5 h4__text-correct">день</h4> 
    <div class="col-auto">
      <div class="container-toggle">
        <input type="checkbox" class="toggle__check" id="checkboxTopChange" ${valueTopShow === "week" ? 'checked' : ''}>
        <div class="toggle__switch"></div>
        <div class="toggle__track"></div>
      </div>
    </div>
    <h4 class="text-left text-info col-5 h4__text-correct">неделю</h4> 
  </div>`;
}

function videoPoster(item, type) {
  const poster = item.poster_path || item.profile_path ? urlPoster500 + (item.poster_path || item.profile_path) : './img/noposter.png';
  const name = item.name || item.title
  return `
  <div class='col-12 col-md-6 col-xl-3 movie'>
    <a href="#${item.media_type}?${String(item.id).trim()}">
      <img src="${poster}" class="movies__poster-min" alt="${name}">
    </a>
    ${showVote(item, type)}
      <h5 class="border movies__title-name col">${name}</h5>
  </div>
  `;
}

/** Добавить на экран сообщение об ошибке и вывести саму ошибку в консоль */
function errorContent(reason, danger, show, text) {
  if (!show) {
    movieList.textContent = '';
    controlPanel.textContent = ''
  };
  textInfo.classList.add(danger ? 'text-danger' : 'text-info');
  textInfo.textContent = text;
  if (reason) console.error(reason);
}

/** Отображение полной информации о фильме */
function fullMovieContent(output) {
  filterContainer.classList.add("d-none");
  textInfo.textContent = "";
  const poster = output.poster_path ? urlPoster500 + output.poster_path : './img/noPoster.png';
  return `
  <div class="row col-12" id="bgImage">
    <div class="row col-12 container" id="bgGrad">
      <img class="movies__poster-full col-2" src="${poster}" alt="${output.title}">
      <div class="col-8 text-light">
        <h4 class="col-12 text-center text-light">${output.title} ${output.title !== output.original_title
      ? `(${output.original_title} <sup>${output.original_language}</sup>)` : ''}</h4>
        <h5 class="col-12 text-center text-secondary">${output.tagline}</h5>
        <p>Рейтинг: ${output.vote_average}⭐(${output.vote_count}📝)</p>
        <p>${showGenres(output.genres)}</p>
        <p>Продолжительность: ${runtime(output.runtime)}</p>
        <p>Описание: ${output.overview ? output.overview : 'У данного фильма нет описания'}</p>
        <p>Премьера фильма: ${dateRelease(output.release_date)} года</p>
        <p>Статус: ${showRelease(output.status)}</p>
        <p>${output.budget ? `Бюджет: ${spacerBudget(output.budget)}$` : ""}</p>
        <p>${output.revenue ? `Cборы: ${spacerBudget(output.revenue)}$` : ""}</p>
        <br>
      </div>
    </div>
  </div>
  <div class = "col-2">
      ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank"> Официальная страничка </a></p>` : ''}
      ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB.com </a></p>` : ''}
  </div>
  <div class ="youtube col-8"></div>
`;
}

/** Отображение полной информации о сериале */
function fullTvContent(output) {
  filterContainer.classList.add("d-none");
  textInfo.textContent = "";
  const poster = output.poster_path ? urlPoster500 + output.poster_path : './img/noPoster.png';
  if (output.in_production) errorContent('', true, true, 'Сезон или сериал еще не полностью вышел!')
  return `
  <div class="row col-12" id="bgImage">
    <div class="row col-12 container" id="bgGrad">
      <img class="movies__poster-full col-2" src="${poster}" alt="${output.name || output.title}">
      <div class="col-8 text-light">
        <h4 class="col-12 text-center text-light">${output.name} ${(output.name) !== (output.original_name)
      ? `(${output.original_name}  <sup>${output.original_language}</sup>)` : ''}</h4>
        <h5 class="col-12 text-center text-secondary">${output.tagline}</h5>
        <p>Рейтинг: ${output.vote_average}⭐(${output.vote_count}📝)</p>
        <p>${showGenres(output.genres)}</p>
        <p>Продолжительность эпизода: ${runtime(output.episode_run_time[0])}</p>
        <p>Описание: ${output.overview}</p>
        <p>Премьера сериала: ${dateRelease(output.first_air_date || output.release_date)}</p>
        <p>${(output.last_episode_to_air) ? `${output.number_of_seasons} сезонов ${output.last_episode_to_air.episode_number} серий вышло, 
          последний: ${dateRelease(output.last_air_date)} ${output.next_episode_to_air ? `, следующая серия: ${dateRelease(output.next_episode_to_air.air_date)}` : ""}` : ""}</p>
        <p>Статус: ${showRelease(output.status)}</p>
        <br>
        </div>
      </div>
    </div>
    <div class = "col-2">
      ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank"> Официальная страничка </a></p>` : ''}
      ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB.com </a></p>` : ''}
    </div>
    <div class ="youtube col-8"></div>
`;
}

/** Отображение полной информации об актере */
function fullPersonContent(output) {
  filterContainer.classList.add("d-none");
  textInfo.textContent = "";
  const poster = output.profile_path ? urlPoster500 + output.profile_path : './img/noPoster.png';
  return `
    <div class="row col-12" id="bgImage">
      <div class="row col-12 container" id="bgGrad">
        <img class="movies__poster-full col-2" src="${poster}" alt="${output.name}">
        <div class="col-8 text-light">
          <h4 class="col-12 text-center text-light">${output.name}</h4>
          <h5 class="col-12 text-center text-secondary">${output.also_known_as[0]}</h5>
          <p>Дата рождения: ${dateRelease(output.birthday)} ${output.deathday ? `, дата смерти: ${dateRelease(output.deathday)}` :""}</p>
          <p>Место рождения: ${output.place_of_birth}</p>
          <p>Пол: ${changeGender(output.gender)}</p>
          <p>Биография: ${output.biography}</p>
          <br>
        </div>
      </div>
    </div>
    <div class = "col-2">
    ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank"> Официальная страничка </a></p>` : ''}
    ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/name/${output.imdb_id}" target="_blank"> Страница на IMDB.com </a></p>` : ''}
    </div>
    <div class ="youtube col-8"></div>
  `;
}

/** Вывод фонового изображения */
function backgroundImage(image) {
  const poster = image ? urlPosterOriginal + image : './img/black.png';
  const bgImage = document.getElementById("bgImage");
  const bgGrad = document.getElementById("bgGrad");

  bgImage.style.backgroundImage = `url(${poster})`;
  bgImage.classList.add('movies__bg-image');
  bgGrad.classList.add('movies__bg-gradient');
}

function changeGender(gender) {
  if (gender === 1) {
    return "Женщина";
  } else if (gender === 2) {
    return "Мужчина";
  } else {
    return "Неизвестно";
  }
}

/** Отображение рейтинга при проверке на тип фильм/сериал */
function showVote(item, type) {
  if (item.media_type === 'person' || type === 'person') return ""

  return `<div class="movie__vote">
    <p class="text-light vote__text">${item.vote_average}⭐</p>
  </div>`
}

/** Показ жанра видео */
function showGenres(genresList) {
  let word = '';
  let genres = '';
  if (genresList.length === 0) {
    return "Жанр неизвестен"
  } else if (genresList.length === 1) {
    word = "Жанр:"
  }
  else {
    word = "Жанры:"
  }
  genresList.forEach((item) => {
    genres += item.name;
    if (genresList[genresList.length - 1] !== item) genres += ', '
  })
  return `${word} ${genres}`
}

function runtime(time) {
  let hour = Math.floor(time / 60);
  let minute = time % 60;
  let hourWord = "часов";
  let minuteWord = "минут"

  if (!hour && !minute) {
    return "неизвестно"
  } else if (!hour) {
    hour = "";
    hourWord = "";
  } else if (!minute) {
    minute = "";
    minuteWord = ""
  }


  if (hour === 1) {
    hourWord = "час"
  } else if (hour >= 2 && hour <= 4) {
    hourWord = "часа"
  }

  if (minute === 1 || minute === 21 || minute === 31 || minute === 41 || minute === 51) {
    minuteWord = "минуту"
  } else if ((minute >= 2 && minute <= 4) || (minute >= 22 && minute <= 24) || (minute >= 32 && minute <= 34) || (minute >= 42 && minute <= 44) ||
    (minute >= 52 && minute <= 54)) {
    minuteWord = "минуты"
  }

  return `${hour} ${hourWord} ${minute} ${minuteWord}`
}

/** Вывод даты релиза в нормальном виде */
function dateRelease(date) {
  if (!date) { return "неизвестна" };
  const year = date.substr(0, 4);
  let monthDate = +date.substr(5, 2) - 1;
  let day = date.substr(8, 2);
  const monthList = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  if (!(+day.substr(0, 1))) day = day.substr(1, 1);
  const month = monthList[monthDate];

  return `${day} ${month} ${year}`
}

/** Вывод статуса фильма на русском языке */
function showRelease(release) {
  let status = {
    'Canceled': 'Отменен',
    'Rumored': 'Слухи',
    'Planned': 'Планируемый',
    'In Production': 'В производстве',
    'Post Production': 'Окончательный монтаж',
    'Released': 'Выпущен',
    'Ended': 'Завершился',
    'Returning Series': 'Продолжается'
  };
  return status[release] || release;
}

function spacerBudget(budget) {
  let arr = [];
  let strBudget = String(budget)
  let i;
  let len = strBudget.length;

  for (i = 0; i < len; i += 3) {
    arr.push(strBudget.substr(i, 3))
  }

  return arr.join('.')
}

export const content = {
  changeTopContent,
  videoPoster,
  errorContent,
  fullMovieContent,
  fullTvContent,
  fullPersonContent,
  backgroundImage
}