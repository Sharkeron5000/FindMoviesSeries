import { content } from "./js/domContent.js";
import { addEventMedia} from "./js/functions.js";
import { timeStartSearch } from "./js/timeout.js";
import { key } from "./key/apiKey.js";

const searchForm = document.getElementById('searchText');
const movie = document.getElementById('movies');
const apiKey = key;

searchForm.addEventListener('input', timeStartSearch);

/** Загрузка списка популярных фильмов, когда страница загрузилась полностью */
document.addEventListener('DOMContentLoaded', () => {
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ru`)
        .then((value) => {
            // console.log(value);
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            // console.log(output.results);
            let inner = '<h4 class="col-12 text-center text-info">Популярное за неделю</h4>';

            if (output.results.length === 0) {
                movie.innerHTML = '<h2 class="col-12 text-center text-info">Ничего не найдено</h2>';
                return;
            }

            output.results.forEach((item) => {
                const nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                let dataInfo = `data-id="${String(item.id).trim()}" data-type="${mediaType}"`;

                inner += content.videoContent(item, nameItem, dataInfo);
            });

            movie.innerHTML = inner;
            addEventMedia();

        })
        .catch((reason) => {
            content.errorContent(reason, movie);
        });
});