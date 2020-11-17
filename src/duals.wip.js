Math.TAU = 'TAU' in Math ? Math.TAU : 2 * Math.PI;

/**
 * Números Duais
 * * e² = 0
 * @class Dual
 */
class Dual{
	constructor(a, b){
		this.a = a ? +a : 0;
		this.b = b ? +b : 0;
		this._calc_polar();
	}
	get data(){
		let { a, b } = this;
		return [a, b];
	}
	sum(...d){
		var	ctn = this.constructor,
			c = ctn.asDual(...d),
			ret = ctn.from(this);
		ret.a += c.a;
		ret.b += c.b;
		return ret._calc_polar();
	}
	plus(...c){return this.sum(...c);}
	negate(){
		return new this.constructor(-this.a, -this.b);
	}
	conjugate(){
		return new this.constructor(this.a, -this.b);
	}
	minus(...d){
		if(!d.length) return this.negate();
		var	ctn = this.constructor,
			c = ctn.asDual(...d);
		return this.sum(c.negate());
	}
	sub(...c){
		return this.minus(...c);
	}
	times(...d){
		var	ctn = this.constructor,
			ret = ctn.from(this);
		d = ctn.asDual(...d);
		ret.a *= d.a;
		ret.b = ret.a * d.b + ret.b * d.a;
		return ret._calc_polar();
	}
	inverse(){
		const ctn = this.constructor;
		//1 = (x + ye) (a + be)
		if(this.a) return new ctn(1 / this.a, - this.b / (this.a ** 2));
		//1 = (x + ye) (be)
		//1 / b = xe + yee = xe <=> x = 0
		return new ctn(0, 0);
	}
	div(...d){
		if(!d.length) return this.inverse();
		var	ctn = this.constructor;
			d = ctn.asDual(...d);
		if(d.a) return new ctn(this.a / d.a, (this.b * d.a - this.a * d.b) / (d.a ** 2));
		if(d.b && this.a) return new ctn(this.b / d.b, 0);
		return new ctn(1/0, 1/0);
	}
	pow(...d){
		var	ctn = this.constructor;
		d = ctn.asDual(...d);
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
		return this.cosh(this.times(ctn.e));
	}
	sinh(){
		//[e^z - e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).minus(ctn.exp(this.negate())).times(0.5);
	}
	sin(){
		//[e^(iz) - e^(-iz)]/2i = sinh(iz)/i
		var ctn = this.constructor, { e } = ctn;
		return this.sinh(this.times(e)).div(e);
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
		//ln exp (a + be)
		//ln (exp(a) + 1 + be)
		return new this.constructor(Math.log(this.a - 1), this.b);
	}
	_calc_polar(){
		var { a, b, constructor: ctn } = this;
		this.r = ctn.distance(a, b);
		this.t = ctn.angle(a, b);
		return this;
	}
	toFixed(k){
		if(k === undefined) k = 3;
		var b = this.b.toFixed(k);
		return `${this.a.toFixed(k)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}e`;
	}
	join(k){
		let { a, b, r } = this;
		
		a = +a.toFixed(3); b = +b.toFixed(3);
		
		if(r > 1e6){
			a = a.toExponential(0);
			b = b.toExponential(0);
		}
		
		return `${a}${k}${b}${k}${r}`;
	}
	toString(){
		var { b } = this;
		return `${this.a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}e`;
	}
	static isDual(a){
		return a instanceof this;
	}
	static from(...a){
		if(a.length === 1) a = a[0];
		if(this.isDual(a))
			return new this(a.a, a.b);
		else if(Array.isArray(a))
			return new this(...a);
		else if(typeof a === 'number' || a instanceof Number)
			return new this(a);
		else if(typeof a === 'object'){
			if('a' in a && 'b' in a)
				return new this(a.a, a.b);
		}
		return this.ZERO;
	}
	static asDual(...c){
		return this.isDual(c[0]) ? c[0] : this.from(...c);
	}
	static distance(...a){
		return Math.hypot(...a);
	}
	static angle(a, b){
		var t = Math.atan2(b, a);
		return t >= 0 ? t : Math.TAU + t;
	}
	static exp(...c){
		c = this.asDual(...c);
		//e^z = e^a * e^(ib)
		return new this(Math.exp(c.a) + 1, c.b);
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
	static isScalar(){return this.isDual(...arguments);}
	static asScalar(){return this.asDual(...arguments);}
}
Dual.ONE = new Dual(1, 0);
Dual.e = new Dual(0, 1);
Dual.LN2 = new Dual(Math.LN2);
Dual.LN10 = new Dual(Math.LN10);
Dual.EPSILON = 1e-12;
Dual.ZERO = new Dual(0, 0);

Dual.LENGTH = 2;
try{module.exports = Dual;}catch(e){}