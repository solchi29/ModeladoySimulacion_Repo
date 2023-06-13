// Variables
var canvasXi = 12;                // Posiciones en pixel del dibujo
var canvasYi = 506;
var canvasXf = 1012;
var canvasYf = 6;
var xi = 0;                       // Dominio e imagen a graficar
var xf = 1;
var yi = 0;
var yf = 1;

// Funcion que mueve un valor de un rango a otro
function map(s, a1, a2, b1, b2) {
  if (a2 == a1) return 0;
  return b1 + ((s - a1) * (b2 - b1)) / (a2 - a1);
}

// Convierte un valor X matemático a pixels del lienzo para poder dibujarlo
function xGrilla(x) {
  return map(x, xi, xf, canvasXi, canvasXf);
}

// Convierte un valor Y matemático a pixels del lienzo para poder dibujarlo
function yGrilla(y) {
  return map(y, yi, yf, canvasYi, canvasYf);
}

// Cambiar el color usando un codigo hex 
function color(hex) {
  ctx.fillStyle = hex;
  ctx.strokeStyle = hex;
}

// Cambiar el color del relleno
function colorRelleno(hex) {
  ctx.fillStyle = hex;
}

// Cambiar el color de linea
function colorLinea(hex) {
  ctx.strokeStyle = hex;
}

// Cambiar el grosor de linea
function grosor(g) {
  ctx.lineWidth = g;
}

// Dibuja un circulo con posicion (x,y) y radio 'r'
function punto(x, y, r) {
  ctx.beginPath();
  ctx.arc(xGrilla(x), yGrilla(y), r, 0, 2 * Math.PI);
  ctx.fill();
}

// Dibuja una linea entre el punto (x1, y1) y el punto (x2, y2)
function linea(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(xGrilla(x1), yGrilla(y1));
  ctx.lineTo(xGrilla(x2), yGrilla(y2));
  ctx.stroke();
}

// Dibuja un rectangulo entre el punto (x1, y1) y el punto (x2, y2)
function rectangulo(x1, y1, x2, y2) {
  const minx = xGrilla(Math.min(x1, x2));
  const maxx = xGrilla(Math.max(x1, x2));
  const miny = yGrilla(Math.min(y1, y2));
  const maxy = yGrilla(Math.max(y1, y2));
  const w = maxx - minx;
  const h = maxy - miny;
  ctx.fillRect(minx, miny, w, h);
  ctx.strokeRect(minx, miny, w, h);
}

// Dibuja un polígono dado un arreglo de puntos con formato {x, y}
function poligono(puntos) {
  ctx.beginPath();
  ctx.moveTo(xGrilla(puntos[0].x), yGrilla(puntos[0].y));
  for (var i = 1; i < puntos.length; i++) {
    ctx.lineTo(xGrilla(puntos[i].x), yGrilla(puntos[i].y));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

// Dibuja los ejes x,y con numeros y las subdivisiones del grafico
function dibujarGrilla(_xi, _xf, _yi, _yf) {
  ctx.clearRect(0, 0, 1024, 512);
  xi = _xi;
  xf = _xf;
  yi = _yi;
  yf = _yf;

  color("#fff");                   // Color y groso del eje x
  grosor(3);

  linea(xi, 0, xf, 0);             // Dibujar eje X

  color("#fff");                   // Color y funte de los numeros del eje
  font("18px Arial");

  const stepX = 1;                 // Espaciado entre los números en el eje X
  for (var x = Math.floor(xi) + stepX; x <= xf; x += stepX) {
    texto(" " + redondear(x), x, 0);
  }
  for (var x = Math.ceil(xi) - stepX; x >= xf; x -= stepX) {
    texto(" " + redondear(x), x, 0);
  }
  
  color("#fff");                   // Color y groso del eje y
  grosor(3);

  linea(0, yi, 0, yf);             // Dibujar eje Y

  color("#fff");                   // Color y funte de los numeros del eje
  font("18px Arial");

  const stepY = 1;                 // Espaciado entre los números en el eje Y
  for (var y = Math.floor(yi) + stepY; y <= yf; y += stepY) {
    texto(" " + redondear(y), 0, y);
  }
  for (var y = Math.ceil(yi) - stepY; y >= yf; y -= stepY) {
    texto(" " + redondear(y), 0, y);
  }

  color("#fff3");
  grosor(2);
  
                                  
  if (xf - xi < 250) {             // Dibujar subdivisiones
    for (var x = Math.floor(xi) + stepX; x <= xf; x += stepX) {
      linea(x, yi, x, yf);
    }
    for (var x = Math.ceil(xi) - stepX; x >= xf; x -= stepX) {
      linea(x, yi, x, yf);
    }
  }
  if (yf - yi < 150) {
    for (var y = Math.floor(yi) + stepY; y <= yf; y += stepY) {
      linea(xi, y, xf, y);
    }
    for (var y = Math.ceil(yi) - stepY; y >= yf; y -= stepY) {
      linea(xi, y, xf, y);
    }
  }

  texto(" " + redondear(yiSinMargen), 0, yiSinMargen);
  texto(" " + redondear(yfSinMargen), 0, yfSinMargen);
}



// Dibuja la curva de la funcion
function dibujarCurva(func) {
  grosor(1);
  color("#fff");
  const segmentos = 256;
  const intervalo = Math.max(0.01, Math.abs((xf - xi) / segmentos));
  var valorAnterior = func(a);

  for (var i = a; i < b; i += intervalo) {
    const valorSiguiente = func(i + intervalo);
    linea(i, valorAnterior, i + intervalo, valorSiguiente);
    valorAnterior = valorSiguiente;
  }

  if (xi <= 0 && xf >= 0) {
    const func0 = func(0);
    font("18px Arial");
    texto(" " + redondear(func0), 0, func0);
  }
}

function parabolaPor3Puntos(xi, yi, xm, ym, xf, yf) {
  function midPoints(xi, yi, xm, ym, xf, yf) {
    const curvature = (ym * 2 - yf - yi) / 8;
    var x1 = (xi + xm) / 2;
    var y1 = (yi + ym) / 2 + curvature;
    var x2 = (xm + xf) / 2;
    var y2 = (ym + yf) / 2 + curvature;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  }

  var mids = midPoints(xi, yi, xm, ym, xf, yf);
  var leftMids = midPoints(xi, yi, mids.x1, mids.y1, xm, ym);
  var rightMids = midPoints(xm, ym, mids.x2, mids.y2, xf, yf);
  poligono([
    { x: xi, y: 0 },
    { x: xi, y: yi },
    { x: leftMids.x1, y: leftMids.y1 },
    { x: mids.x1, y: mids.y1 },
    { x: leftMids.x2, y: leftMids.y2 },
    { x: xm, y: ym },
    { x: rightMids.x1, y: rightMids.y1 },
    { x: mids.x2, y: mids.y2 },
    { x: rightMids.x2, y: rightMids.y2 },
    { x: xf, y: yf },
    { x: xf, y: 0 },
  ]);
}

function sigmoide(x) {
  if (x < -6) return 0;
  if (x > 6) return 1;
  const ex = Math.pow(2.718, x);
  return ex / (ex + 1);
}

function font(txt) {
  ctx.font = txt;
}

function texto(txt, x, y) {
  ctx.fillText(txt, xGrilla(x), yGrilla(y));
}

function redondear(n) {
  return Math.round(n * 100) / 100;
}

