//const Complex = require('./../complex');
if(!Complex) Complex = null;
class V3{
	// Imutável
	constructor(x, y, z){
		const V3 = this.constructor;
		this.x = V3.asScalar(x);
		this.y = V3.asScalar(y);
		this.z = V3.asScalar(z);
		this.r = V3.module(this);
	}
	scale(k){
		const V3 = this.constructor;
		if(V3.scalar) return new V3(this.x.times(k), this.y.times(k), this.z.times(k));
		return new V3(this.x * k, this.y * k, this.z * k);
	}
	plus(...v){
		const V3 = this.constructor;
		v = V3.asV3(...v);
		if(V3.scalar) return new V3(this.x.plus(v.x), this.y.plus(v.y), this.z.plus(v.z));
		return new V3(this.x + v.x, this.y + v.y, this.z + v.z);
	}
	sum(...v){return this.plus(...v);}
	negate(){
		const V3 = this.constructor;
		if(this.scalar) return new V3(this.x.negate(), this.y.negate(), this.z.negate());
		return new V3(-this.x, -this.y, -this.z);
	}
	minus(...v){
		const V3 = this.constructor;
		return this.plus(V3.asV3(...v).negate());
	}
	sub(...v){return this.minus(...v);}
	dot(...v){
		const V3 = this.constructor;
		v = V3.asV3(...v);
		if(V3.scalar)
			return v.x.times(this.x).plus(v.y.times(this.y)).plus(v.z.times(this.z));
		return (v.x * this.x) + (v.y * this.y) + (v.z * this.z);
	}
	cross(...v){
		const V3 = this.constructor, { x, y, z } = this;
		v = V3.asV3(...v);
		if(V3.scalar) return new V3(
			y.times(v.z).minus(z.times(v.y)),
			z.times(v.x).minus(x.times(v.z)),
			x.times(v.y).minus(y.times(v.x))
		);
		return new V3(y * v.z - z * v.y, z * v.x - x * v.z, x * v.y - y * v.x);
	}
	times(...v){
		const V3 = this.constructor;
		if(v.length === 1){
			var k = v[0];
			if(typeof k === 'number' || k instanceof V3.scalarBase)
				return this.scale(k);
		}
		return this.cross(...v);
	}
	versor(){
		const V3 = this.constructor, { r } = this;
		if(V3.scalar) return new V3(this.x.div(r), this.y.div(r), this.z.div(r));
		return new V3(this.x / r, this.y / r, this.z / r);
	}
	ceil(){
		const V3 = this.constructor;
		if(V3.scalar) return new V3(this.x.ceil(), this.y.ceil(), this.z.ceil());
		return new V3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
	}
	floor(){
		const V3 = this.constructor;
		if(V3.scalar) return new V3(this.x.floor(), this.y.floor(), this.z.floor());
		return new V3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
	}
	round(){
		const V3 = this.constructor;
		if(V3.scalar) return new V3(this.x.round(), this.y.round(), this.z.round());
		return new V3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	}
	join(k, l){
		var arr = [this.x, this.y, this.z];
		if(this.constructor.scalar)
			arr = arr.map(v => v.join(l));
		return arr.join(k);
	}
	valueOf(){
		return [this.x, this.y, this.z];
	}
	static asScalar(x){
		if(this.scalar) return this.scalarBase.from(x);
		return x;
	}
	static module(v){
		if(this.scalar) return v.x.pow(2).plus(v.y.pow(2)).plus(v.z.pow(2)).sqrt();
		return Math.hypot(v.x, v.y, v.z);
	}
	static isV3(a){
		return a instanceof this;
	}
	static from(...a){
		if(a.length === 1) a = a[0];
		if(this.isV3(a)){
			return new this(a.x, a.y, a.z);
		}else if(Array.isArray(a)){
			return new this(...a);
		}else if(typeof a === 'number' || a instanceof Number){
			return new this(a, 0, 0);
		}else if('x' in a && 'y' in a && 'z' in a){
			return new this(a.x, a.y, a.z);
		}else return this.Zero;
	}
	static asV3(...v){
		return this.isV3(v[0]) ? v[0] : this.from(...v);
	}
	static angle(a, b){
		var dot = a.dot(b);
		if(this.scalar) return dot.div(a.r.times(b.r)).acos();
		return Math.acos(dot / (a.r * b.r));
	}
	static random(){
		if(this.scalar){
			var base = this.scalarBase;
			return new this(base.random(), base.random(), base.random());
		}
		return new this(Math.random(), Math.random(), Math.random());
	}
	static eq(c1, c2){
		if(this.scalar) return c1.x.eq(c2.x) && c1.y.eq(c2.y) && c1.z.eq(c2.z);
		return Math.hypot(c1.x - c2.x, c1.y - c2.y, c1.z - c2.z) <= this.EPSILON;
	}
	eq(c){
		return this.constructor.eq(this, c);
	}
}
if(Complex){
	V3.scalarBase = Complex;
	V3.scalar = true;
}else V3.scalar = false;

V3.EPSILON = 1e-12;
V3.Zero = new V3(0, 0, 0);
V3.i = new V3(1, 0, 0);
V3.j = new V3(0, 1, 0);
V3.k = new V3(0, 0, 1);

try{module.exports = V3;}catch(e){}