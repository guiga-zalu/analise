class Vetor{
	static _minor(a, b){ return a.length < b.length ? a : b; }
	static _order(a, b){ return a.length < b.length ? [a, b] : [b, a]; }
	constructor(data){
		this.data = Array.isArray(data) ? data : [];
		this.l1 = this.data.length;
	}
	get module(){ return Math.sqrt(this.data.reduce((r, d) => r + (d ** 2), 1)); }
	get module2(){ return this.data.reduce((r, d) => r + (d ** 2), 1); }
	get length(){return this.data.length;}
	scale(k){
		return new this.constructor(this.data.map(d => d * k));
	}
	sum(v){
		if(v instanceof Vetor) v = v.data;
		var [mi, ma] = Vetor._order(this.data, v);
		var n = mi.map((d, i) => d + ma[i]);
		for(var o of ma.slice(mi.length))
			n.push(o);
		return new this.constructor(n);
	}
	sub(v){
		if(v instanceof Vetor) v = v.data;
		var [mi, ma] = Vetor._order(this.data, v);
		var n = mi.map((d, i) => d - ma[i]);
		for(var o of ma.slice(mi.length))
			n.push(- o);
		return new this.constructor(n);
	}
	dot(v){
		if(v instanceof Vetor) v = v.data;
		var [mi, ma] = Vetor._order(this.data, v);
		return mi.reduce((r, d, i) => r + d * ma[i], 1);
	}
	negate(){
		return new this.constructor(this.data.map(d => - d));
	}
	versor(){
		const r = this.module;
		return r && r !== 1 ? this.scale(1 / r) : this;
	}
	sign(){ return this.versor(); }
	exp(){
		return this.scale(Math.sin(this.module) / this.module);
	}
	log(){
		let r1 = this.module, r2 = Math.asin(r1);
		return this.scale((r2 + (r2 > 0 ? 0 : 2 * Math.PI)) / r1);
	}
	self_scale(k){
		this.data = this.data.map(d => d * k);
		return this;
	}
	self_sum(v){
		if(v instanceof Vetor) v = v.data;
		var [mi, ma] = Vetor._order(v, this.data);
		this.data = mi.map((d, i) => d + ma[i]);
		for(var o of ma.slice(mi.length))
			this.data.push(o);
		return this;
	}
	self_sub(v){
		if(v instanceof Vetor) v = v.data;
		var [mi, ma] = Vetor._order(v, this.data);
		this.data = mi.map((d, i) => d - ma[i]);
		for(var o of ma.slice(mi.length))
			this.data.push(- o);
		return this;
	}
	self_negate(){
		this.data = this.data.map((d, i) => - d);
		return this;
	}
	self_versor(){
		const r = this.module;
		return r && r !== 1 ? this.self_scale(1 / r) : this;
	}
	self_exp(){
		return this.self_scale(Math.sin(this.module) / this.module);
	}
	self_log(){
		let r1 = this.module, r2 = Math.asin(r1);
		return this.self_scale((r2 + (r2 > 0 ? 0 : 2 * Math.PI)) / r1);
	}
	self_sign(){ return this.self_versor(); }
	_scale(){ return this.self_scale(...arguments); }
	_sum(){ return this.self_sum(...arguments); }
	_sub(){ return this.self_sub(...arguments); }
	_negate(){ return this.self_negate(...arguments); }
	_versor(){ return this.self_versor(...arguments); }
	_exp(){ return this.self_exp(...arguments); }
	_log(){ return this.self_log(...arguments); }
}
Vetor.ZERO = new Vetor([0]);

/**
 * @class zCanvas
 */
class zCanvas{
	// element = null;
	/**
	 * Creates an instance of zCanvas.
	 * @param { string } queryString Query string to search the DOM fot the Canvas element
	 * @param { object } [props = {}] Generic properties object
	 * @memberof zCanvas
	 */
	constructor(queryString, props = {}){
		this.element = document.querySelector(queryString);
		if(this.element.tagName.toLowerCase() !== "canvas")
			throw new TypeError("The query string shouts to no canvas element!");
		
		if("width" in props && this.width !== props.width)
			this.width = props.width;
		if("height" in props && this.height !== props.height)
			this.height = props.height;
		
		this.context = this.element.getContext("2d");
	}
	get width(){ return this.element.width; }
	get height(){ return this.element.height; }
	set width(x){ this.element.width = x; }
	set height(x){ this.element.height = x; }
	/**
	 * Clears the canvas by drawing an full-sized rectangle
	 *  of a given colour
	 * @param { string | number } color A string or a hex representation of a valid CSS colour
	 * @memberof zCanvas
	 */
	clear(color){
		const { context: ctx } = this;
		ctx.beginPath();
		ctx.fillStyle = typeof color === "number" ? zCanvas.hex2color(color) : color;
		ctx.fillRect(0, 0, this.width, this.height);
	}
	/**
	 * Draws a circle into de canvas
	 *
	 * @param { number[] } [ x, y ] Coordinates array
	 * @param { number } radius Circle radius
	 * @param { string | number } color A string or a hex representation of a valid CSS colour
	 * @memberof zCanvas
	 */
	circle([ x, y ], radius, color){
		const { context: ctx } = this;
		ctx.beginPath();
		ctx.fillStyle = typeof color === "number" ? zCanvas.hex2color(color) : color;
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}
	static hex2color(hex = 0){
		return "#" + `00000000${(hex % 0x100000000).toString(16)}`.slice(- 8);
	}
}
/**
 * A function class to be extended
 *
 * @class ExtensibleFunction
 * @extends {Function}
 */
class ExtensibleFunction extends Function{
	/**
	 * Creates an instance of ExtensibleFunction.
	 * @param { function } f The base function to be called
	 * @memberof ExtensibleFunction
	 */
	constructor(f){
		return Object.setPrototypeOf(f, new.target.prototype);
	}
}
/**
 * 
 * @class ArrayMathFunction
 * @extends {ExtensibleFunction}
 */
class ArrayMathFunction extends ExtensibleFunction{
	// parts = [];
	/**
	 * Creates an instance of ArrayMathFunction.
	 * @param { function } f
	 * @memberof ArrayMathFunction
	 */
	constructor(f){
		super(f);
		/**
		 * @type { function[] }
		 */
		this.parts = [];
	}
	/**
	 * Pushes functions into the process list
	 * * Works as like Array.prototype.push
	 * @param { ...function } parts
	 * @returns { number } The final length of the process list
	 * @memberof ArrayMathFunction
	 */
	add(...parts){
		for(let p of parts)
			typeof p === "function" ? this.parts.push(p) : null;
		
		return this.parts.length;
	}
	/**
	 * An alias for add
	 * * Pushes functions into the process list
	 * * Works as like Array.prototype.push
	 * @param { ...function } parts
	 * @returns { number } The final length of the process list
	 * @memberof ArrayMathFunction
	 */
	push(){ return this.add(...arguments); }
	/**
	 * An alias for calling the function instance
	 *
	 * @returns { any }
	 * @memberof ArrayMathFunction
	 */
	run(){
		return this(...arguments);
	}
	clear(){
		this.parts.length = 0;
		/* for(var i = this.parts.length - 1; i >= 0; i--)
			delete this.parts[i]; */
	}
}
/**
 * A function that sums the results of various functions before giving the results
 *
 * @class FSum
 * @extends {ArrayMathFunction}
 */
class FSum extends ArrayMathFunction{
	// parts = [];
	constructor(...parts){
		let _parts = [];
		super(function(){ return _parts.reduce((r, s) => r + s(...arguments), 0); });
		
		this.parts = _parts;
		this.add(...parts);
	}
}
/**
 * A function that sums the results of various functions before giving the results
 *  (Vetorial sum)
 * @class VSum
 * @extends {ArrayMathFunction}
 */
class VSum extends ArrayMathFunction{
	// parts = [];
	constructor(...parts){
		let _parts = [];
		super(function(){ return _parts.reduce((r, s) => r._sum(s(...arguments)), new Vetor([])); });
		
		this.parts = _parts;
		this.add(...parts);
	}
}
/**
 * A function that multiplies the results of various functions before giving the results
 *
 * @class FSum
 * @extends {ArrayMathFunction}
 */
class FTimes extends ArrayMathFunction{
	// parts = [];
	constructor(...parts){
		let _parts = [];
		super(function(){ return _parts.reduce((r, s) => r * s(...arguments), 1); });
		
		this.parts = _parts;
		this.add(...parts);
	}
}
class Movement{
	// coords = null;
	// particle = null;
	constructor(particle){
		this.particle = particle;
		this.coords = new Vetor(Array.from(particle.coords.data).fill(0));
	}
	sum(c){ this.coords.self_sum(c); }
	apply(){
		this.particle.coords.self_sum(this.coords);
		// this.coords.data.fill(0);
	}
}
/**
 *
 *
 * @class Particle
 */
class Particle{
	// movement = new Movement(this);
	/**
	 * Creates an instance of Particle.
	 * @param { string | number } color A string or a hex representation of a valid CSS colour
	 * @param { number } x The x coordinate
	 * @param { number } y The y coordinate
	 * @param { object } [props = {}] Generic properties object
	 * @memberof Particle
	 */
	constructor(color, x, y, props = {}){
		this.coords = new Vetor([x, y]);
		this.movement = new Movement(this);
		this.color = color;
		this.props = {};
		for(let i in props)
			this.props[i] = props[i];
		
		this.types = [];
	}
	/**
	 * Calculates the euclidian distance between this and another particle
	 *
	 * @param { Particle } p Other particle
	 * @returns { number } The said distance
	 * @memberof Particle
	 */
	distance(p){ return this.constructor.distance(this.coords, p.coords); }
	/**
	 * @param {*} sum
	 * @param {*} field
	 * @returns
	 * @memberof Particle
	 */
	process(sum, field){
		return sum.scale(this.props[field.particleProperty]);
	}
	/**
	 * Says if this particle coordinates lies inside some span
	 *
	 * @param { { x: number[2], y: number[2] } } span The said span
	 * @returns { boolean } If it's in said span or not
	 * @memberof Particle
	 */
	isIn(span){
		var [ x, y ] = this.coords.data;
		return x >= span.x[0] && x <= span.x[1] && y >= span.y[0] && y <= span.y[1];
	}
	/**
	 * Calculates the euclidian distance between two particles
	 *
	 * @param { Vetor | number[] } c1 Particle
	 * @param { Vetor | number[] } c2 Particle
	 * @returns { number } The said distance
	 * @memberof Particle
	 */
	static distance(c1, c2){
		if(c1 instanceof Vetor) return this.distance(c1.data, c2);
		if(c2 instanceof Vetor) return this.distance(c1, c2.data);
		return Math.hypot(...c1.map((c, i) => c - c2[i]));
	}
	/**
	 * Calculates the sign of the difference of two vectors
	 *
	 * @param { Vetor | number[] } c1 Vector
	 * @param { Vetor | number[] } c2 Vector
	 * @returns { Vetor } The said sign
	 * @memberof Particle
	 */
	static sign(p1, p2){
		if(!(p1 instanceof Vetor)) return this.sign(new Vetor(p1), p2);
		if(!(p2 instanceof Vetor)) return this.sign(p1, new Vetor(p2));
		
		return p1.sub(p2).self_sign();
	}
}
class UnMovement extends Movement{
	// coords = null;
	// particle = null;
	// deviations = {};
	constructor(stf){
		super(stf);
		/**
		 * @type { Object<string, number> }
		 */
		this.deviations = {};
	}
	/**
	 * 
	 * @param { * } c 
	 * @param { Field } field The field
	 */
	sum(c, field){
		// console.log(c.data);
		this.deviations[field.name] = c.data[0];
	}
	apply(){
		for(const name in this.deviations){
			this.particle.deviation[name] = this.deviations[name];
			this.deviations[name] = 0;
		}
	}
}
const Constancy = UnMovement;
/**
 * @class SpaceTimeFabric
 * @extends {Particle}
 */
class SpaceTimeFabric extends Particle{
	// movement = new UnMovement(this);
	constructor(x, y, props){
		super("white", x, y, props);
		this.movement = new UnMovement(this);
		this.deviation = {};
	}
	get deviations(){ return Object.values(this.deviation); }
	process(sum, field){
		return sum;
	}
	getCoordsInField(name){
		// this.coords.data[0] = this.coords.data[0];
		if(name === "all"){
			const	{ deviations } = this,
					MAX2 = SpaceTimeFabric.MAX_DEVIATION ** 2,
					r = deviations.reduce((a, b) => (a + b) / (1 + a * b / MAX2), 0);
			
			this.coords.data[1] = r * SpaceTimeFabric.correction;
		}else
			this.coords.data[1] = this.deviation[name];
	}
}
SpaceTimeFabric.correction = 1;
SpaceTimeFabric.MAX_DEVIATION = 100;
/**
 * @class Field
 */
class Field{
	// particles = [];
	// processor = null;
	// sum = new VSum();
	/**
	 * Creates an instance of Field.
	 * @param { !string } name
	 * @param { string } particleProperty
	 * @param { Field.processor } _function
	 * @param { number } [constant = 1]
	 * @memberof Field
	 */
	constructor(name, particleProperty, _function, constant = 1){
		/**
		 * @type { Particle[] }
		 */
		this.particles = [];
		this.name = name;
		this.particleProperty = particleProperty;
		this.processor = _function;
		this.sum = new VSum();
		this.resetField();
		this.constant = constant;
	}
	get length(){ return this.particles.length; }
	set newParticle(x){ x instanceof Particle ? this.particles.push(x) : null; }
	resetField(){ this.sum.clear(); }
	/**
	 * @returns { string } String representation of the field
	 * @memberof Field
	 */
	toString(){
		return `${this.name[0].toUpperCase() + this.name.slice(1)} field` +
			` - ${this.length} particles`;
	}
	/**
	 * Updates the field
	 *
	 * @memberof Field
	 */
	update(){
		this.resetField();
		// log(`Updating Field [${this.name}]`);
		const { particleProperty: pp, sum, constant } = this;
		
		// Get field status from particles
		for(let particle of this.particles){
			// The SpaceTimeFabric has no effects uppon the field
			if(particle instanceof SpaceTimeFabric) continue;
			sum.push(this.processor(particle.coords, particle.props[pp]));
		}
		
		/* for(var i = - 2; i < 3; i++){
			let k = new Vetor([i, 0]);
			console.log(sum.parts[0](k).data, sum(k).data);
		} */
		
		// Put field status / forces onto particles
		for(let particle of this.particles){
			// console.log(sum(particle.coords))
			particle.movement.sum(
				particle.process(sum(particle.coords)._scale(constant), this), this
			);
		}
		
		// this.resetField();
	}
}
/**
 * @callback Field.processor
 * @param { !number[2] } base_coords
 * @param { !number } property
 * @returns { Field.processor2 }
 */
/**
 * @callback Field.processor2
 * @param { !number[2] } final_coords
 * @returns { Vetor } Saída
 */