const urlPoster500 = 'https://image.tmdb.org/t/p/w500';
const urlPosterOriginal = 'https://image.tmdb.org/t/p/original';
const filterContainer = document.getElementById('filter');

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

function videoContent(item, nameItem, dataInfo) {
  const poster = item.poster_path ? urlPoster500 + item.poster_path : './img/noposter.png';
  return `
  <div class='col-12 col-md-6 col-xl-3 movie'>
    <a href=#${dataInfo}>
      <img src="${poster}" class="movies__poster-min" alt="${nameItem}" ${dataInfo}>
      <div class="movie__vote">
        <p class="text-light vote__text">${item.vote_average}⭐</p>
      </div>
      <h5 class="border movies__title-name col">${nameItem}</h5>
    </a>
  </div>
  `;
}

function errorContent(reason, movie) {
  movie.innerHTML = 'Упс, что-то пошло не так';
  console.error(reason || reason.status)
}

function fullVideoContent(output, showType) {
  filterContainer.classList.add("d-none")
  const poster = output.poster_path ? urlPoster500 + output.poster_path : './img/noPoster.png';
  return `
  <div class="row col-12" id="bgImage">
    <div class="row col-12 container" id="bgGrad">
      <img class="movies__poster-full col-2" src="${poster}" alt="${output.name || output.title}">
      <div class="col-8 text-light">
        <h4 class="col-12 text-center text-light">${output.name || output.title} ${(output.name || output.title) !== (output.original_name || output.original_title)
        ? `(${output.original_name || output.original_title})` : ''}</h4>
        <h5 class="col-12 text-center text-secondary">${output.tagline}</h5>
        <p>Рейтинг: ${output.vote_average}⭐(${output.vote_count}📝)</p>
        <p>${showGenres(output.genres)}</p>
        <p>Премьера: ${dateRelease(output.first_air_date || output.release_date)}</p>
        <p>Статус ${showType}: ${showRelease(output.status)}</p>
        
        ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезонов ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}
        
        <p>Описание: ${output.overview}</p>
        
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

/** Вывод фонового изображения */
function backgroundImage(image) {
  const poster = image ? urlPosterOriginal + image : './img/noPoster.png';
  const bgImage = document.getElementById("bgImage");
  const bgGrad = document.getElementById("bgGrad");

  bgImage.style.backgroundImage = `url(${poster})`;
  bgImage.classList.add('movies__bg-image');
  bgGrad.classList.add('movies__bg-gradient');
}

/** Вывод статуса фильма на русском языке */
function showRelease(release) {
  let status =  {
    'Canceled': 'Отменен',
    'Rumored': 'Слухи',
    'Planned': 'Планируемый',
    'In Production': 'В производстве',
    'Post Production': 'Окончательный монтаж',
    'Released' : 'Выпущен',
    'Ended': 'Завершился',
    'Returning Series': 'Продолжается'
  };
  return status[release] || release;
}

/** Вывод даты релиза в нормальном виде */
function dateRelease(date) {
  const year = date.substr(0, 4);
  let monthDate = date.substr(5, 2);
  let day = date.substr(8, 2);
  const monthList = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  if(!(+monthDate.substr(0, 1))) monthDate = monthDate.substr(1, 1) - 1;
  if(!(+day.substr(0, 1))) day = day.substr(1, 1);
  const month = monthList[monthDate];
  
  return `${day} ${month} ${year} года`
}

/** Показ жанра видео */
function showGenres(genresList) {
  let word = '';
  let genres = '';
  if(genresList.length === 0) {
      word = "Жанры не найдены."
  } else if(genresList.length === 1) {
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

export const content = {
  changeTopContent,
  videoContent,
  errorContent,
  fullVideoContent,
  backgroundImage
}