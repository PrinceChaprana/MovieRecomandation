const API_KEY = '8f3cfa9d73b53754d3004d0c188c3835';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie?api_key=';
const QUERY_URL = BASE_URL + API_KEY + '&query=';

$(function () {
    console.log("hello");
})

function buttonpressed() {
    var targetted = document.getElementById('input-field').value;
    if (targetted != "") {
        //alert('inside ' + targetted);
        get_details(QUERY_URL, targetted);
    } else {
        alert("Empty search");
    }
}

function recommendMovie(e) {
    //alert(e.getAttribute('title'));
    var title = e.getAttribute('title');
    get_details(QUERY_URL,title);
}

function get_details(QUERY_URL, title) {
    fetch(QUERY_URL + title).then(res => res.json()).then(data => {
        //console.log(data)
        Load_details(data.results);

    })
}

function Load_details(data) {
    var movie_id = data[0].id;
    var movie_title = data[0].original_title;
    //alert(movie_id + movie_title);
    movie_recommend(movie_id, movie_title);
}

function movie_recommend(id, title) {
    $.ajax({
        type: 'POST',
        url: "/similarity",
        data: { 'name': title },
        success: function (recs) {
            if (recs == "Sorry! The movie you requested is not in our database. Please check the spelling or try with some other movies") {
                //$('.fail').css('display','block');
                //$('.results').css('display','none');
                //$("#loader").delay(500).fadeOut();
                alert(recs);
            }
            else {
                //$('.fail').css('display','none');
                //$('.results').css('display','block');
                var movie_arr = recs.split('---');
                var arr = [];
                console.log(movie_arr);
                for (const movie in movie_arr) {
                    arr.push(movie_arr[movie]);
                }
                get_movie_details(id, API_KEY, arr, title);
            }
        },
        error: function () {
            alert("error recs");
            //$("#loader").delay(500).fadeOut();
        },
    });
}

function get_movie_details(movie_id, API_KEY, arr, movie_title) {
    //alert('show');
    const DETAIL_URL = 'https://api.themoviedb.org/3/movie/' + movie_id + '?api_key=' + API_KEY;
    fetch(DETAIL_URL).then(res => res.json()).then(data => {
        //alert(arr);
        Show_Details(data, arr, movie_title, movie_id);
    })
}

function Show_Details(movie_details, arr, movie_title, movie_id) {
    var imdb_id = movie_details.imdb_id;
    var poster = 'https://image.tmdb.org/t/p/original' + movie_details.poster_path;
    var overview = movie_details.overview;
    var backdrop = 'https://image.tmdb.org/t/p/w500' + movie_details.backdrop_path;
    var genres = movie_details.genres;
    var rating = movie_details.vote_average;
    var vote_count = movie_details.vote_count;
    var release_date = new Date(movie_details.release_date);
    var runtime = parseInt(movie_details.runtime);
    var status = movie_details.status;
    var genre_list = []
    for (var genre in genres) {
        genre_list.push(genres[genre].name);
    }
    var my_genre = genre_list.join(", ");
    if (runtime % 60 == 0) {
        runtime = Math.floor(runtime / 60) + " hour(s)"
    }
    else {
        runtime = Math.floor(runtime / 60) + " hour(s) " + (runtime % 60) + " min(s)"
    }

    arr_poster = get_poster(arr, API_KEY);
    //alert(arr_poster);
    details = {
        'title': movie_title,
        'imdb_id': imdb_id,
        'poster': backdrop,
        'genres': my_genre,
        'overview': overview,
        'rating': rating,
        'release_date': release_date.toDateString().split(' ').slice(1).join(' '),
        'runtime': runtime,
        'rec_movies': JSON.stringify(arr),
        'rec_posters': JSON.stringify(arr_poster)
    }
    $.ajax({
        type: 'POST',
        data: details,
        url: "/recommend",
        dataType: 'html',
        complete: function () {
            // $("#loader").delay(500).fadeOut();
        },
        success: function (response) {
            document.getElementById("popular").innerHTML = "";
            $('.results').html(response);
            alert('sending to python recommandation');
            $('#input-field').val('');
            $(window).scrollTop(0);
        }
    });
}

function get_poster(arr, API_KEY) {
    var arr_poster_list = []
    for(var m in arr) {
        $.ajax({
        type:'GET',
        url:'https://api.themoviedb.org/3/search/movie?api_key=8f3cfa9d73b53754d3004d0c188c3835&query='+arr[m],
        async: false,
        success: function(m_data){
            arr_poster_list.push('https://image.tmdb.org/t/p/original'+m_data.results[0].poster_path);
        },
        error: function(){
            alert("Invalid Request!");
            //$("#loader").delay(500).fadeOut();
        },
        })
    }
    return arr_poster_list;
}
