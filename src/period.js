class Period{
	constructor(start = null, end = null){
		this.start = start || 0;
		this.end = end || 0;
	}
	get start(){ return this._start; }
	get end(){ return this._end; }
	set start(x = 0){
		this._start = x instanceof Date ? x : new Date(x);
		this.direction = Math.sign(+this);
	}
	set end(x = 0){
		this._end = x instanceof Date ? x : new Date(x);
		this.direction = Math.sign(+this);
	}
	get span(){ return this.end - this.start; }
	valueOf(){ return this.span; }
	static begin(){ return new this(new Date()); }
	static finish(){ return new this(0, new Date()); }
	begin(){
		this.start = new Date();
		return this;
	}
	finish(){
		this.end = new Date();
		return this;
	}
}
try{module.exports = Period;}catch(e){}