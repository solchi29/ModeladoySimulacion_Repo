function calcularPorRectangulos(func, a, b, n) {
  var sumatoria = 0;
  const h = (b - a) / n;                                                // Ancho de cada rectangulo
  var rectangulosAGraficar = [];


  for (var k = 0; k < n; k++) {                                         // Calcula la altura de cada rectangulo y la suma a la sumatoria
    var y = func(a + h * (k + 0.5));
    sumatoria += y;

    rectangulosAGraficar.push({
      x1: a + k * h,
      y1: 0,
      x2: a + h * (k + 1),
      y2: y,
      contribucion: y * h,
    });
  }
  
  return { integral: sumatoria * h, grafico: rectangulosAGraficar };    // Devuelve la multiplicacion del alto total por el ancho
}

function graficarRectangulos(grafico, t) {
  const snappiness = 20;
  for (let i = 0; i < grafico.length; i++) {
    let r = grafico[i];
    let rt = sigmoide((t - i) * snappiness);
    let rt2 = sigmoide((t - i - 0.5) * snappiness);
    const mid = (r.x2 + r.x1) * 0.5;
    const width = (r.x2 - r.x1) * 0.5;
    // Dibujar rectangulo
    colorLinea("#ff0");
    colorRelleno("#ff05");
    rectangulo(
      mid - width * rt2,
      r.y1,
      mid + width * rt2,
      r.y2 * Math.min(1, rt)
    );
    colorRelleno("#ff0");
    punto((r.x1 + r.x2) / 2, r.y2, rt2 * 4);
  }
}
