import { showFullInfo } from "../script.js";

const movie = document.getElementById('movies');

/** Добавление эвента на полный показ всем показанным фильмам на странице */
export function addEventMedia() {
  const media = movie.querySelectorAll('.item>img[data-id]');
  media.forEach((elem) => {
      elem.style.cursor = 'pointer';
      elem.addEventListener('click', showFullInfo);
  });
};