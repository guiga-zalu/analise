/**
 * * Extrai o parâmetros GET na url e chama a função de retorno com esse mapa
 * ! O mapa é similar ao de requisições de procura, com um array por valor
 * @param {callback function} cb
 */
async function parseGET(cb){
	var	data = {},
		url = new URL(window.location.href),
		plain = url.search;
	
	if(plain){
		var arr = plain.slice(1).split('&')
			.map(v => v.split('='));
		
		for(let [k, ...v] of arr){
			if(data[k]) data[k].concat(...v);
			else data[k] = v;
		}
		for(let l in data){
			if(data[l].length === 1) data[l] = data[l][0];
		}
	}
	if(cb) cb(data);
	else return new Promise(res => res(data));
}