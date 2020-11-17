Math.TAU = 'TAU' in Math ? Math.TAU : 2 * Math.PI;

/**
 * Complexos 3
 * * ij = i, ji = j
 * ! (ij)² = i² = j² = (ji)² = -1
 * @class Complex 3
 */
class Complex3{
	/**
	 * Cria um objeto de número Complexo 3.
	 * @param { number | null } a Valor Real
	 * @param { number | null } b Valor Imaginário
	 * @param { number | null } c Valor Imaginário
	 * @memberof Complex
	 */
	constructor(a = 0, b = 0, c = 0){
		this.a = a ? +a : 0;
		this.b = b ? +b : 0;
		this.c = c ? +c : 0;
	}
	get data(){
		let { a, b, c } = this;
		return [a, b, c];
	}
	get r(){
		return this.constructor.distance(this.a, this.b, this.c);
	}
	sum(...d){
		var	ctn = this.constructor,
			z = ctn.asComplex3(...d),
			ret = ctn.from(this);
		ret.a += z.a;
		ret.b += z.b;
		ret.c += z.c;
		return ret;
	}
	plus(...c){return this.sum(...c);}
	negate(){return new this.constructor(-this.a, -this.b, -this.c);}
	conjugate(){return new this.constructor(this.a, -this.b, -this.c);}
	minus(...d){
		if(!d.length) return this.negate();
		var	ctn = this.constructor,
			z = ctn.asComplex3(...d);
		return this.sum(z.negate());
	}
	sub(...c){return this.minus(...c);}
	times(...d){
		var	{ a, b, c, constructor: ctn } = this,
			z = ctn.asComplex3(...d),
			{ a: za, b: zb, c: zc} = z;
		return new ctn(
			a * za - b * zb - c * zc,
			a * zb + b * (za + zc),
			a * zc + c * (za + zb)
		);
	}
	inverse(){
		const { a, b, c, r, constructor: ctn } = this;
		/*
		 * 1/z = conj(z) / (z conj(z))
		 * = conj(z) xconj(z) / (z conj(z) xconj(z))
		 * = conj(z) xconj(z) / (|z|² xconj(z))
		 */
		/*
		z^* = (r² - bc(-1 + i + j))/(r² - bc)
		 */
		if(b && c){
			var r2 = r ** 2,
				s = r2 - b * c,
				k = b * c / s;
			return new ctn(r2 / s + k, -k, -k);
		}else if(b)
			return new ctn(a / r, - b / r, 0);
		else if(c)
			return new ctn(a / r, 0, - c / r);
		else if(a)
			return new ctn(1 / a, 0, 0);
		return new ctn(1/0, 1/0, 1/0);
	}
	module(){
		const { a, b, c, r, constructor: ctn } = this;
		if(b && c){
			var bc = b * c, r2 = r ** 2, l, m, l2;
			if(a){
				let bc2 = bc * 2;
				l2 = bc2 - (3 * r2 - 4 * Math.sqrt(14 * (bc2 ** 2) + (r2 ** 2) - 14 * bc2 * r2));
			}else{
				let b2 = b ** 2, c2 = c ** 2;
				l2 = 4 * bc - 3 * r2 + 2 * Math.sqrt(
					b2 * (b2 - bc) + c2 * (c2 - bc) + bc ** 2
				);
			}
			l = Math.sqrt(l2);
			m = - l + Math.sqrt(l2 - bc);
			return new ctn(l, m, m);
		}
		return new ctn(ctn.distance(a, b, c));
	}
	module2(){
		const r2 = this.r ** 2,
			bc = this.b * this.c,
			ctn = this.constructor;
		return new ctn(r2, bc, bc);
	}
	div(...d){
		if(!d.length) return this.inverse();
		var	ctn = this.constructor,
			c = ctn.asComplex3(...d);
		return this.times(c.inverse());
	}
	//pow(...d){}
	cosh(){
		//[e^z + e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).sum(ctn.exp(this.negate())).times(0.5);
	}
	//cos(){}
	sinh(){
		//[e^z - e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).minus(ctn.exp(this.negate())).times(0.5);
	}
	//sin(){}
	tanh(){
		return this.sinh().div(this.cosh());
	}
	tan(){
		return this.sin().div(this.cos());
	}
	//sqrt(){return this.pow(1/2);}
	vector(){return new this.constructor(0, this.b, this.c);}
	versor(){
		return new this.constructor(!1, !1, 1, this.t);
	}
	ceil(){
		return new this.constructor(Math.ceil(this.a), Math.ceil(this.b), Math.ceil(this.c));
	}
	floor(){
		return new this.constructor(Math.floor(this.a), Math.floor(this.b), Math.floor(this.c));
	}
	round(){
		return new this.constructor(Math.round(this.a), Math.round(this.b), Math.round(this.c));
	}
	//log(){}
	toFixed(k){
		if(k === undefined) k = 3;
		var b = +this.b.toFixed(k), c = +this.c.toFixed(k);
		return this.a.toFixed(k) +
			' ' + (b < 0 ? '-' : '+') + ' ' + Math.abs(b) + 'i' +
			' ' + (c < 0 ? '-' : '+') + ' ' + Math.abs(c) + 'j';
	}
	toString(p){
		var { b, c } = this;
		return this.a +
			` ${b < 0 ? '-' : '+'} ${Math.abs(b)}i` +
			` ${c < 0 ? '-' : '+'} ${Math.abs(c)}j`;
	}
	toSource(){
		return `Complex3 { a: ${this.a}, b: ${this.b}, c: ${this.c} }`;
	}
	join(k){
		let { a, b, c } = this;
		
		a = +a.toFixed(3); b = +b.toFixed(3); c = +c.toFixed(3);
		
		return `${a}${k}${b}${k}${c}`;
	}
	valueOf(){
		return this.toString();
	}
	static is(a){return this.isComplex3(a);}
	static isComplex3(a){return a instanceof this;}
	static from(...a){
		if(a.length === 1) a = a[0];
		if(this.isComplex3(a))
			return new this(a.a, a.b, a.c);
		else if(Array.isArray(a))
			return new this(...a);
		else if(typeof a === 'number' || a instanceof Number)
			return new this(a);
		else if(typeof a === 'object'){
			if('a' in a && 'b' in a && 'c' in a)
				return new this(a.a, a.b, a.c);
		}
		return this.ZERO;
	}
	static as(...c){return this.asComplex3(...c);}
	static asComplex3(...c){return this.isComplex3(c[0]) ? c[0] : this.from(...c);}
	static distance(...a){return Math.hypot(...a);}
	//static exp(...c){}
	static random(x){
		if(x){
			var t = Math.random() * Math.TAU, p = Math.random() * Math.TAU, cos = Math.cos(t);
			return new this(cos * Math.cos(p), cos * Math.sin(p), Math.sin(t));
		}
		return new this(Math.random(), Math.random(), Math.random());
	}
	static eq(c1, c2){return Math.hypot(c1.a - c2.a, c1.b - c2.b, c1.c - c2.c) <= this.EPSILON;}
	eq(c){return this.constructor.eq(this, c);}
	static isScalar(){return this.isComplex3(...arguments);}
	static asScalar(){return this.asComplex3(...arguments);}
	static isInt(...c){
		c = this.asComplex3(...c);
		return !(
			c.a % 1 >= this.EPSILON
			|| c.b % 1 >= this.EPSILON
			|| c.c % 1 >= this.EPSILON
		);
	}
}
Complex3.ONE = new Complex3(1, 0, 0);
Complex3.i = new Complex3(0, 1, 0);
Complex3.i = new Complex3(0, 0, 1);
Complex3.LN2 = new Complex3(Math.LN2);
Complex3.LN10 = new Complex3(Math.LN10);
Complex3.EPSILON = 1e-12;
Complex3.ZERO = new Complex3(0, 0, 0);
Complex3.hasPolar = false;

Complex3.LENGTH = 3;
try{module.exports = Complex3;}catch(e){}