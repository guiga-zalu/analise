//var Scalar, document;
const	RADIUS = 6, UNTIL = 50,
		width = 1024, height = 512, SPAN = [-6, 6, 3, -3],
		{ LENGTH } = Scalar || { LENGTH: 1 };
var SERIES = 9, A = 0, isLen3 = LENGTH === 3;
//if(!Scalar) var Scalar;

var	K = Scalar.E,//Scalar.random(true),
	L = new Scalar(0, 0),
	Z = new Scalar(A, Math.PI/2, Math.PI/2);//K.versor();

SPAN.push(SPAN[1] - SPAN[0]);
SPAN.push(SPAN[3] - SPAN[2]);

var series, texto;

/**
 * * series
 * Calcula uma série
 *
 * @param { Scalar } z Valor do último elemento atual da série
 * @param { number } i Posição atual na série
 * @returns { Scalar } Novo elemento da série
 */

/**
 * * texto
 * Calcula uma série
 *
 * @param { Scalar } z Valor do último elemento atual da série
 * @param { Scalar } k Valor do parâmetro K
 * @param { Scalar } l Valor do parâmetro L
 * @returns { string } Série como um texto
 */

switch(SERIES){
	//* Soma
	case 1:
		texto = (z, k) => `x\t+= ${k}\nZº = ${z}`;
		series = z => z.plus(K);
		break;
	//* Mandelbroot
	case 2:
		//series = z => z.times(z).sum(K);
		texto = (z, k) => `x\t= x² + ${k} =>\n0\t= x² - x + ${k}\nZº\t= ${z}`;
		series = z => z.pow(2).sum(K);
		break;
	//* Fibonacci
	case 3:
		texto = (z, k, l) => `x\t= (${k}) + (${l}) / x =>\nx²\t= (${k})x + (${l})\nZº\t= ${z}`;
		series = z => L.div(z).plus(K);
		break;
	//* Raiz Quadrada
	case 4:
		/* x = A + B / x <=> x² = Ax + B <=>
		x = [A +- sqrt[A² + 4B]]/2 = K +- sqrt[L]
		K = A/2; L = (A/2)² + B
		A = 2K; B = L - K²
		//series = z => B.div(z).plus(A);
		texto = (z, k, l) => `\nZº = ${z}`;
		series = z => ( L.sub(K.times(K)) ).div( z.plus(K) ).plus( K.times(2) ).sub(K);
		break;*/
		//https://pt.wikipedia.org/wiki/Sequ%C3%AAncia#M%C3%A9todo_para_extra%C3%A7%C3%A3o_da_raiz_quadrada
		//z = sqrt[K] => z² = K => z = K / z => z = (K / z + z) / 2
		texto = (z, k) => `x\t= sqrt(${k})\n\t= (${k}) / x\n\t= ((${k}) / x + x) / 2\nZº\t= ${z}`;
		series = z => K.div(z).plus(z).div(2);
		break;
	//* Teste 1
	case 5:
		//e^z - K
		texto = (z, k, l) => `x\t= exp(x (${l})) - (${k})\nZº\t= ${z}`;
		series = z => Scalar.exp(z.times(L)).sub(K);
		break;
	//* Teste 2
	case 6:
		//L / (e^{-z} + K)
		texto = (z, k) => `x\t= exp(- x) + (${k})\nZº\t= ${z}`;
		series = z => L.div(Scalar.exp(z.negate()).plus(K));
		break;
	//* Teste 3 (círculo)
	case 7:
		texto = (z, k) => `x\t= sqrt(${k} - x²) =>\n2x²\t= ${k} =>\nx\t= sqrt((${k}) / 2)\nZº\t= ${z}`;
		//series = (z, i) => K.sub(z.pow(2)).sqrt();
		series = (z, i) => K.sub(z.pow(L)).pow(L.inverse());
		break;
	//* Esponencial
	case 8:
		texto = (z, k) => `exp(${z})`;
		/*
		0 -> 1
		1 -> 1 + z
		2 -> 1 + z + z²/2
		n -> (n - 1) + z^n / n!
		 */
		series = (z, i, tmp) => {
			let { v } = tmp;
			if(i){
				tmp.v = v.times(Z).div(i);
				return z.plus(tmp.v);
			}else return (tmp.v = Scalar.ONE);
		};
		break;
	//* Super Log
	case 9:
		texto = (z, k) => `slog[${k}](${z})`;
		function slog(z){
			return z.r <= 1 ? 0 : slog(Scalar.log(z)).plus(1);
		}
		series = (z, i) => {
			//if(z.r <= 1) return 0;
			//return z.sub(1).log();
			return i ? Complex.ZERO : new Complex(Scalar.slog(z), 0);
		};
		break;
	//* Identidade
	case 0:
	default:
		texto = z => `x\t= x\nZº\t= ${z}`;
		series = z => z;
		break;
}

// [-4, 4]x[2, -2] -> [0, width]x[0, height]
// [-4, 4] -> [0, 8] -> [0, width]
// [2, -2] -> [0, -4] -> [0, height]
// (x, y) -> [0, w]x[0, h]
function transform(x, y){
	return [width * (x - SPAN[0]) / SPAN[4], height * (y - SPAN[2]) / SPAN[5]];
}
// [0, width]x[0, height] -> [-4, 4]x[2, -2]
// [0, width]x[0, height] -> [0, 8]x[0, -4] -> [-4, 4]x[2, -2]
// [0, w]x[0, h] -> (x, y)
function desform(x, y){
	return [SPAN[4] * x / width + SPAN[0], SPAN[5] * y / height + SPAN[2]];
}

const	{ body } = document,
		canvas_dom = body.querySelector('.left canvas'),
		canvas = canvas_dom.getContext('2d'),
		p_coords = body.querySelector('.data #coords'),
		table = body.querySelector('.data .list'),
		inputs = 'z-x z-y k-x k-y l-x l-y'.split(' ').map(n => ({
			n: n.split('-'),
			e: body.querySelector(`.controls .control input#control-${n}`)
		})),
		eqn = body.querySelector('.controls .equation'),
		options = body.querySelector('.data select#mouse-control');

const circle = {
	moveTo(x, y, z){//OK(x, y)
		circle.clear();
		if(isLen3) table.innerHTML = '<tr><th>A</th><th>B</th><th>C</th><th>R²</th>';
		else table.innerHTML = '<tr><th>A</th><th>B</th><th>R²</th><th>Ângulo</th></tr>';

		var str = '';
		
		str += `K\t= (${K.toFixed(3)})`;
		if(Scalar.hasPolar) str += ` = ${K.toFixed(2, !0)}`;
		str += '\n';
		
		str += `L\t= (${L.toFixed(3)})`;
		if(Scalar.hasPolar) str += ` = ${L.toFixed(2, !0)}`;
		str += '\n';
		
		str += `Zº\t= (${+x.toFixed(3)};\t${+y.toFixed(3)}`;
		if(isLen3) str += `;\t${+z.toFixed(3)}`;
		str += ')';
		
		p_coords.innerText = str;
		circle.drawAxis();//OK
		circle.drawSeries(x, y, z);
		if(isLen3){
			circle.drawCircle(y, z, 'darkred');
			circle.drawCircle(K.b, K.c, 'yellow');
			circle.drawCircle(L.b, L.c, 'green');
		}else{
			circle.drawCircle(x, y, 'darkred');//OK(x, y)
			circle.drawCircle(K.a, K.b, 'yellow');
			circle.drawCircle(L.a, L.b, 'green');
			//console.log('move: (%s; %s)', x, y);
		}
	},
	clear(){
		//canvas.clearRect(0, 0, width, height);
		canvas.beginPath();
		canvas.fillStyle = 'white';
		canvas.rect(0, 0, width, height);
		canvas.fill();
	},
	drawAxis(){//OK
		// Axis
		canvas.beginPath();
		canvas.strokeStyle = '#000000';
		canvas.lineWidth = 2;
		canvas.moveTo(...transform(SPAN[0], 0));
		canvas.lineTo(...transform(SPAN[1], 0));
		canvas.moveTo(...transform(0, SPAN[3]));
		canvas.lineTo(...transform(0, SPAN[2]));
		canvas.stroke();
		
		//Grid
		canvas.beginPath();
		canvas.strokeStyle = '#222222';
		canvas.lineWidth = 1;
		var i;
		for(i = 2 * SPAN[0]; i < 2 * SPAN[1]; i++){
			canvas.moveTo(...transform(SPAN[0], i));
			canvas.lineTo(...transform(SPAN[1], i));
		}
		for(i = 2 * SPAN[3]; i < 2 * SPAN[2]; i++){
			canvas.moveTo(...transform(i, SPAN[3]));
			canvas.lineTo(...transform(i, SPAN[2]));
		}
		canvas.stroke();
	},
	drawCircle(x, y, color){//OK(x, y)
		canvas.beginPath();
		canvas.strokeStyle = color;
		canvas.lineWidth = 3;
		canvas.arc(...transform(x, y), RADIUS, 0, 2 * Math.PI);//[w, h]
		canvas.stroke();
	},
	drawSeries(x, y, z){//OK(x, y)
		var str = '';
		if(isLen3){
			var tmp = { v: Scalar.ZERO };
			let c = series(new Scalar(x, y, z), 0, tmp);
			circle.drawSeriesPoint(c.b, c.c, y, z);//OK(x, y)
			
			str += `<tr><td>${c.join('</td><td>')}</td></tr>`;
			
			for(let i = 1; i < UNTIL; i++){
				let { b: x, c: y } = c;
				c = series(c, i, tmp);
				
				str += `<tr><td>${c.join('</td><td>')}</td></tr>`;
				
				circle.drawSeriesPoint(c.b, c.c, x, y);//OK(x, y)
			}
		}else{
			let c = series(new Scalar(x, y, z), 0);
			circle.drawSeriesPoint(c.a, c.b, x, y);//OK(x, y)
			
			str += `<tr><td>${c.join('</td><td>')}</td></tr>`;
			
			for(let i = 1; i < UNTIL; i++){
				let { a: x, b: y } = c;
				c = series(c, i);
				
				str += `<tr><td>${c.join('</td><td>')}</td></tr>`;
				
				circle.drawSeriesPoint(c.a, c.b, x, y);//OK(x, y)
			}
		}
		table.innerHTML += str;
	},
	drawSeriesPoint(...args){//OK(x, y)
		var [x, y] = transform(...args.slice(0, 2));
		var [x0, y0] = transform(...args.slice(2));
		
		canvas.beginPath();
		canvas.strokeStyle = 'cyan';
		canvas.moveTo(x0, y0);
		canvas.lineTo(x, y);
		canvas.stroke();
		
		canvas.beginPath();
		canvas.strokeStyle = 'red';
		canvas.lineWidth = 2;
		canvas.arc(x, y, RADIUS, 0, 2 * Math.PI);
		canvas.stroke();
	}
};

canvas_dom.width = width; canvas_dom.height = height;

function update_mouse(e){
	var { clientX: x, clientY: y } = e, point;
	if(isLen3){
		point = new Scalar(0, ...desform(x, y));
		switch(options.value){
			case 'L':{
				let tmp = L.a;
				L = point;
				L.a = tmp;
				inputs[4].e.value = L.b;
				inputs[5].e.value = L.c;
				break;
			}
			case 'K':{
				let tmp = K.a;
				K = point;
				K.a = tmp;
				inputs[2].e.value = K.b;
				inputs[3].e.value = K.c;
				break;
			}
			case 'Z':
			default:
				let tmp = Z.a;
				Z = point;
				Z.a = tmp;
				inputs[0].e.value = Z.b;
				inputs[1].e.value = Z.c;
				break;
		}
		circle.moveTo(Z.a, Z.b, Z.c);
	}else{
		point = new Scalar(...desform(x, y));
		switch(options.value){
			case 'L':
				L = point;
				inputs[4].e.value = L.a;
				inputs[5].e.value = L.b;
				break;
			case 'K':
				K = point;
				inputs[2].e.value = K.a;
				inputs[3].e.value = K.b;
				break;
			case 'Z':
			default:
				Z = point;
				inputs[0].e.value = Z.a;
				inputs[1].e.value = Z.b;
				break;
		}
		circle.moveTo(Z.a, Z.b);
	}
	eqn.innerText = texto(Z, K, L);
}

function update_data(e){
	let	k = [+inputs[2].e.value, +inputs[3].e.value],
		l = [+inputs[4].e.value, +inputs[5].e.value];
	
	K.a = k[0]; K.b = k[1];
	if(K._calc_polar) K._calc_polar();
	L.a = l[0]; L.b = l[1];
	if(L._calc_polar) L._calc_polar();
	
	eqn.innerText = texto(Z, K, L);

	if(isLen3) circle.moveTo(A, +inputs[0].e.value, +inputs[1].e.value);
	else circle.moveTo(+inputs[0].e.value, +inputs[1].e.value);
}

inputs.forEach(({ e }) => e.addEventListener('change', update_data));

canvas_dom.addEventListener('mousedown', e => {
	update_mouse(e);
	canvas_dom.addEventListener('mousemove', update_mouse);
});
canvas_dom.addEventListener('mouseup', e => {
	canvas_dom.removeEventListener('mousemove', update_mouse);
});

function start(){
	inputs.forEach(({ n, e }) => {
		if(n[1] === 'x'){
			e.setAttribute('min', SPAN[0]);
			e.setAttribute('max', SPAN[1]);
		}else{
			e.setAttribute('min', SPAN[3]);
			e.setAttribute('max', SPAN[2]);
		}
	});
	
	var { a, b } = Z;
	circle.moveTo(a, b, A);
	
	eqn.innerText = texto(Z, K, L);
}
function start1(){
	for(var j = 0; j < height; j++){
		for(var i = 0; i < width; i++){
			var k = i % 0x100;
			canvas.beginPath();
			canvas.fillStyle = `#${k.toString(16)}${k.toString(16)}${((i - k) / 0x100).toString(16)}`;
			//`hsl(${i % 360}deg, 1, .5)`;
			canvas.rect(i, 0, 1, 16);
			canvas.fill();
		}
	}
}

start();

/*
K para série x² = Kx + 1
-a + ai
0,64 - 0,73i
-0,03422779333419304 + 0,05342256450431793i
 */