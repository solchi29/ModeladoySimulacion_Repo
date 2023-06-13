function calcularPorTrapecios(func, a, b, n) {
  var sumatoria = 0;

  const h = (b - a) / n;                                  // Ancho de cada division

  var fa = func(a);
  var fb = func(b);

  var poligonosAGraficar = [];

  const fa2 = func(a + h);
  poligonosAGraficar.push([
    { x: a, y: fa },
    { x: a + h, y: fa2 },
    { x: a + h, y: 0 },
    { x: a, y: 0 },
  ]);

  for (var k = 1; k < n; k++) {                           // Calcula la altura de cada trapecio y la suma a la sumatoria
    const x = a + h * k;

    var y = func(x);
    sumatoria += y;

    const nextx = a + h * (k + 1);
    var nexty = func(nextx);
    poligonosAGraficar.push([
      { x: x, y: y },
      { x: nextx, y: nexty },
      { x: nextx, y: 0 },
      { x: x, y: 0 },
    ]);
  }
  return {                                              // Devuelve la multiplicacion del alto total por el ancho
    integral: (fa / 2 + fb / 2 + sumatoria) * h,
    grafico: poligonosAGraficar,
  };
}

function graficarTrapecios(grafico, t) {
  const snappiness = 20;
  colorLinea("#f00");
  for (let i = 0; i < grafico.length; i++) {
    let r = grafico[i];
    let rt = sigmoide((t - i) * snappiness);
    let rt2 = sigmoide((t - i - 0.5) * snappiness);
    colorRelleno("#f005");
    poligono([
      { x: r[0].x, y: r[0].y * rt },
      { x: r[1].x, y: r[1].y * rt2 },
      { x: r[2].x, y: r[2].y },
      { x: r[3].x, y: r[3].y },
    ]);
    colorRelleno("#f00");
    punto(r[0].x, r[0].y * rt, 4 * rt);
    punto(r[1].x, r[1].y * rt2, 4 * rt2);
  }
}
