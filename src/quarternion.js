Math.TAU = 'TAU' in Math ? Math.TAU : 2 * Math.PI;
class H{
	constructor(a, b, c, d){
		this.a = a ? +a : 0;
		this.b = b ? +b : 0;
		this.c = c ? +c : 0;
		this.d = d ? +d : 0;
		this.module = this.constructor.distance(this.a, this.b, this.c, this.d);
	}
	get data(){
		let { a, b, c, d } = this;
		return [a, b, c, d];
	}
	sum(...c){
		var	ctn = this.constructor,
			h = ctn.asH(...c),
			ret = ctn.from(this);
		ret.a += h.a;
		ret.b += h.b;
		ret.c += h.c;
		ret.d += h.d;
		return ret;
	}
	plus(...h){return this.sum(...h);}
	negate(){
		return new this.constructor(-this.a, -this.b, -this.c, -this.d);
	}
	conjugate(){
		return new this.constructor(this.a, -this.b, -this.c, -this.d);
	}
	minus(...c){
		if(!c.length) return this.negate();
		var	ctn = this.constructor,
			h = ctn.asH(...c);
		return this.sum(h.negate());
	}
	sub(...h){
		return this.minus(...h);
	}
	scale(k){
		let { a, b, c, d, constructor: ctn } = this;
		return new ctn(a * k, b * k, c * k, d * k);
	}
	times(...h){
		var	ctn = this.constructor,
			{ a: ha, b: hb, c: hc, d: hd } = ctn.asH(...h),
			{ a, b, c, d } = this;
		
		return new ctn(
			a * ha - b * hb - c * hc - d * hd,
			a * hb + b * ha + c * hd - d * hc,
			a * hc - b * hd + c * ha + d * hb,
			a * hd + b * hc - c * hb + d * ha
		);
	}
	inverse(){
		return this.conjugate().scale(1 / this.module ** 2);
	}
	div(...d){
		if(!d.length) return this.inverse();
		var	ctn = this.constructor,
		h = ctn.asH(...d);
		return this.times(h.inverse());
	}
	pow(...h){
		var	ctn = this.constructor;
		h = ctn.asH(...h);
		return ctn.exp(h.times(this.log()));
	}
	sqrt(){
		return this.pow(1/2);
	}
	versor(){
		return this.scale(1 / this.module);
	}
	ceil(){
		return new this.constructor(
			Math.ceil(this.a), Math.ceil(this.b), Math.ceil(this.c), Math.ceil(this.d));
	}
	floor(){
		return new this.constructor(
			Math.floor(this.a), Math.floor(this.b), Math.floor(this.c), Math.floor(this.d));
	}
	round(){
		return new this.constructor(
			Math.round(this.a), Math.round(this.b), Math.round(this.c), Math.round(this.d));
	}
	log(){
		return this.constructor.log(this);
	}
	toFixed(k){
		if(k === undefined) k = 3;
		var a = this.a.toFixed(k),
			b = this.b.toFixed(k),
			c = this.c.toFixed(k),
			d = this.d.toFixed(k),
			ret = [];
		if(+a) ret.push(a);
		if(+b) ret.push((b < 0 ? '-' : '+') + ` ${Math.abs(b)}i`);
		if(+c) ret.push((c < 0 ? '-' : '+') + ` ${Math.abs(c)}j`);
		if(+d) ret.push((d < 0 ? '-' : '+') + ` ${Math.abs(d)}k`);
		return ret.length ? ret.join(' ') : '0';
	}
	get r(){
		return this.module;
	}
	get vectorModule(){
		return this.constructor.distance(this.b, this.c, this.d);
	}
	get vr(){
		return this.vectorModule;
	}
	vector(){
		var ret = this.constructor.from(this);
		ret.a = 0;
		return ret;
	}
	static isQuarternion(a){
		return a instanceof this;
	}
	static from(...a){
		if(a.length === 1) a = a[0];
		if(this.isQuarternion(a))
			return new this(a.a, a.b, a.c, a.d);
		else if(Array.isArray(a))
			return new this(...a);
		else if(typeof a === 'number' || a instanceof Number)
			return new this(a, 0, 0, 0);
		else if(typeof a === 'object'){
			if('a' in a && 'b' in a && 'c' in a && 'd' in a)
				return new this(a.a, a.b, a.c, a.d);
		}
		return this.ZERO;
	}
	static asH(...h){
		return this.asQuarternion(...h);
	}
	static asQuarternion(...h){
		return this.isQuarternion(h[0]) ? h[0] : this.from(...h);
	}
	static distance(...a){
		return Math.hypot(...a);
	}
	static exp(...h){
		h = this.asH(...h);
		var	m = h.vectorModule,
			cos = Math.cos(m), sen = Math.sin(m),
			versor = h.vector().versor();
		return versor.times(sen).plus(cos).times(Math.exp(h.a));
	}
	static log(...h){
		h = this.asH(...h);
		var	r = h.r;
		return h.vector().times(Math.acos(h.a / r) / h.vectorModule).plus(Math.log(r));
	}
	static random(){
		return (new this(Math.random(), Math.random(), Math.random(), Math.random())).versor();
	}
	static eq(h1, h2){
		return Math.hypot(h1.a - h2.a, h1.b - h2.b, h1.c - h2.c, h1.d - h2.d) <= this.EPSILON;
	}
	eq(h){
		return this.constructor.eq(this, h);
	}
	static isScalar(){return this.isQuarternion(...arguments);}
	static asScalar(){return this.asQuarternion(...arguments);}
}
H.ONE = new H(1, 0, 0, 0);
H.i = new H(0, 1, 0, 0);
H.j = new H(0, 0, 1, 0);
H.k = new H(0, 0, 0, 1);
H.LN2 = new H(Math.LN2);
H.LN10 = new H(Math.LN10);
H.EPSILON = 1e-12;
H.ZERO = new H(0, 0, 0, 0);

H.LENGTH = 4;
try{module.exports = H;}catch(e){}