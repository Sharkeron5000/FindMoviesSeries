import { content } from "./js/domContent.js";
import { changeHash, filter, keyEnter } from "./js/events.js";
import { configSearch, getControlPanelInput } from "./js/functions.js";
import { timeStartSearch } from "./js/timeout.js";
import { key } from "./key/apiKey.js";

const searchForm = document.getElementById('searchText');
const movieList = document.getElementById('movies');
const apiKey = key;
const buttonConfigSearch = document.getElementById('buttonConfigSearch');
const textInfo = document.getElementById('infoText');
const controlPanel = document.getElementById('checkTopWeekDay');

/** Показать, спрятать фильтр поиска */
buttonConfigSearch.addEventListener('click', filter)

/** Запустить поиск фильма по введенным данным */
searchForm.addEventListener('input', timeStartSearch);
searchForm.addEventListener('keydown', keyEnter);

/** Загрузка списка популярных фильмов, когда страница загрузилась полностью */
document.addEventListener('DOMContentLoaded', showTopFilms);

/** Отслеживание изменения Hash в URL */
window.onhashchange = changeHash;

/** Загрузка списка популярных фильмов за неделю */
export function showTopFilms() {
    let inner = '';
    getControlPanelInput();
    const getValueTop = JSON.parse(localStorage.getItem('topWatch')) || 'day';

    fetch(`https://api.themoviedb.org/3/trending/all/${getValueTop}?api_key=${apiKey}&language=ru`)
        .then((value) => {
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            if (output.results.length === 0) {
                return content.errorContent('', false, false, 'Ничего не найдено')
            }

            output.results.forEach((item) => {
                const nameItem = item.name || item.title;
                inner += content.videoPoster(item, nameItem);
            });

            movieList.innerHTML = inner;

        })
        .catch((reason) => {
            content.errorContent(reason, true, false, 'Упс, что-то пошло не так');
        });
}

/** Показ список фильмов, через поисковик */
export function search() {
    const movie = document.getElementById('movieSearch').checked;
    const tv = document.getElementById('tvSearch').checked;
    const person = document.getElementById('peopleSearch').checked;
    let searchCheckList = { movie, tv, person };
    const SearchText = document.querySelector('.form-control').value;

    controlPanel.textContent = '';
    textInfo.classList.remove('text-danger', 'text-info')
    textInfo.textContent = '';
    movieList.innerHTML = '<div class="spinner"></div>';
    const type = configSearch(searchCheckList);
    const server = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=ru&query=${SearchText}`

    if (SearchText.trim().length === 0) {
        content.errorContent('', true, false, 'Поле поиска не должно быть пустым');
        showTopFilms();
        return;
    }

    fetch(server)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            let inner = '';

            if (output.results.length === 0) {
                return content.errorContent('', false, false, 'Ничего не найдено')
            }

            output.results.forEach((item) => {
                inner += content.videoPoster(item, type);
            });

            movieList.innerHTML = inner;
        })
        .catch((reason) => {
            content.errorContent(reason, true, false, 'Упс, что-то пошло не так');
        });
};

/** Вывод полной информации о фильме */
export function showFullVideoInfo(appendUrl, type) {
    let url = `https://api.themoviedb.org/3/${appendUrl}?api_key=${apiKey}&language=ru`;

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            if (type === 'movie') {
                movieList.innerHTML = content.fullMovieContent(output);
            } else if (type === 'tv') {
                movieList.innerHTML = content.fullTvContent(output)
            };
            content.backgroundImage(output.backdrop_path);

            getVideo(appendUrl);
        })
        .catch((reason) => {
            content.errorContent(reason, true, false, 'Упс, что-то пошло не так');
        });
};

/** Загрузить полную информацию о человеке */
export function showFullPersonInfo(appendUrl) {
    let url = `https://api.themoviedb.org/3/${appendUrl}?api_key=${apiKey}&language=ru`;

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            movieList.innerHTML = content.fullPersonContent(output);
            content.backgroundImage();
        })
        .catch((reason) => {
            content.errorContent(reason, true, false, 'Упс, что-то пошло не так');
        });
};

/** Вывод трейлера на страницу */
function getVideo(appendUrl) {
    let youtube = movieList.querySelector('.youtube');
    fetch(`https://api.themoviedb.org/3/${appendUrl}/videos?api_key=${apiKey}&language=ru`)
        .then((value) => {
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            let videoFrame = output.results.length === 1 ? '<h5 class="text-info">Трейлер</h5>' : '<h5 class="text-info">Трейлеры</h5>';

            if (output.results.length === 0) {
                videoFrame = '<p>К сожалению трейлер отсутствует</p>';
            }

            output.results.forEach((item) => {
                videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            });

            youtube.innerHTML = videoFrame;
        })
        .catch((reason) => {
            // youtube.innerHTML = 'Ошибка загрузки видео';
            content.errorContent(reason, true, true, 'Ошибка загрузки видео')
        });
};