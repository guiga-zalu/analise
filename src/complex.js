Math.TAU = 'TAU' in Math ? Math.TAU : 2 * Math.PI;

/**
 * Complexos
 * * i² = -1
 * @class Complex
 */
class Complex{
	/**
	 * Cria um objeto de número Complexo.
	 * @param { number | null } a Valor Real
	 * @param { number | null } b Valor Imaginário
	 * @param { number | null } r Se nem a e nem b, Módulo
	 * @param { number | null } t Se nem a e nem b, Ângulo
	 * @memberof Complex
	 */
	constructor(a = NaN, b = NaN, r = 0, t = null){
		r = r ? +r : 0;
		t = t ? +t : 0;
		if((isNaN(a) && isNaN(b)) || a === false || b === false){
			this.r = r;
			this.t = t;
			this._calc_cart();
		}else{
			this.a = a ? +a : 0;
			this.b = b ? +b : 0;
			this._calc_polar();
		}
	}
	get data(){
		let { a, b } = this;
		return [a, b];
	}
	sum(...d){
		var	ctn = this.constructor,
			c = ctn.asComplex(...d),
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
			c = ctn.asComplex(...d);
		return this.sum(c.negate());
	}
	sub(...c){
		return this.minus(...c);
	}
	times(...d){
		var	ctn = this.constructor,
			c = ctn.asComplex(...d),
			ret = ctn.from(this);
		//console.log(ret.toFixed(2));
		//console.log(c);
		ret.r *= c.r;
		ret.t = (ret.t + c.t) % Math.TAU;
		//console.log(ret.toFixed(2));
		return ret._calc_cart();
	}
	inverse(){
		var	ctn = this.constructor,
			c = new ctn(!1, !1, 1 / this.r, Math.TAU - this.t);
		return c._calc_cart();
	}
	div(...d){
		if(!d.length) return this.inverse();
		var	ctn = this.constructor,
			c = ctn.asComplex(...d);
		return this.times(c.inverse());
	}
	pow(...d){
		var	ctn = this.constructor,
			c = ctn.asComplex(...d),
			{ b } = c,
			ret = ctn.from(this);
		// (r, t)_p^(a + bi)
		ret.r **= c.a;
		ret.t *= c.a;
		ret._calc_cart();
		//console.log('\tz\t%s\n\tc\t%s\n\tret\t%s', this.toFixed(2), c.toFixed(2), ret.toFixed(2));
		if(b === 0){
			// (r, t)_p^a
			return ret;
		}else{
			// (r, t)_p^(a + bi)
			// (r, t)_p^a * (r, t)_p^(bi)
			// (r, t)_p^a = (r^a, t a)_p
			// (r, t)_p^(bi) = e^((it + ln r) bi) = e^(- bt + i b ln r)
			// (e^(- bt), b ln r)_p
			var x = new ctn(
				!1, !1,
				Math.exp(- b * this.t), b * Math.log(this.r)
			);
			ret = ret.times(x);
			//console.log('\tx\t%s\n\tret\t%s', x, ret)
			return ret;
		}
	}
	cosh(){
		//[e^z + e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).sum(ctn.exp(this.negate())).times(0.5);
	}
	cos(){
		//[e^(iz) + e^(-iz)]/2 = cosh(iz)/
		var ctn = this.constructor;
		return this.times(ctn.i).cosh();
	}
	sinh(){
		//[e^z - e^(-z)]/2
		var ctn = this.constructor;
		return ctn.exp(this).minus(ctn.exp(this.negate())).times(0.5);
	}
	sin(){
		//[e^(iz) - e^(-iz)]/2i = sinh(iz)/i
		var ctn = this.constructor, { i } = ctn;
		return this.times(i).sinh().div(i);
	}
	tanh(){
		return this.sinh().div(this.cosh());
	}
	tan(){
		return this.sin().div(this.cos());
	}
	sec(){return this.cos().inverse();}
	sech(){return this.cosh().inverse();}
	csc(){return this.sin().inverse();}
	csch(){return this.sinh().inverse();}
	cot(){return this.tan().inverse();}
	coth(){return this.tanh().inverse();}
	acos(a = false){
		//2c = exp(iz) + exp(-iz) -> 2cy = y² + 1 -> 0 = y² - 2cy + 1
		//y = c +- sq[c² - 1] -> z = ln(c +- sq[c² - 1]) / i
		const ctn = this.constructor, { i } = ctn;
		let delta = this.pow(2).sub(1).sqrt();
		return this.plus(a ? delta.negate() : delta).log().div(i);
	}
	acosh(a = false){
		//2c = exp(z) + exp(-z) -> 2cy = y² + 1 -> 0 = y² - 2cy + 1
		//y = c +- sq[c² - 1] -> z = ln(c +- sq[c² - 1])
		let delta = this.pow(2).sub(1).sqrt();
		return this.plus(a ? delta.negate() : delta).log();
	}
	asin(a = false){
		//2is = exp(iz) - exp(-iz) -> 2isy = y² - 1 -> 0 = y² - 2isy - 1
		//y = s +- sq[1 - s²] -> z = ln(is +- sq[1 - s²]) / i
		const ctn = this.constructor, { i } = ctn;
		let delta = this.pow(2).negate().sum(1).sqrt();
		return this.times(i).plus(a ? delta.negate() : delta).log().div(i);
	}
	asinh(a = false){
		//2s = exp(z) - exp(-z) -> 2sy = y² - 1 -> 0 = y² - 2sy - 1
		//y = s +- sq[s² + 1] -> z = ln(s +- sq[s² + 1])
		let delta = this.pow(2).sum(1).sqrt();
		return this.plus(a ? delta.negate() : delta).log();
	}
	atan(){
		//t = [(y - 1/y)/(2i)]/[(y + 1/y)/2] = (y - 1/y)/(y + 1/y)/i
		//it = (y² - 1)/(y¹ + 1) -> (y² + 1)it = y² - 1
		//y²(it - 1) = - (1 + it) -> y = sq[- (it + 1)/(it - 1)]
		//z = ln(y) / i
		const ctn = this.constructor, { i } = ctn;
		let it = this.times(i);
		return it.plus(1).div(it.sub(1)).negate().log().div(2).div(i);
	}
	atanh(){
		//t = [(y - 1/y)/2]/[(y + 1/y)/2] = (y - 1/y)/(y + 1/y)
		//t = (y² - 1)/(y¹ + 1) -> (y² + 1)t = y² - 1
		//y²(t - 1) = - (1 + t) -> y = sq[- (t + 1)/(t - 1)]
		//z = ln(y)
		return this.plus(1).div(this.sub(1)).negate().log().div(2);
	}
	asec(a){ return this.inverse().acos(a); }
	acsc(a){ return this.inverse().asin(a); }
	acot(){ return this.inverse().atan(); }
	asech(a){ return this.inverse().acosh(a); }
	acsch(a){ return this.inverse().asinh(a); }
	acoth(){ return this.inverse().atanh(); }
	sqrt(){
		return this.pow(.5);
	}
	versor(){
		return new this.constructor(!1, !1, 1, this.t);
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
	log(b){
		return this.constructor.log(this, b);
	}
	toLongFixed(k){
		if(k === undefined) k = 6;
		k |= 0;
		return `Complex { a: ${this.a.toFixed(k)}, b: ${this.b.toFixed(k)}` +
		`, r²: ${(this.r ** 2).toFixed(k)}, t: ${(this.t / Math.PI).toFixed(k)}π }`;
	}
	toFixed(k, p){
		if(k === undefined) k = 3;
		if(p) return `(√${+(this.r ** 2).toFixed(k)}; ${+(this.t / Math.PI).toFixed(k)}π)`;
		var b = +this.b.toFixed(k);
		return `${+this.a.toFixed(k)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}i`;
	}
	toString(p){
		var { b } = this;
		if(p) return `(√${this.r ** 2}; ${this.t / Math.PI}π)`;
		return `${this.a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}i`;
	}
	toSource(){
		return `Complex { a: ${this.a}, b: ${this.b}, r: ${this.r}, t: ${this.t / Math.PI}π }`;
	}
	join(k){
		let { a, b, r, t } = this;
		
		a = +a.toFixed(3); b = +b.toFixed(3);
		r = +(this.r**2).toFixed(3); t = +(this.t/Math.PI).toFixed(3);
		
		if(r > 1e6){a = b = r = 1/0;}
		
		return `${a}${k}${b}${k}${r}${k}${t}π`;
	}
	valueOf(){
		return this.toString();
	}
	_calc_cart(){
		var { r, t } = this;
		this.a = Math.cos(t) * r;
		this.b = Math.sin(t) * r;
		return this;
	}
	_calc_polar(){
		var { a, b, constructor: ctn } = this;
		this.r = ctn.distance(a, b);
		this.t = ctn.angle(a, b);
		return this;
	}
	abs(){ return this.r; }
	sign(){ return this.versor(); }
	static is(a){return this.isComplex(a);}
	static isComplex(a){return a instanceof this;}
	static from(...a){
		if(a.length === 1) a = a[0];
		if(this.isComplex(a))
			return new this(a.a, a.b, a.r, a.t);
		else if(Array.isArray(a))
			return new this(...a);
		else if(typeof a === 'number' || a instanceof Number)
			return new this(a);
		else if(typeof a === 'object'){
			if('a' in a && 'b' in a)
				return new this(a.a, a.b, a.r, a.t);
			else if('r' in a && 't' in a)
				return new this(!1, !1, a.r, a.t);
		}
		return this.ZERO;
	}
	static as(...c){return this.asComplex(...c);}
	static asComplex(...c){return this.isComplex(c[0]) ? c[0] : this.from(...c);}
	static distance(...a){return Math.hypot(...a);}
	static angle(a, b){
		var t = Math.atan2(b, a);
		return t >= 0 ? t : Math.TAU + t;
	}
	static exp(...c){
		c = this.asComplex(...c);
		//e^z = e^a * e^(ib)
		return new this(!1, !1, Math.exp(c.a), c.b);
	}
	static log(c, b){
		c = this.asComplex(c);
		if(!b) return new this(Math.log(c.r), c.t);
		var l = this.log(c);
		if(b === 2) return l.div(this.LN2);
		if(b === 10) return l.div(this.LN10);
		return l.div(this.log(b));
	}
	static random(x){
		if(x) return new this(!1, !1, Math.log(1/Math.random() - 1), Math.random() * Math.TAU);
		return new this(!1, !1, 1, Math.random() * Math.TAU);
	}
	static eq(c1, c2){return Math.hypot(c1.a - c2.a, c1.b - c2.b) <= this.EPSILON;}
	eq(c){return this.constructor.eq(this, c);}
	static isScalar(){return this.isComplex(...arguments);}
	static asScalar(){return this.asComplex(...arguments);}
	static isInt(...c){
		c = this.asComplex(...c);
		return !(c.a % 1 >= this.EPSILON || c.b % 1 >= this.EPSILON);
	}
	static sort(a, b){
		let dif = a.r - b.r;
		return dif ? dif : a.t - b.t;
	}
	static slog(x, b, i = 0){
		x = this.asComplex(x);
		//console.log(x, i);
		if(x.r <= 1) return 0;
		if(i > 20) return i;
		return 1 + this.slog(this.log(x, b), b, i + 1);
	}
}
Complex.ONE = new Complex(1, 0);
Complex.i = new Complex(0, 1);
Complex.LN2 = new Complex(Math.LN2);
Complex.LN10 = new Complex(Math.LN10);
Complex.E = new Complex(Math.E);
Complex.EPSILON = 1e-12;
Complex.ZERO = new Complex(0, 0);
Complex.hasPolar = true;

Complex.LENGTH = 2;
try{module.exports = Complex;}catch(e){}