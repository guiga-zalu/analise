Math.TAU = 'TAU' in Math ? Math.TAU : 2 * Math.PI;
Math.split = function split(x){
	return [Math.sign(x), Math.abs(x)];
};

/**
 * Complexos separados
 * * j² = 1
 * @class D
 */
class D{
	constructor(a, b){
		this.a = a ? +a : 0;
		this.b = b ? +b : 0;
		this._calc_polar();
	}
	get data(){
		let { a, b } = this;
		return [a, b];
	}
	/**
	 * Soma um número complexo-separado com outro
	 *
	 * @param { * } d
	 * @returns { D } Resultado da soma com o número d
	 * @memberof D
	 */
	sum(...d){
		var	ctn = this.constructor,
			ret = ctn.from(this);
		d = ctn.asSplitComplex(...d);
		ret.a += d.a;
		ret.b += d.b;
		return ret._calc_polar();
	}
	/**
	 * Alias para .soma
	 *
	 * @param { * } d
	 * @returns Resultado da soma com o número d
	 * @memberof D
	 */
	plus(...d){return this.sum(...d);}
	negate(){
		return new this.constructor(-this.a, -this.b);
	}
	conjugate(){
		return new this.constructor(this.a, -this.b);
	}
	minus(...c){
		if(!c.length) return this.negate();
		var	ctn = this.constructor,
			d = ctn.asSplitComplex(...c);
		return this.sum(d.negate());
	}
	sub(...d){
		return this.minus(...d);
	}
	times(...d){
		var	ctn = this.constructor,
			ret = ctn.from(this);
		d = ctn.asSplitComplex(...d);
		
		return new ctn(
			ret.a * d.a + ret.b * d.b,
			ret.a * d.b + ret.b * d.a
		)._calc_polar();
	}
	inverse(){
		var	d = this.conjugate().times(1 / this.module);
		return d;
	}
	div(...c){
		if(!c.length) return this.inverse();
		var	ctn = this.constructor,
			d = ctn.asSplitComplex(...c);
		return this.times(d.inverse());
	}
	pow(...d){
		var ctn = this.constructor;
		
		d = ctn.asSplitComplex(...d);
		
		return ctn.exp(d.times(this.log()));
	}
	cosh(){
		//[e^z + e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).sum(ctn.exp(this.negate())).times(0.5);
	}
	cos(){
		//[e^(iz) + e^(-iz)]/2 = cosh(iz)/
		var ctn = this.constructor;
		return this.cosh(this.times(ctn.j));
	}
	sinh(){
		//[e^z - e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).minus(ctn.exp(this.negate())).times(0.5);
	}
	sin(){
		//[e^(iz) - e^(-iz)]/2i = sinh(iz)/i
		var ctn = this.constructor, { j } = ctn;
		return this.sinh(this.times(j)).div(j);
	}
	tanh(){
		return this.sinh().div(this.cosh());
	}
	tan(){
		return this.sin().div(this.cos());
	}
	sqrt(){
		return this.pow(1/2);
	}
	versor(){
		return this.constructor.exp(0, this.log().b);
	}
	ceil(){
		return new this.constructor(Math.ceil(this.a), Math.ceil(this.b));
	}
	floor(){
		return new this.constructor(Math.floor(this.a), Math.floor(this.b));
	}
	round(){
		return new this.constructor(Math.round(this.a), Math.round(this.b));
	}
	log(){
		//e^(a + j t ) = e^a (cosh t + j sinh t) -> j t + log(a)
		//var [ sinal, modulo ] = Math.split(this.module);
		//var t = Math.asinh(this.b / modulo * sinal);
		//return new this.constructor(Math.log(modulo) / 2, t);
		var { a, b } = this;
		var l1 = Math.log(a + b) / 2, l2 = Math.log(a - b) / 2;
		return new this.constructor(l1 + l2, l1 - l2);
	}
	toLongFixed(k){
		if(k === undefined) k = 6;
		k |= 0;
		return `Split-Complex { a: ${this.a.toFixed(k)}, b: ${this.b.toFixed(k)} }`;
	}
	toFixed(k){
		if(k === undefined) k = 3;
		var { b } = this;
		return `${this.a.toFixed(k)} ${b < 0 ? '-' : '+'} ${Math.abs(b).toFixed(k)}j`;
	}
	toString(){
		var { b } = this;
		return `${this.a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}j`;
	}
	toSource(){
		return `Split-Complex { a: ${this.a}, b: ${this.b} }`;
	}
	join(k){
		let { a, b } = this;
		
		a = +a.toFixed(3); b = +b.toFixed(3);
		
		return `${a}${k}${b}`;
	}
	valueOf(){
		return this.toString();
	}
	_calc_polar(){
		var { a, b, constructor: ctn } = this;
		this.r = this.module = ctn.distance(a, b);
		this.t = ctn.angle(a, b);
		return this;
	}
	static isSplitComplex(a){
		return a instanceof this;
	}
	static from(...a){
		if(a.length === 1) a = a[0];
		if(this.isSplitComplex(a))
			return new this(a.a, a.b);
		else if(Array.isArray(a))
			return new this(...a);
		else if(typeof a === 'number' || a instanceof Number)
			return new this(a);
		else if(typeof a === 'object'){
			if('a' in a && 'b' in a)
				return new this(a.a, a.b);
		}
	}
	static asSplitComplex(...c){
		return this.isSplitComplex(c[0]) ? c[0] : this.from(...c);
	}
	static distance(a, b){
		return (a ** 2) - (b ** 2);
	}
	static angle(a, b){
		var t = Math.atan2(b, a);
		return t >= 0 ? t : Math.TAU + t;
	}
	static exp(...d){
		d = this.asSplitComplex(...d);
		//e^z = e^a * e^(jb) = e^a (cosh b + j senh b)
		return new this(Math.cosh(d.b), Math.sinh(d.b)).times(Math.exp(d.a));
	}
	static random(x){
		if(x) return new this(Math.log(1/Math.random() - 1), Math.log(1/Math.random() - 1));
		return new this(Math.random(), Math.random());
	}
	static eq(c1, c2){
		return Math.hypot(c1.a - c2.a, c1.b - c2.b) <= this.EPSILON;
	}
	eq(c){
		return this.constructor.eq(this, c);
	}
	static isScalar(){return this.isSplitComplex(...arguments);}
	static asScalar(){return this.asSplitComplex(...arguments);}
}
D.ONE = new D(1, 0);
D.j = new D(0, 1);
D.LN2 = new D(Math.LN2);
D.LN10 = new D(Math.LN10);
D.EPSILON = 1e-12;
D.ZERO = new D(0, 0);
D.hasPolar = true;

D.LENGTH = 2;
try{module.exports = D;}catch(e){}