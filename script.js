import { content } from "./js/domContent.js";
import { addEventMedia} from "./js/events.js";
import { getControlPanelInput } from "./js/functions.js";
import { timeStartSearch } from "./js/timeout.js";
import { key } from "./key/apiKey.js";

const searchForm = document.getElementById('searchText');
const movie = document.getElementById('movies');
const checkTopWeekDay = document.getElementById('checkTopWeekDay');
const apiKey = key;

/** Запустить поиск фильма по введенным данным */
searchForm.addEventListener('input', timeStartSearch);

/** Загрузка списка популярных фильмов, когда страница загрузилась полностью */
document.addEventListener('DOMContentLoaded', getControlPanelInput);

/** Загрузка списка популярных фильмов за неделю */
export function showTopFilms() {
    let inner = '';
    const getValueTop = JSON.parse(localStorage.getItem('topWatch'));
    // console.log(typeof getValueTop);

    fetch(`https://api.themoviedb.org/3/trending/all/${getValueTop}?api_key=${apiKey}&language=ru`)
        .then((value) => {
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            if (output.results.length === 0) {
                movie.innerHTML = '<h2 class="col-12 text-center text-info">Ничего не найдено</h2>';
                return;
            }

            output.results.forEach((item) => {
                console.log(item);
                const nameItem = item.name || item.title;
                let dataInfo = `data-id="${String(item.id).trim()}" data-type="${item.media_type}"`;

                inner += content.videoContent(item, nameItem, dataInfo);
            });

            movie.innerHTML = inner;
            addEventMedia();

        })
        .catch((reason) => {
            content.errorContent(reason, movie);
        });
}

/** Показ список фильмов, через поисковик */
export function apiSearch() {
    const movieSearch = document.getElementById('movieSearch').checked;
    const tvSearch = document.getElementById('tvSearch').checked;
    const peopleSearch = document.getElementById('peopleSearch').checked;
    let searchCheckList = [movieSearch, tvSearch, peopleSearch];

    const SearchText = document.querySelector('.form-control').value;
    const server = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=${SearchText}`;
    movie.innerHTML = '<div class="spinner"></div>';

    if (SearchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        showTopFilms()
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
                movie.innerHTML = '<h2 class="col-12 text-center text-info">Ничего не найдено</h2>';
                return;
            }

            output.results.forEach((item) => {
                const nameItem = item.name || item.title;
                let dataInfo = '';

                if (item.media_type !== 'person') {
                    dataInfo = `data-id="${String(item.id).trim()}" data-type="${item.media_type}"`;
                }

                inner += content.videoContent(item, nameItem, dataInfo);
            });

            movie.innerHTML = inner;
            addEventMedia();
        })
        .catch((reason) => {
            content.errorContent(reason, movie);
        });
};

/** Вывод полной информации о фильме */
export function showFullInfo() {
    movie.innerHTML = '<div class="spinner"></div>';
    let url = '';
    let showType = '';
    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=${apiKey}&language=ru`;
        showType = 'фильма';
    } else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=${apiKey}&language=ru`;
        showType = 'сериала';
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка</h2>';
    }

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            console.log(output);
            // if(output.adult) checkAge();
            const arrowBack = document.getElementById('navbar-arrow');
            arrowBack.classList.remove('d-none')
            arrowBack.addEventListener('click', () => {
                document.location.reload();
            });

            movie.innerHTML = content.fullVideoContent(output, showType);
            content.backgroundImage(output.backdrop_path);

            getVideo(this.dataset.type, this.dataset.id);
        })
        .catch((reason) => {
            content.errorContent(reason, movie);
        });
};

/** Вывод трейлера на страницу */
function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=ru`)
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
            youtube.innerHTML = 'Ошибка загрузки видео';
            console.error(reason || reason.status);
        });
};