//Defino las variables
var canvas;
var ctx;
var elapsed_time = 1 / 60;          // Variables para renderizado
var resultElement;                  // Elementos html
var a = -2;                         // Dominio e imagen
var b = 2;
var yi = -3;
var yf = 3;
var yiSinMargen = -3;
var yfSinMargen = 3;
var method = 0;                     // Metodo
var n = 20;                         // Cantidad total de puntos para MonteCarlo
var m = 15;                         // Cotas (MonteCarlo)
var expression = "Math.sin(x+2)";   // Expresion algebraica con la funcion que se empieza



// Se interpreta la funcion ingresada por el usuario
function Funcion(x) {
  try {
    return eval(expression);
  } catch {
    alert("Expresion inválida");
    FrenarAnimacion();
  }
}

function FrenarAnimacion() {
  velocidadDeAnimacion = 0;
  expression = "";
}

// Cuando se cambian los valores de los inputs:
function OnFunctionChange(event) {                          // Cambia la funcion
  expression = event.target.value;
  // Validacion
  expression = expression.replace(/\(\)/g, "");
  expression = expression.replace(/{/g, "");
  expression = expression.replace(/}/g, "");
  expression = expression.replace(/abs\(/g, "Math.abs(");
  expression = expression.replace(/tan\(/g, "Math.tan(");
  expression = expression.replace(/sin\(/g, "Math.sin(");
  expression = expression.replace(/cos\(/g, "Math.cos(");
  expression = expression.replace(/sqrt\(/g, "Math.sqrt(");
  expression = expression.replace(/x\^2/g, "x*x");
  expression = expression.replace(/x\^3/g, "x*x*x");
  expression = expression.replace(/x\^4/g, "x*x*x*x");
  expression = expression.replace(/x\^5/g, "x*x*x*x*x");
  expression = expression.replace(/x\^6/g, "x*x*x*x*x*x");
}
function OnMethodChange(event) {  
  method = Number(event.target.value);                      // Cambia el metodo
}
function OnAChange(event) {
  a = Number(event.target.value);                           // Cambia a
}
function OnBChange(event) {
  b = Number(event.target.value);                           // Cambia b
}
function OnNChange(event) {
  n = Number(event.target.value);                           // Cambia n
}

function Start() {
  setInterval(Update, elapsed_time * 1000);
  canvas = document.getElementById("mycanvas");           // Obtener el canvas para poder dibujar
  ctx = canvas.getContext("2d");
  resultElement = document.getElementById("Resultado");   // Obtener referencia a los elementos de html para poder cambiar el texto
}

function CalcularAltura(func, a, b, n) {
  yi = 0;
  yf = 0;
  // Busco cotas
  const h = (b - a) / 100;
  const iteraciones = 100;
  for (var k = 0; k <= iteraciones; k++) {
    var y = func(a + h * k);

    if (y > yf) {
      yf = y;
    }

    if (y < yi) {
      yi = y;
    }
  }
  yiSinMargen = yi;
  yfSinMargen = yf;
  const altura = yf - yi;
  yf = yf + altura / 10;
  yi = yi - altura / 10;
}

function BotonCalcular() {
  time = 10000000;
  velocidadDeAnimacion = 10000000;
  Calcular();
}

// Calcular y dibujar la integral
function Calcular() {
  if (n <= 0) {
    alert("'n' debe ser mayor que 0");
    return;
  }

  animatingMethod = method;
  // Calcular integral segun el metodo
  var resultado;
  switch (method) {
    case 0:
      resultado = calcularPorRectangulos(Funcion, a, b, n);
      break;
    case 1:
      resultado = calcularPorTrapecios(Funcion, a, b, n);
      break;
    case 2:
      resultado = calcularPorSimpson(Funcion, a, b, n);
      break;
    case 3:
      resultado = calcularPorMonteCarlo(Funcion, a, b, n);
      break;
  }

  CalcularAltura(Funcion, a, b, n);
  
  resultElement.innerHTML =
    "Resultado: " + Math.round(resultado.integral * 10000000) / 10000000;     // Mostrar resultado en la pagina
    grafico = resultado.grafico;
}

function Update() {
  if (velocidadDeAnimacion > 0) {
    Render();
    time = time + velocidadDeAnimacion * elapsed_time;
    if (time > n + velocidadDeAnimacion) {
      velocidadDeAnimacion = 0;
      console.log("Finished");
    }
  }
}

function Render() {
  dibujarGrilla(a, b, yi, yf);
  dibujarCurva(Funcion);
  switch (animatingMethod) {
    case 0:
      resultado = graficarRectangulos(grafico, time);
      break;
    case 1:
      resultado = graficarTrapecios(grafico, time);
      break;
    case 2:
      resultado = graficarSimpson(grafico, time);
      break;
    case 3:
      resultado = graficarMontecarlo(grafico, time);
      break;
  }
}
