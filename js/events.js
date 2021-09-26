import { showFullInfo, showTopFilms } from "../script.js";

const movie = document.getElementById('movies');

/** Добавление эвента на полный показ всем показанным фильмам на странице */
export function addEventMedia() {
  const media = movie.querySelectorAll('.movie>img[data-id]');
  media.forEach((elem) => {
      elem.style.cursor = 'pointer';
      elem.addEventListener('click', showFullInfo);
  });
};

export function changeTopDayWeek(event) {
  const changeTopInput = document.getElementById('checkboxTopChange');
  localStorage.setItem('topWatch', JSON.stringify(changeTopInput.checked? 'week' : 'day'));
  showTopFilms()
}