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
// Allarghiamola ricercaalle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// Milestone 3:
// Aggiungiamo la copertina del film o della serie. L'API ci passa solo la parte finale dell’URL, poi potremo generare da quella porzione di URL tante dimensioni diverse.
// URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ + la dimensione che vogliamo (link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.
// Esempio di URL che torna la copertina di PEPPA PIG:
// https://image.tmdb.org/t/p/w185/tZgQ76hS9RFIwFyUxzctp1Pkz0N.jpg

// MILESTONE 4:
// Trasformiamo quanto fatto in una webapp con un layout completo simil-Netflix:
// Un header che contiene logo e search bar
// i risultati appaiono sotto forma di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio la poster_path con w342)
// Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview
// p.s. per altre aggiunte grafiche siete liberi di copiare da Netflix, ma solo dopo aver finito la base.

$(document).ready(function(){
// al click sul button
  $("#search_btn").click(
    function() {
      //pulisco il contenuto dell'html e dell'input
    resetSearch();
    //eseguo le due chiamate ajax
    callMovies();
    callSeries();
    $("#search_input").val("")
  });
//Idem sopra ma con il presso su invio
  $("#search_input").keydown(
    function(event) {
      if (event.which == 13) {
        resetSearch();
        callMovies();
        callSeries();
        $("#search_input").val("")
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
        //passo il tipo film e il risultato della ricerca alla funzione render
        renderResults("movies", data.results);
      },
      "error": function () {
      alert("E' avvenuto un errore.");
      }
      });
}
//Idem sopra per le serie tv
function callSeries() {
    var inputUser = $("#search_input").val();
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
        renderResults("series", data.results); //importante!!
      },
      "error": function () {
      alert("E' avvenuto un errore.");
      }
      });
}

function renderResults(type, results) {
  //selezioniamo il template handlebars
  var source = document.getElementById("entry-template").innerHTML;
  var template = Handlebars.compile(source);
  //lo compiliamo x n volte quanti sono i risultati della ricerca
  for(var i = 0; i < results.length; i++) {
    //invochiamo la funzione che calcola il numero di stelle per ciascun risultato
    var starArray = [];
    assignStars(results[i].vote_average, starArray);
  //modifichiamo i valori a seconda del tipo di contenuto (film o serie tv)
    var title;
    var original_title;
    var container;

    if (type == "movies") {
      title = results[i].title;
      original_title = results[i].original_title;
      container = $("#movie_results");
    } else if (type == "series") {
      title = results[i].name;
      original_title = results[i].original_name;
      container = $("#series_results");
    }
//compiliamo il context
    var context = {
      "title": title,
      "original_title": original_title,
      "original_language": results[i].original_language,
      "vote_average": results[i].vote_average,
      "star": starArray,
      "flag": results[i].original_language,
      "poster": printPoster(results[i])
    }
    //stampa tutto l'html con tanti li quanti sono i film della ricerca
    var html = template(context);
    container.append(html);
  }
}

function printPoster(content) {
  var poster = "https://image.tmdb.org/t/p/w342/" + content.poster_path;
  return poster
}

function resetSearch() {
  $("#movie_results").html("");
  $("#series_results").html("");
}

function assignStars(vote, array) {
  var parsedVote = Math.round(vote / 2);
  var i = 0;
  while (i < 5) {
    if (i < parsedVote) {
      var star = "fas fa-star";
      array.push(star);
    } else {
      var star = "far fa-star";
      array.push(star);
    }
    i++
  }
}
