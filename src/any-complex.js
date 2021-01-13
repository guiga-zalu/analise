class NUM{
	constructor(x){
		this.data = x.map(v => +v || 0);
	}
	map(fn){
		return new this.constructor(this.data.map(fn));
	}
	sum(v){
		var vdata = this.constructor.as(v).data;
		return this.map((s, i) => s + vdata[i]);
	}
	plus(v){return this.sum(v);}
	negate(){
		return this.map(v => -v);
	}
	sub(v){
		v = this.constructor.as(v);
		return this.plus(v.negate());
	}
	minus(v){return this.sub(v);}
	dot(v){
		var vdata = this.constructor.as(v).data;
		return this.data.map((s, i) => s * vdata[i]).reduce((s, a) => s + a);
	}
}

function parseTable(table){
	if(!Array.isArray(table))
		throw new TypeError("table needs to be an array!");
	
	var i, tlen = table.length, llen, el;
	for(var line of table){
		if(!Array.isArray(line))
			throw new TypeError("table's lines need to be arrays!");
		llen = line.length;
		if(tlen !== llen)
			throw new TypeError("table's lines length need to be equal to any lines length");
		for(var i = 0; i < llen; i++){
			el = line[i];
			if(!(el instanceof NUM)){
				if(!Array.isArray(el))
					throw new TypeError("table's lines' elements need to be arrays or NComplex.NUM instances!");
				el = line[i] = n(...el);
			}
		}
	}
	return table;
}
function blank_arr(length, n = -1){
	var ret = Array.from({ length }).fill(0);
	if(n != -1) ret[n] = 1;
	return ret;
}
function NComplex(table){
	table = parseTable(table);
	const L = table.length + 1;
	const CLASS = class NComplex extends NUM{
		constructor(v = []){
			if(v instanceof NUM) v = v.data;
			var l = v.length;
			if(l !== L){
				v.length = L;
				if(l < L) v.fill(0, l, L);
			}
			super(v);
		}
		get length(){return this.constructor.LENGTH;}
		get norm(){
			return Math.sqrt(this.data.reduce((s, a) => s + (a ** 2), 0));
		}
		conjugate(){
			return this.map((s, i) => i ? -s : s);
		}
		versor(){
			var r = this.norm;
			return this.map(s => s / r);
		}
		real(){return this.map((s, i) => i ? 0 : s);}
		vector(){return this.map((s, i) => i ? s : 0);}
		scale(k){return this.map(s => s * k);}
		floor(){return this.map(s => Math.floor(s));}
		round(){return this.map(s => Math.round(s));}
		ceil(){return this.map(s => Math.ceil(s));}
		times(v){
			const { constructor: ctn } = this, { LENGTH: L, TABLE: T } = ctn;
			v = ctn.as(v);
			var	ret = blank_arr(L),
				{ data } = this, vdata = v.data,
				mult, b, i, j;
			
			// do cases (i = 0) && (j = 0)
			ret[0] = data[0] * vdata[0];
			for(b = 1; b < L; b++)
				ret[b] += data[0] * vdata[b] + data[b] * vdata[0];
			
			// do every other case
			for(i = 1; i < L; i++){
				for(j = 1; j < L; j++){
					mult = T[i - 1][j - 1].scale(data[i] * vdata[j]).data;
					for(b = 0; b < L; b++) ret[b] += mult[b];
				}
			}
			return ctn.from(ret);
		}
		module2(){
			return this.times(this.conjugate());
		}
		//inverse(){}
		//div(v){
			//v = this.constructor.as(v);
			//return this.times(v.inverse());
		//}
		//pow(v){
			//const ctn = this.constructor;
			//v = ctn.as(v);
			//return ctn.exp(this.times(ctn.log(v)));
		//}
		//module(){return this.module2().sqrt();}
		/*
		 * map
		 * sum, plus, negate, sub, minus, dot
		 * get length, get norm, versor, module2
		 * conjugate, real, vector, module
		 ? inverse, div
		 ? cos, sin, tan, sec, csc, cot
		 ? cosh, sinh, tanh, sech, csch, coth
		 ? sqrt, module
		 * floor, round, ceil
		 ? log, exp
		 ? toString, toArray, valueOf
		 * static:
		 *  isInt
		 *  as, from, isNComplex, isVector, asNComplex, asVector
		 ? sort
		 */
		static isInt(v){
			return v.data.every(s => s % 1 == 0);
		}
		static from(v){
			if(v instanceof this) return v;
			if(Array.isArray(v)) return new this(v);
			else return new this([ v ]);
		}
		static isNComplex(v){
			return v instanceof NComplex;
		}
		static isVector(v){
			return this.isNComplex(v);
		}
		static asNComplex(v){
			return this.isNComplex(v) ? v : this.from(v);
		}
		static asVector(v){
			return this.asNComplex(v);
		}
		static as(v){return this.asNComplex(v);}
		//static exp(v){}
		//static log(v){}
	};
	CLASS.LENGTH = L;
	CLASS.NUM = NUM;
	CLASS.TABLE = table.map(line => line.map(el => new CLASS(el)));
	CLASS.ZERO = new CLASS();
	CLASS.BASIS = blank_arr(L).map((_, i) => new CLASS(blank_arr(L, i)));
	return CLASS;
}
NComplex.NUM = NUM;

let n = (...x) => new NUM(x);
NComplex.DEF_TABLES = {
	COMPLEX:		[ [n(-1, 0)] ],
	DUAL:			[ [n(0, 0)] ],
	SPLIT_COMPLEX:	[ [n(1, 0)] ],
	QUARTERNION: [
		[n(-1, 0, 0, 0),	n(0, 0, 0, 1),	n(0, 0, -1, 0)],
		[n(0, 0, 0, -1),	n(-1, 0, 0, 0),	n(0, 1, 0, 0)],
		[n(0, 0, 1, 0),		n(0, -1, 0, 0),	n(-1, 0, 0, 0)]
	],
	HYPER: [
		[n(0, 1, 0), n(1, 0, 0)],
		[n(1, 0, 0), n(0, 0, 0)]
	]
};

try{module.exports = NComplex;}catch(e){}