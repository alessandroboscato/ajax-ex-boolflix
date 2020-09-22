// sito https://www.themoviedb.org.
// API_KEY: 02a1201f97c8df2c585d649e1fd9e3fe
// Servirà all’API a capire chi sta effettuando la chiamata.
//https://developers.themoviedb.org/3 movie database

// Milestone 1
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function(){
// al click sul button
  $("#search_btn").click(
    function() {
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
        console.log(data);
      },
      "error": function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
      }
      });

    // click sul button
  });

});
