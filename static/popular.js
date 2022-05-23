
const B_URL = 'https://api.themoviedb.org/3/trending/all/day?api_key=8f3cfa9d73b53754d3004d0c188c3835';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';

const main = document.getElementById('main');

getPopular(B_URL);

function getPopular(url){
    fetch(url).then(res => res.json()).then(data =>{
        show_Popular(data.results);
        console.log(data.results)
    })
}

function show_Popular(data){

    main.innerHTML = '';

    data.forEach(movie => {
        const {title,poster_path} = movie;
        const movieElement = document.createElement("div");
        movieElement.classList.add('movie_box');
        movieElement.innerHTML = `
                <img src="${IMG_URL+poster_path}"/>
                <div class = "movie_title">${title}</div>
        `

        main.appendChild(movieElement);
    });
}
