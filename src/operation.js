const Complex = require('./complex');

function crivo(n = 1e2, Scalar = null){

}
crivo.Complex = function crivo_Complex(n = 1e2){
	const	ret = new Dataset([], Complex),
		{ data } = ret,
		stepper = crivo.Complex.stepper(false),
		div = crivo.Complex.divisivel,
		divisivel = q => p => div(q, p);
	
	stepper.next();
	ret.add = stepper.next().value;
	var q;
	do{
		q = stepper.next().value;
		// if any 'p' from 'data' divides 'q' continues
		if(data.some(divisivel(q))) continue;
		ret.add = q;
	}while(ret.length <= n);
	return ret;
};
crivo.Complex.stepper = function* crivo_Complex_stepper(zero){
	var last = Complex.ZERO, totalStepsInDir = 0;
	if(zero) yield last;
	do{
		totalStepsInDir++;
		//* Direita
		for(let i = 0; i < totalStepsInDir; i++)
			yield (last = last.sum(1, 0));
		//* Cima
		for(let i = 0; i < totalStepsInDir; i++)
			yield (last = last.sum(0, 1));
		
		totalStepsInDir++;
		//* Esquerda
		for(let i = 0; i < totalStepsInDir; i++)
			yield (last = last.sum(-1, 0));
		//* Baixo
		for(let i = 0; i < totalStepsInDir; i++)
			yield (last = last.sum(0, -1));
	}while(true);
};
crivo.Complex.divisivel = function crivo_Complex_divisivel(a, b){
	return Complex.isInt( a.div(b) );
};

class Fraction{
	constructor(a, b){
		this.a = Fraction.asScalar(a);
		this.b = Fraction.asScalar(b);
	}
	sum(f){
		var { constructor: ctn, a, b } = this,
			{ a: fa, b: fb } = ctn.asFraction(f);
		if(ctn.hasScalar)
			return new ctn(a.times(fb).plus(fa.times(b)), b.times(fb));
		return new ctn(a * fb + fa * b, b * fb);
	}
	sub(f){
		var { constructor: ctn, a, b } = this,
			{ a: fa, b: fb } = ctn.asFraction(f);
		if(ctn.hasScalar)
			return new ctn(a.times(fb).sub(fa.times(b)), b.times(fb));
		return new ctn(a * fb - fa * b, b * fb);
	}
	times(f){
		var { constructor: ctn, a, b } = this,
			{ a: fa, b: fb } = ctn.asFraction(f);
		if(ctn.hasScalar)
			return new ctn(a.times(fa), b.times(fb));
		return new ctn(a * fa, b * fb);
	}
	invert(){
		var { constructor: ctn, a, b } = this;
		return new ctn(b, a);
	}
	div(f){
		var { constructor: ctn, a, b } = this,
			{ a: fa, b: fb } = ctn.asFraction(f);
		if(ctn.hasScalar)
			return new ctn(a.times(fb), b.times(fa));
		return new ctn(a * fb, b * fa);
	}
	toNumber(){
		var { a, b } = this;
		if(this.constructor.hasScalar)
			return a.div(b);
		return a / b;
	}
	simplify(){}
	/**
	 * Recieves a Scalar k and return a fraction
	 * Uses Farey algorithm
	 * @static
	 * @param { Scalar } k Scalar to be processed
	 * @param { Number } max Max number of processes
	 * @memberof Fraction
	 */
	static fractionify(k, max){
		max = max || Fraction.maxAttempts;
		if(this.hasScalar){
			
		}
		var [sign, abs] = [Math.sign, Math.abs].map(f => f(k)),
			int = Math.floor(abs), float = abs - int,
			a, b, c, delta = 1;
		
		a = new Fraction(0, 1); b = new Fraction(1, 0);
		
		for(var i = 0; i < max && delta; i++){
			c = ops.esum(a, b);
			var _c = +c;
			if(float > _c) a = c;
			else b = c;
			delta = float - _c;
		}
		return new this(sign * (a.a + int * a.b), a.b);
	}
	static isFraction(f){
		return f instanceof this;
	}
	static asFraction(f){
		return this.isFraction(f) ? f : new this(f);
	}
	static set Scalar(S){
		if(typeof S === 'function') this._Scalar = S;
		else this._Scalar = null;
		this.hasScalar = !!S;
	}
	static get Scalar(){
		return this._Scalar;
	}
	static asScalar(k){
		if(this.hasScalar) return this.Scalar.asScalar(k);
		return +k;
	}
}
Fraction.maxAttempts = 1e2;
Fraction.Scalar = null;

class Dataset{
	constructor(input = [], type = null){
		this._data = [];
		this._type = type;
		this._typeisfn = typeof type === 'function';
		
		if(Array.isArray(input)) this._data = this._filter(input);
		else if(Dataset.isDataset(input)) this._data = this._filter(input._data.slice());
	}
	forEach(...args){
		this._data.forEach(...args);
		return this;
	}
	map(...args){
		this._data = this._data.map(...args);
		return this;
	}
	maped(...args){
		var ret = new Dataset(this, this._type);
		return ret.map(...args);
	}
	filter(...args){
		this._data = this._data.filter(...args);
		return this;
	}
	filtered(...args){return new Dataset(this.data.filter(...args), this._type);}
	get data(){return this._data;}
	get length(){return this._data.length;}
	get add(){
		var that = this;
		return function add(...args){
			that._data.push(...that._filter(args));
			return that;
		};
	}
	set add(x){this._data.push(...this._filter([x]));}
	_filter(args = []){
		var type = this._type;
		if(!type) return args;
		if(this._typeisfn) return args.filter(
			a => a instanceof type || (typeof type.is === 'function' ? type.is(a) : false)
		);
		return args.filter(a => typeof a === type);
	}
	sort(fn){
		if(!fn){
			var type = this._type;
			if(this._typeisfn && typeof type.sort === 'function') fn = type.sort;
			else if(type === 'number') fn = (a, b) => a - b;
		}
		this._data = this._data.sort(fn);
		return this;
	}
	static is(x){return this.isDataset(x);}
	static isDataset(x){return x instanceof this;}
	static eq(x, y){return this.is(x) && this.is(y) ? x.data === y.data : false;}
}
class Average{}

const ops = {
	angle(a, b){
		var arit = (a + b) / 2,
			min = Math.min(a, b),
			sen = (1 - min / arit) * (2 * (a > b) - 1);
		return Math.asin(sen);
	},
	osum(a, b){
		return 1 / ((1 / a) + (1 / b));
	},
	/**
	 * Farey Fraction addition
	 *
	 * @param { Fraction | any } f
	 * @param { Fraction | any } g
	 * @returns
	 */
	esum(f, g){
		f = Fraction.asFraction(f);
		g = Fraction.asFraction(g);
		if(Fraction.hasScalar)
			return new Fraction(f.a.plus(g.a), f.b.plus(g.b));
		return new Fraction(f.a + g.a, f.b + g.b);
	}
};

const operations = { crivo, Dataset, Fraction, Average, ops };

module.exports = operations;