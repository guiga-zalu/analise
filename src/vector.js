const RAND = {
	valueOf(){return this.rand(true);},
	rand(x){
		// [0; 1[
		if(x) return 2*Math.random() - 1;
		// [-inf; inf[
		// s(x) = - 1 / (1 + exp(-x))
		// x(s) = ln(1/s - 1)
		return Math.log(1/Math.random() - 1);
	}
};

class Vetor{
	/**
	 * Cria uma instância da classe Vetor.
	 * @param { Number[] | Scalar[] } arr
	 * @memberof Vetor
	 */
	constructor(arr){
		const V = this.constructor;
		this.data = Array.from(arr).map(d => V.asScalar(d));
	}
	get module(){
		if(this.constructor.scalar) return this.data.reduce((r, d) => r.plus(d.times(d))).sqrt();
		return Math.hypot(...this.data);
	}
	get r(){
		return this.module;
	}
	get length(){return this.data.length;}
	scale(k){
		const V = this.constructor;
		if(V.scalar) return new V(this.data.map(d => d.times(k)));
		return new V(this.data.map(d => d * k));
	}
	div(k){
		const V = this.constructor;
		return V.scalar ? this.scale(k.inverse()) : this.scale(1 / k);
	}
	sum({ data }){
		const V = this.constructor;
		if(V.scalar) return new V(this.data.map((d, i) => d.plus(data[i])));
		return new V(this.data.map((d, i) => d + data[i]));
	}
	plus(v){return this.sum(v);}
	negate(){
		const { data, constructor: V } = this;
		if(V.scalar) return new V(data.map(d => d.negate()));
		return new V(data.map(v => -v));
	}
	sub(v){
		return this.sum(v.negate());
	}
	minus(v){return this.sub(v);}
	dot({ data }){
		const V = this.constructor;
		if(V.scalar) return this.data.reduce(
			(ret, d, i) => ret.plus(d.times(data[i])), V.scalarBase.ZERO
		);
		return this.data.reduce((ret, d, i) => ret + d * data[i], 0);
	}
	versor(){
		const V = this.constructor, { r } = this;
		if(V.scalar) return r.eq(V.scalarBase.ZERO) ? this : this.scale(r.inverse());
		return r ? this.scale(1 / r) : this;
	}
	ceil(){
		const V = this.constructor;
		if(V.scalar) return new V(this.data.map(d => d.ceil()));
		return new V(this.data.map(Math.ceil));
	}
	floor(){
		const V = this.constructor;
		if(V.scalar) return new V(this.data.map(d => d.floor()));
		return new this.constructor(this.data.map(Math.floor));
	}
	round(){
		const V = this.constructor;
		if(V.scalar) return new V(this.data.map(d => d.round()));
		return new this.constructor(this.data.map(Math.round));
	}
	vetorCos(B){
		//v*(i, j, ...) / |v| = (v*i, v*j, ...) / |v|
		//= (cos(v, i), cos(v, j), ...)
		//= (v_i, v_j, ...) / |v| = v / |v|
		if(!B) return this.versor();
		const V = this.constructor;
		return new V( B.map(e => e.dot(this)) ).div(this.module);
	}
	eq(b, e){return Vetor.eq(this, b, e);}
	angle(b){return Vetor.angle(this, b);}
	parallel(b){return Vetor.parallel(this, b);}
	toString(str = ','){return this.data.map(n2s).join(str + ' ');}
	static eq(a, b, e = 0){
		var { data } = b;
		if(this.scalar)
			return a.data.every((d, i) => d.eq(data[i]));
		return a.data.every((d, i) => Math.abs(d - data[i]) <= e);
	}
	static angle(a, b){
		if(this.scalar)
			return this.scalarBase.acos(a.dot(b).div(a.module.times(b.module)));
		return Math.acos(a.dot(b) / (a.module * b.module));
	}
	static parallel(a, b){
		let t = Vetor.angle(a, b);
		if(this.scalar) return t.eq(this.scalarBase.ZERO);
		return t === 0 || t === Math.PI;
	}
	static asScalar(x){
		if(this.scalar) return this.scalarBase.from(x);
		return x;
	}
	static isVector(a){
		return a instanceof this;
	}
	static from(a){
		if(this.isVector(a)){
			return new this(a.data);
		}else if(Array.isArray(a)){
			return new this(a);
		}else if(typeof a === 'number' || a instanceof Number){
			return new this([a]);
		}else return this.ZERO;
	}
	static random(x){
		if(this.scalar){
			var base = this.scalarBase;
			return new this( Array.from({ length: LENGTH }).map(_ => base.random(x)) );
		}
		return new this( Array.from({ length: LENGTH }).map(_ => RAND.rand(x)) );
	}
}
function n2s(x){return x.toFixed(2).replace(/\./g, ',');}

class V2 extends Vetor{
	get x(){return this.data[0];}
	set x(q){this.data[0] = this.constructor.asScalar(q);}
	get y(){return this.data[1];}
	set y(q){this.data[1] = this.constructor.asScalar(q);}
	times(v){
		if(this.constructor.scalar) return this.x.times(v.y).sub(this.y.times(v.x));
		return this.x * v.y - this.y * v.x;
	}
	static random(x){
		if(this.scalar){
			var base = this.scalarBase;
			return new this([base.random(x), base.random(x)]);
		}
		return x ?
			new this([RAND.rand(), RAND.rand()]) :
			new this([+RAND, +RAND]);
	}
}

class V3 extends Vetor{
	get x(){return this.data[0];}
	set x(q){this.data[0] = q;}
	get y(){return this.data[1];}
	set y(q){this.data[1] = q;}
	get z(){return this.data[2];}
	set z(q){this.data[2] = q;}
	times(v){
		var { x, y, z } = this;
		if(V3.scalar) return new V3([
			y.times(v.z).minus(z.times(v.y)),
			z.times(v.x).minus(x.times(v.z)),
			x.times(v.y).minus(y.times(v.x))
		]);
		return new V3([
			y * v.z - z * v.y,
			z * v.x - x * v.z,
			x * v.y - y * v.x
		]);
	}
	static random(x){
		if(this.scalar){
			var base = this.scalarBase;
			return new this([base.random(), base.random(), base.random()]);
		}
		return x ?
			new this([RAND.rand(), RAND.rand(), RAND.rand()]) :
			new this([+RAND, +RAND, +RAND]);
	}
	vetorSin(B){
		//|v x (i, j, k)| / |v| = (|v x i|, |v x j|, |v x k|) / |v|
		//= (sin(v, i), sin(v, j), sin(v, k))
		//= (|(0, v_k, - v_j)|, |(- v_k, 0, v_i)|, |(v_j, - v_i, 0)|) / |v|
		//= (|(0, v_k, v_j)|, |(v_k, 0, v_i)|, |(v_j, v_i, 0)|) / |v|
		//= (|(v_k, v_j)|, |(v_k, v_i)|, |(v_j, v_i)|) / |v|
		//= (|(v_j, v_k)|, |(v_i, v_k)|, |(v_i, v_j)|) / |v|
		
		const V = this.constructor, { r } = this;
		if(B) return new V( B.map(e => this.times(e).module) ).div(r);
		var { x, y, z } = this, x2 = x.times(x), y2 = y.times(y), z2 = z.times(z);
		if(V.scalar){
			return new V([
				y2.plus(z2).sqrt(),
				x2.plus(z2).sqrt(),
				x2.plus(y2).sqrt()
			]).div(r);
		}
		return new V([
			Math.hypot(y, z),
			Math.hypot(x, z),
			Math.hypot(x, y)
		]).div(r);
	}
}

class V4 extends Vetor{
	get x(){return this.data[0];}
	set x(q){this.data[0] = q;}
	get y(){return this.data[1];}
	set y(q){this.data[1] = q;}
	get z(){return this.data[2];}
	set z(q){this.data[2] = q;}
	get w(){return this.data[3];}
	set w(q){this.data[3] = q;}
	times(v){
		var { x, y, z, w } = this, { x: vx, y: vy, z: vz, w: vw} = v;
		if(V4.scalar){
			const [A, B, C, D, E, F] = [
				z.times(vw).sub(w.times(vz)),
				y.times(vw).sub(w.times(vy)),
				y.times(vz).sub(z.times(vy)),
				x.times(vw).sub(w.times(vx)),
				x.times(vz).sub(z.times(vx)),
				x.times(vy).sub(y.times(vx))
			];
			let ret = new V4([
				A.plus(C).sub(B), D.sub(A).sub(E),
				B.plus(F).sub(D), E.sub(C).sub(F)
			]), { r } = this;
			return r ? ret.div(r) : ret;
		}
		const [A, B, C, D, E, F] = [
			z * vw - w * vz,
			y * vw - w * vy,
			y * vz - z * vy,
			x * vw - w * vx,
			x * vz - z * vx,
			x * vy - y * vx
		];
		var ret = new V4([
			A - B + C, - A + D - E,
			B - D + F, - C + E - F
		]), { r } = this;
		return r ? ret.div(r) : ret;
	}
	static random(x){
		if(this.scalar){
			var base = this.scalarBase;
			return new this([base.random(x), base.random(x), base.random(x), base.random(x)]);
		}
		return x ?
			new this([RAND.rand(), RAND.rand(), RAND.rand(), RAND.rand()]) :
			new this([+RAND, +RAND, +RAND, +RAND]);
	}
}

class Regiao{
	/**
	 * * Cria uma instância da classe Regiao.
	 * @param { Vetor } p Ponto inicial
	 * @param { Vetor[] } vs Vetores correspondentes as direções
	 * @memberof Regiao
	 */
	constructor(p, vs){
		this.p = p;
		this.data = vs.map(v => v.versor());
		this.isAlwaysLD = vs.length >= LENGTH;
	}
	/**
	 * @returns { Vetor } Vetor aleatório pertencente a região
	 * @memberof Regiao
	 */
	random(){
		return this.data.reduce((r, b) => r.plus(b.times(+RAND)), Vetor.ZERO);
	}
	/**
	 * * Verifica se um vetor pertence a uma região
	 * ! Carece de meios para confirmar se um vetor pertence à uma região
	 * @param { Vetor } v
	 * @returns { Boolean } Se o vetor pertence a região
	 * @memberof Regiao
	 */
	includes(v){
		if(this.isAlwaysLD) return true;
	/*
	 p + [a, b, ..]*[K, L, ..] = v
	 <=> aK + bL + .. = v - p
	 <=> aK + bL + .. + p - v = 0
	 <=> {a; b, ..; v - p} é LD */
	/*
	] q = v - p
	
	a K + b L + .. = q
	a_i K + b_i L + .. = q_i
	
	K, L, .. são as incógnitas
	
	A = [(a_1, b_1, ..), .., (a_m, b_m, ..)]
	X = [K, L, ..]
	#(A x X) = # q
	(m, n) #x (n, 1) = m
	
	Escalonar:
	Amp = [(a_1, b_1, .., q_1), .., (a_m, b_m, .., q_m)]
	#Amp = (m, n + 1)
	*/
		var { data } = this, q = v.minus(this.p), { data: qdata } = q,
			Amp = Array.from({ length: LENGTH }).map((_, i) => {
				var r = data.map(d => d.data[i]);
				r.push(qdata[i]);
				return r;
			});
		
		
	}
}
class R1 extends Regiao{
	constructor(p, a){
		super(p, [a]);
		this.a = a;
	}
	includes(v){
		/* p + aK = v => aK = v - p => v - p || aK */
		return this.a.parallel(v.minus(this.p));
		//return this.data.every(d => d.parallel(v));
	}
}
class R2 extends Regiao{
	constructor(p, a, b){
		super(p, [a, b]);
		this.a = a;
		this.b = b;
	}
}

Vetor.scalarBase = Scalar;
Vetor.scalar = !!Vetor.scalarBase;

V2.scalar = V3.scalar = V4.scalar = Vetor.scalar;
V2.scalarBase = V3.scalarBase = V4.scalarBase = Vetor.scalarBase;

Vetor.LENGTH = LENGTH * (Vetor.scalar ? Vetor.scalarBase.LENGTH : 1);

V2.LENGTH = 2 * (V2.scalar ? V2.scalarBase.LENGTH : 1);
V3.LENGTH = 3 * (V3.scalar ? V3.scalarBase.LENGTH : 1);
V4.LENGTH = 4 * (V4.scalar ? V4.scalarBase.LENGTH : 1);

Vetor.ONE = new Vetor(
	Array.from({ length: LENGTH }).fill(Vetor.scalar ? Vetor.scalarBase.ONE : 1)
);
Vetor.ZERO = Vetor.ONE.scale(0);

V2.ONE = new V2( [0,0].fill(V2.scalar ? V2.scalarBase.ONE : 1) );
V3.ONE = new V3( [0,0,0].fill(V3.scalar ? V3.scalarBase.ONE : 1) );
V4.ONE = new V4( [0,0,0,0].fill(V4.scalar ? V4.scalarBase.ONE : 1) );
V2.ZERO = V2.ONE.scale(0);
V3.ZERO = V3.ONE.scale(0);
V4.ZERO = V4.ONE.scale(0);

Vetor.ONES = Vetor.scalar ? new Vetor(
	Array.from({ length: LENGTH }).fill(Vetor.scalarBase.from(
		Array.from({ length: Vetor.scalarBase.LENGTH }).fill(1)
	))
) : Vetor.ONE;

V2.ONES = V2.scalar ? new V2( [0,0].fill(V2.scalarBase.from(
	Array.from({ length: Vetor.scalarBase.LENGTH }).fill(1)
)) ) : V2.ONE;
V3.ONES = V3.scalar ? new V3( [0,0,0].fill(V3.scalarBase.from(
	Array.from({ length: Vetor.scalarBase.LENGTH }).fill(1)
)) ) : V3.ONE;
V4.ONES = V4.scalar ? new V4( [0,0,0,0].fill(V4.scalarBase.from(
	Array.from({ length: Vetor.scalarBase.LENGTH }).fill(1)
)) ) : V4.ONE;