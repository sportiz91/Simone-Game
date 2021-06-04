//alert de comprobación sincronización correcta.
// alert("hola");

//0. ----------------------------------------------------------------------------------------------------
//arrays/variables iniciales
var buttonColors = ["red", "blue", "green", "yellow"]; //colores disponibles
var gamePattern = []; //patrón que usa el Simone Game. Arranca sin elementos.
var userPattern = []; //patrón del usuario. Arranca sin elementos
var level = 0; //nivel actual del juego. Cuando es 0, el juego arranca automáticamente al presionar una tecla. A medida
//voy pasando los niveles, level irá incrementando de a 1 y cambiando el título del juego por el nivel actual.

//1. ----------------------------------------------------------------------------------------------------
//event listener. Cuando se clickea una tecla por primera vez (level = 0) se ejecuta la función nextSequence.
//Importante: cuando selecciono los objetos del DOM con jQuery, el event listener no se puede agregar a través de
//addEventListener. Lo puedo agregar directamente poniendo . y el event listener que quiera utilizar.
$(document).keypress(function () { //NOTA: keydown admite caracteres especiales (CTRL, ALT, SHIFT). Keypress no.
  if (level === 0) {
    nextSequence();
  }
})

//2. ----------------------------------------------------------------------------------------------------
//inicializa juego si level = 0. Si la secuencia es correcta, agrega un nuevo color aleatorio a la secuencia del array gamePattern.
function nextSequence() {

  //incrementamos un nivel al juego
  level++;

  //cambiamos el título al nivel actual
  $("h1").text("Level " + level); //equivalente a decir $("h1").html("Level " + level);

  //función que genera número aleatorio en rango 0-3
  var randomNumber = Math.floor(Math.random() * 4);

  //variable con color random
  var randomChosenColour = buttonColors[randomNumber];

  //se agrega color random a array de gamePattern
  gamePattern.push(randomChosenColour);

  //seleccionar botón que salió elegido en el randomChosenColour y hacerle efecto flash
  $("#" + randomChosenColour).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);

  //darle sonido al botón seleccionado
  playSound(randomChosenColour);

}

//3. ----------------------------------------------------------------------------------------------------
//función que ejecuta el sonido según el color clickeado o según el nextSequence().
function playSound(name) {

  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();

}

//4. ----------------------------------------------------------------------------------------------------
//for loop itera sobre array de colores y agrega un click event listener. Luego ejecuta funciones playSound, animatePress
//y checkAnwser luego de un timer.
//NOTA: dado que en este desarrollo los únicos botones son los del Simone, se podría haber evitado un for loop y agregar el event listener a la clase de .btn simplemente (ver Angela)
for (var i = 0; i < buttonColors.length; i++) { //de 0 a 3.

  //agregamos event listener para cada botón
  $("#" + buttonColors[i]).click(function () { //otra variante del eventlistener: .on("click", function () {bla})

    //impide presionar botones cuando level === 0.
    if (level === 0) {
      return;
    }

    //nos guardamos el nombre del color en la variable buttonName.
    var buttonName = $(this).attr("id");

    //ejecutamos sonido del color.
    playSound(buttonName);

    //ejecutamos animación (la misma para todos los colores).
    animatePress(buttonName);

    //agregamos el color clickeado al array userPattern
    userPattern.push(buttonName);

    //timeout: para que no salga primero el alert de que ganamos o perdimos el nivel, antes del sonido y el efecto flash.
    setTimeout(function() { checkAnswer()
    }, 200); //timer de 200 ms porque el timer del efecto flash es de 100 ms (esto tiene que ser mayor).

  })
}

//5. ----------------------------------------------------------------------------------------------------
//función que agrega clase color gris al botón presionado. La quita luego de 100 milisegundos (= 1 segundo)
function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");

  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

//6. ----------------------------------------------------------------------------------------------------
//función que chequea que la respuesta del usuario es la misma que el patrón del Simone Game.
function checkAnswer(currentLevel) {

  for (var j = 0; j < userPattern.length; j++) {
    if (userPattern[j] !== gamePattern[j]) {
      $("h1").html("Game Over, Press Any Key to Start");
      var wrong = "wrong";
      playSound(wrong);
      $("body").addClass("game-over");
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);
      level = 0;
      gamePattern = [];
      userPattern = [];
      return; //salimos de la función
    }
  }

  if (userPattern.length === gamePattern.length) {
    //líneas de código que ejecutamos si ambos arrays son iguales.
    alert("Next level! User Pattern: " + userPattern + ". game Pattern: " + gamePattern + ".");
    nextSequence(); //comenzamos nueva secuencia.
    userPattern = []; //volvemos a 0 el array del usuario.
  }

}
