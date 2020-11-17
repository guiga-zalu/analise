const	crivo = require('./operation').crivo.Complex,
	Complex = require('./complex');

var primosDataset = crivo(1e4).sort();
var primos = primosDataset.data;
for(const primo of primos) console.log(primo + '');
/*console.log(primos.map(primo => Math.round(primo.r ** 2)).reduce((r, a) => {
	if(a in r) r[a]++;
	else r[a] = 1;
	return r;
}, {}));*/

//console.dir(primosDataset.maped(d => d.toFixed(- Math.log10(Complex.EPSILON), true)).data);

/*var { stepper } = crivo;
var passo = stepper();
for(var k = 0; k < 20; k++){
	console.log(passo.next().value + '');
}*/