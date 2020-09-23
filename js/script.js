// sito https://www.themoviedb.org.
// API_KEY: 02a1201f97c8df2c585d649e1fd9e3fe
// Servirà all’API a capire chi sta effettuando la chiamata.
//https://developers.themoviedb.org/3 movie database

// Milestone 1
// Creare layout base con una searchbar (una input e un button) in cuiscrivere completamente o parzialmente il nome di un film. Al click cercare sull’API tutti i film contenenti quanto scritto dall'user.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo Titolo Originale Lingua Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5 e stampiamo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

$(document).ready(function(){
// al click sul button
  $("#search_btn").click(
    function() {
    $("#search_results").html("");
    callMovies();
    callSeries();
    $("#search_input").val("");
    // click sul button
  });

  $("#search_input").keydown(
    function(event) {
      if (event.which == 13) {
        callMovies();
        callSeries();
        $("#search_results").html("");
      }
  });

});

//-----------functions--------------

function callMovies() {
  // prendo il valore dell'input
    var inputUser = $("#search_input").val();
    // lancio la chiamata ajax
    $.ajax(
      {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key": "02a1201f97c8df2c585d649e1fd9e3fe",
        "query": inputUser,
        "include_adult": false,
        "language": "it"
      },
      "method": "GET",
      "success": function (data) {
        renderMovies(data.results);
      },
      "error": function () {
      alert("E' avvenuto un errore.");
      }
      });
}

function callSeries() {
  // prendo il valore dell'input
    var inputUser = $("#search_input").val();
    // lancio la chiamata ajax
    $.ajax(
      {
      "url": "https://api.themoviedb.org/3/search/tv",
      "data": {
        "api_key": "02a1201f97c8df2c585d649e1fd9e3fe",
        "query": inputUser,
        "include_adult": false,
        "language": "it"
      },
      "method": "GET",
      "success": function (data) {
        renderSeries(data.results);
      },
      "error": function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
      }
      });
}

function renderMovies(movies) {
  //compiliamo il template handlebars
  var source = document.getElementById("movie-template").innerHTML;
  var template = Handlebars.compile(source);

  for(var i = 0; i < movies.length; i++) {
    //compila il contenuto del template x n movies
    var parsedVote = Math.round(movies[i].vote_average / 2);
    var starArray = [];
    checkStars(parsedVote, starArray);
    var context = {
      "title": movies[i].title,
      "original_title": movies[i].original_title,
      "original_language": movies[i].original_language,
      "vote_average": movies[i].vote_average,
      "star": starArray,
      "flag": movies[i].original_language
    }
    //stampa tutto l'html con tanti li quanti sono i film della ricerca
    var html = template(context);
    $("#search_results").append(html);
  }
}

function renderSeries(series) {
  var source = document.getElementById("series-template").innerHTML;
  var template = Handlebars.compile(source);
  for(var i = 0; i < series.length; i++) {
    var parsedVote = Math.round(series[i].vote_average / 2);
    var starArray = [];
    checkStars(parsedVote, starArray);
    var context = {
      "name": series[i].name,
      "original_name": series[i].original_name,
      "original_language": series[i].original_language,
      "vote_average": series[i].vote_average,
      "star": starArray,
      "flag": series[i].original_language
    }
    //stampa tutto l'html con tanti li quanti sono i film della ricerca
    var html = template(context);
    $("#search_results").append(html);
  }
}



function checkStars(vote, array) {
  var i = 0;
  while (i < 5) {
    if (i < vote) {
      var star = "fas fa-star";
      array.push(star);
    } else {
      var star = "far fa-star";
      array.push(star);
    }
    i++
  }
}
