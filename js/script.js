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

// Milestone 5 (Opzionale):
// Partendo da un film o da una serie, richiedere all'API quali sono gli attori che fanno parte del cast aggiungendo alla nostra scheda Film / Serie SOLO i primi 5 restituiti dall’API con Nome e Cognome, e i generi associati al film con questo schema: “Genere 1, Genere 2, …”.
// Milestone 6 (Opzionale):
// Creare una lista di generi richiedendo quelli disponibili all'API e creare dei filtri con i generi tv e movie per mostrare/nascondere le schede ottenute con la ricerca.


$(document).ready(function(){
// al click sul button
  $("#search_btn").click(
    function() {
      //pulisco il contenuto dell'html e dell'input
    resetSearch();
    //eseguo le due chiamate ajax
    callData("movie");
    callData("tv");
    $("#search_input").val("")
  });

//Idem sopra ma con il presso su invio
  $("#search_input").keydown(
    function(event) {
      if (event.which == 13) {
        resetSearch();
        callData("movie");
        callData("tv");
        $("#search_input").val("")
      }
  });
});

//-----------functions--------------


function callData(type) {
  // prendo il valore dell'input
    var inputUser = $("#search_input").val();
    // lancio la chiamata ajax
    $.ajax(
      {
      "url": "https://api.themoviedb.org/3/search/" + type,
      "data": {
        "api_key": "02a1201f97c8df2c585d649e1fd9e3fe",
        "query": inputUser,
        "include_adult": false,
        "language": "it"
      },
      "method": "GET",
      "success": function (data) {
        if (data.total_results > 0) {
          $("h2."+type).show();
          //passo il tipo film e il risultato della ricerca alla funzione render
          renderResults(type, data.results);
        } else {
          alert("La ricerca non ha prodotto risultati per la seguente categoria: " + type);
          //cancella il titolo della categoria non trovata
          $("h2."+type).hide();
        }
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
    //variamo le keys a seconda del tipo di contenuto
    if (type == "movie") {
      title = results[i].title;
      original_title = results[i].original_title;
      container = $("#movie_results");
    } else if (type == "tv") {
      title = results[i].name;
      original_title = results[i].original_name;
      container = $("#series_results");
    }

    //caso in cui non è presente l'Overview
    var overview;
    if (results[i].overview == "") {
      overview = "Descizione non disponibile";
    } else {
      overview = results[i].overview
    }

    //funzione che stampa gli attori
    var idMovie = results[i].id;
    console.log(idMovie);

//compiliamo il context
    var context = {
      "title": title,
      "original_title": original_title,
      "original_language": results[i].original_language,
      "vote_average": results[i].vote_average,
      "star": starArray,
      "flag": results[i].original_language,
      "poster": printPoster(results[i]),
      "overview": overview
    }
    //stampa tutto l'html con tanti li quanti sono i film della ricerca
    var html = template(context);
    container.append(html);
  }
}

function printPoster(content) {
  if (content.poster_path == null) {
    var poster = "img/no_poster.png";
    return poster;
  } else {
    var poster = "https://image.tmdb.org/t/p/w342/" + content.poster_path;
    return poster;
  }
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
