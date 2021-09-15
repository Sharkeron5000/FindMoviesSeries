const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
    event.preventDefault();

    const SearchText = document.querySelector('.form-control').value,
        server = 'https://api.themoviedb.org/3/search/multi?api_key=652b42419149b452f7efd5da52cb2b9d&language=ru&query=' + SearchText;
    movie.innerHTML = 'Загрузка';
    requestApi(server)
        .then((result) => {
            const output = JSON.parse(result);
            console.log(output);
            let inner = '';

            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                inner += `<div class='col-5'>${nameItem}</div>`;
            });

            movie.innerHTML = inner;
        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.log('error: ' + reason.status);
        })
        ;
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener("load", () => {
            if (request.status !== 200) {
                reject({ status: request.status });
                return;
            }

            resolve(request.response)
        });

        request.addEventListener("error", () => {
            reject({ status: request.status });
        });

        request.send();
    });
}

    // request.addEventListener('readystatechange', () => {
    //     if (request.readyState !== 4) {
    //         
    //         return;
    //     };
    //     if (request.status !== 200) {
    //         movie.innerHTML = 'Упс, что-то пошло не так';
    //         console.log('error: ' + req);
    //         return;
    //     }

    //     const output = JSON.parse(request.responseText);


    // });