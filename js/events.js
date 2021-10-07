import { search, showFullPersonInfo, showFullVideoInfo, showTopFilms } from "../script.js";

const menuSearch = document.getElementById('menuSearch');
const movieList = document.getElementById('movies');
const inputGroup = document.getElementById('searchDiv');

/** Изменение списка топ фильмов/сериалов за день/неделю */
export function changeTopDayWeek() {
  const changeTopInput = document.getElementById('checkboxTopChange');
  localStorage.setItem('topWatch', JSON.stringify(changeTopInput.checked? 'week' : 'day'));
  showTopFilms()
}

/** Начать поиск по нажатию на "Enter" */
export function keyEnter(event) {
  if(event.code === 'Enter') search()
}

/** ПОказать/Спрятать окно с фильтром */
export function filter() {
  menuSearch.classList.toggle('d-none')
}

/** Обработать изменения в hash */
export function changeHash() {
  movieList.innerHTML = '<div class="spinner"></div>';
  const hash = location.hash;
  const action = hash.slice(1, hash.indexOf('?'));
  const appendUrl =  `${action}/${hash.slice(hash.indexOf('?') + 1)}`;

  if(action === 'movie') showFullVideoInfo(appendUrl, action);
  if(action === 'tv') showFullVideoInfo(appendUrl, action);
  if(action === 'person') showFullPersonInfo(appendUrl, action);
}