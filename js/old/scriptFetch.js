const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
    event.preventDefault();

    const SearchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=652b42419149b452f7efd5da52cb2b9d&language=ru&query=' + SearchText;
    movie.innerHTML = '<div class="spinner"></div>';

    if (SearchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }

    fetch(server)
        .then((value) => {
            // console.log(value);
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            // console.log(output.results);
            let inner = '';

            if (output.results.length === 0) {
                movie.innerHTML = '<h2 class="col-12 text-center text-info">Ничего не найдено</h2>';
                return;
            }

            output.results.forEach((item) => {
                const nameItem = item.name || item.title;
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noPoster.png';
                let dataInfo = '';

                if (item.media_type !== 'person') dataInfo = `data-id="${String(item.id).trim()}" data-type="${item.media_type}"`;

                inner += `
                    <div class='col-12 col-md-6 col-xl-3 item'>
                    <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    </div>
                `;
            });

            movie.innerHTML = inner;
            addEventMedia();

        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.error(reason || reason.status);
        });
};

function addEventMedia() {
    const media = movie.querySelectorAll('.item>img[data-id]');
    media.forEach((elem) => {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
};

searchForm.addEventListener('submit', apiSearch);

function showFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=652b42419149b452f7efd5da52cb2b9d&language=ru`;
    } else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=652b42419149b452f7efd5da52cb2b9d&language=ru`;
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка</h2>';
    }

    fetch(url)
        .then((value) => {
            // console.log(value);
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            console.log(output);
            movie.innerHTML = `
                <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
                <div class="col-4">
                    <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">
                    ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank"> Официальная страничка </a></p>` : ''}
                    ${(output.imdb_id) ? `<p class="text-center"> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB.com </a></p>` : ''}
                    
                </div>
                <div class="col-8">
                    <p>Рейтинг: ${output.vote_average}</p>
                    <p>Статус: ${output.status}</p>
                    <p>Премьера: ${output.first_air_date || output.release_date}</p>

                    ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезонов ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

                    <p>Описание: ${output.overview}</p>

                    <br>
                    <div class ="youtube"></div>
                </div>
            `;

            getVideo(this.dataset.type, this.dataset.id);
        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.error(reason || reason.status);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=652b42419149b452f7efd5da52cb2b9d&language=ru')
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
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';
                let dataInfo = `data-id="${String(item.id).trim()}" data-type="${mediaType}"`;

                inner += `
                    <div class='col-12 col-md-6 col-xl-3 item'>
                    <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    </div>
                `;
            });

            movie.innerHTML = inner;
            addEventMedia();

        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.error(reason || reason.status);
        });
});

function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=652b42419149b452f7efd5da52cb2b9d&language=ru`)
        .then((value) => {
            // console.log(value);
            if (value.status !== 200) {
                throw new Error(value.status);
            }
            return value.json();
        })
        .then((output) => {
            console.log(output);
            let videoFrame = '<h5 class="text-info">Трейлеры</h5>';

            if (output.results.length === 0) {
                videoFrame = '<p>К сожалению видео отсутствует</p>';
            }

            output.results.forEach((item) => {
                videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            });

            youtube.innerHTML = videoFrame;
        })
        .catch((reason) => {
            youtube.innerHTML = 'Нет видео';
            console.error(reason || reason.status);
        });

};