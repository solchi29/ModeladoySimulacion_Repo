function calcularPorMonteCarlo(func, a, b, n) {
  var cantPuntosPos = 0;
  var cantPuntosNeg = 0;

  const h = (b - a) / n;
  const eEst = 0.1;           //Error estimativo

  var cotaSup = 0;            //Cotas
  var cotaInf = 0;

  // Busco cotas
  for (var k = 0; k <= n; k++) {
    var y = func(a + h * k);

    if (y > cotaSup) {
      cotaSup = y;
    }

    if (y < cotaInf) {
      cotaInf = y;
    }
  }

  // Calcular H (Altura del rectangulo)
  var altura =
    cotaSup + eEst * Math.abs(cotaSup) - (cotaInf - eEst * Math.abs(cotaInf));

  var puntosAGraficar = [];

  // Calcular puntos aleatorios
  for (var i = 0; i <= n; i++) {
    var xi = a + Math.random() * (b - a);
    var yi = cotaInf - eEst * Math.abs(cotaInf) + altura * Math.random();

    var fxi = func(xi);

    // Conteo de puntos de exito
    if (yi >= 0 && fxi >= 0 && yi <= fxi) {
      cantPuntosPos++;
      puntosAGraficar.push({ x: xi, y: yi, contribucion: 1 });
    } else if (yi < 0 && fxi < 0 && yi >= fxi) {
      cantPuntosNeg++;
      puntosAGraficar.push({ x: xi, y: yi, contribucion: -1 });
    } else {
      puntosAGraficar.push({ x: xi, y: yi, contribucion: 0 });
    }
  }

  // Devuelve resultado final
  return {
    integral: ((cantPuntosPos - cantPuntosNeg) / n) * (b - a) * altura,
    grafico: puntosAGraficar,
  };
}

function graficarMontecarlo(grafico, t) {
  const snappiness = 20;
  for (let i = 0; i < grafico.length; i++) {
    let r = grafico[i];
    let rt = sigmoide(((t - i - 1) * snappiness) / velocidadDeAnimacion);
    if (t > i) {
      switch (r.contribucion) {
        case -1:
          colorRelleno("#f00");
          break;
        case 0:
          colorRelleno("#888");
          break;
        case 1:
          colorRelleno("#0f0");
          break;
      }
      punto(r.x, r.y * rt, 3 * rt);
    }
  }
}
