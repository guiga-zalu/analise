function log(...str){
	if(str.length == 1){
		str = str[0];
		if(typeof str === "number")
			str = +str.toFixed(4);
		log.elements.forEach(el => el.innerHTML += `<br />${str}`);
	}else str.forEach(s => log(s));
}
log.elements = Array.from(document.querySelectorAll(".logger"));

const	allFields = new zCanvas("#all-fields-visualizer"),
		eachField = new zCanvas("#each-field-visualizer");

allFields.width = eachField.width = allFields.element.parentElement.width = innerWidth * .80;
allFields.height = eachField.height = 320;

const World = {
	// get height(){ return window.outerHeight; },
	// get width(){ return window.outerWidth; },
	get height(){ return allFields.height; },
	get width(){ return allFields.width; },
	get ratio(){ return this.height / this.width; },
	get oitar(){ return this.width / this.height; },
	span: {},
	mapToPixel(x, y){
		return [
			this.width * (x - this.span.x[0]) / (this.span.x[1] - this.span.x[0]),
			- this.height * (y + this.span.y[0]) / (this.span.y[1] - this.span.y[0])
		];
	},
	/**
	 * @type { Particle[] }
	 */
	particles: [],
	/**
	 * @type { Field[] }
	 */
	fields: [],
	addParticle(particles){
		for(var particle of particles){
			this.particles.push(particle);
			for(var field of this.fields)
				field.newParticle = particle;
		}
	},
	addField(fields){
		for(var field of fields){
			this.fields.push(field);
			for(var particle of this.particles)
				field.newParticle = particle;
		}
	},
	/**
	 * @type { SpaceTimeFabric[] }
	 */
	spaceTime: [],
	registerCoordinate(st){
		this.spaceTime.push(st);
		for(var field of this.fields)
			field.newParticle = st;
	}
};
// World.span.x = [- 2, 2];
// World.span.y = World.span.x.map(i => i * World.ratio);
World.span.y = [- 2, 2];
World.span.x = World.span.y.map(i => i * World.oitar);

/**
 * Draws a particle
 * @param { Particle } particle
 * @param { Field } field
 * @param { zCanvas } canvas
 */
function drawParticle(particle, field, canvas){
	canvas.circle(
		World.mapToPixel(...particle.coords.data, canvas),
		particle.props.radius || 10,
		particle.color
	);
}
function drawAll(){
	for(var stf of World.spaceTime){
		if(stf.isIn(World.span)){
			stf.getCoordsInField("all");
			drawParticle(stf, "all", allFields);
		}
	}
	for(var particle of World.particles){
		if(particle.isIn(World.span)){
			drawParticle(particle, "all", allFields);
		}
	}
}
function drawField(){}
function draw(){
	allFields.clear(0x00000080);
	eachField.clear("black");
	drawAll();
	drawField();
}
function update(){
	for(var field of World.fields)
		field.update();
	
	for(var particle of World.particles)
		particle.movement.apply();
	
	for(var stf of World.spaceTime)
		stf.movement.apply();
	
	draw();
}

World.addField([
	new Field("eletric", "charge", function eletric(c0, charge){
		return p => Particle.sign(c0, p).self_scale(charge / (1 + Particle.distance(p, c0) ** 2) / 8);
	}) , 
	new Field("repulsive", "charge", function repulsive(c0, charge){
		return p => Particle.sign(c0, p).scale(- charge / (1 + (Particle.distance(c0, p) ** 4)) / 8);
	})
]);

World.addParticle([
	new Particle(0xff0000a0, 1, 0, {
		charge: 1, mass: 1, radius: 10
	}),
	/* new Particle(0x0000ffa0, - 1, 0, {
		charge: - 1, mass: 1, radius: 10
	}), */
	new Particle(0x0000ff80, 3, 0, {
		charge: - 1, mass: 1, radius: 10
	}),
	new Particle(0xff000080, - 1.5, 0, {
		charge: 0.5, mass: 1, radius: 10 * Math.SQRT1_2
	})
]);

for(var i = World.span.x[0], l = World.span.x[1]; i <= l; i += 0.1){
	// console.log(i);
	World.registerCoordinate(new SpaceTimeFabric(i, 0, { charge: 1, mass: 0, radius: 1.5 }))
}

SpaceTimeFabric.correction = 1 / 10;

draw();
setInterval(update, 1e2);