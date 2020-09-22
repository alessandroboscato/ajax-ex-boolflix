// sito https://www.themoviedb.org.
// API_KEY: 02a1201f97c8df2c585d649e1fd9e3fe
// Servirà all’API a capire chi sta effettuando la chiamata.
//https://developers.themoviedb.org/3 movie database

// Milestone 1
// Creare layout base con una searchbar (una input e un button) in cuiscrivere completamente o parzialmente il nome di un film. Al click cercare sull’API tutti i film contenenti quanto scritto dall'user.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo Titolo Originale Lingua Voto

$(document).ready(function(){
// al click sul button
  $("#search_btn").click(
    function() {
    printMovies();
    // click sul button
  });

});

//-----------functions--------------

function printMovies() {
  // prendo il valore dell'input
    var inputUser = $("#search_input").val();
    // lancio la chiamata ajax
    $.ajax(
      {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key": "02a1201f97c8df2c585d649e1fd9e3fe",
        "query": inputUser,
        "include_adult": false
      },
      "method": "GET",
      "success": function (data) {
        console.log(data.results);
        var arrayMovies = data.results.length;
        //compiliamo il template handlebars
        var source = document.getElementById("entry-template").innerHTML;
        var template = Handlebars.compile(source);
        for(var i = 0; i < arrayMovies; i++) {
          //contenuto template ciclato x n movies
          var context = {
            "title": data.results[i].title,
            "original_title": data.results[i].original_title,
            "original_language": data.results[i].original_language,
            "vote_average": data.results[i].vote_average,
          }
          var html = template(context);
          $("#search_results").append(html);
        }




      },
      "error": function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
      }
      });
      $("#search_input").val("");
}
