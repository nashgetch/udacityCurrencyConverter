function registerServiceWorker() {
        
    navigator.serviceWorker.register('sw.js').then(function(reg) {
		if (!navigator.serviceWorker.controller) {
			return;
		  }
		if(reg.waiting){
			reg.postMessage('message', {action: 'skipWaiting'});
			return;
		}
        if(reg.installing){
			_trackInstalling(reg.installing);
		}
		reg.addEventListener('updatefound', function (){
			_trackInstalling(reg.installing);
		});
	});
}

function _trackInstalling(worker) {
	worker.addEventListener('statechange', function(){
		if(worker.state == 'installed'){
			$(".notify").fadeOut();
  	console.log('Updated Service Worker Found! Yay');
		}
	});
}

const currency = (e) => {
	fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(function(response){
		return response.json();
		
	}).then(function(data){
		var pairs = makeArray(data.results);
		for(let aa of pairs){
			$("#from").append(`
				<option value="${aa.id}">${aa.id} (${aa.currencyName})</option>
			`);
			$("#to").append(`
				<option value="${aa.id}">${aa.id} (${aa.currencyName})</option>
			`);
		}
	});
}
function convert(){
	
	let to 		= $("#to").val();

	let from 	= $("#from").val();
	
	let amount	= $("#amount").val();

	let overall  = `${from}_${to}`;
	let query = {
		q: overall
	};
	const url = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + overall; 
	fetch(url).then(function(response){
		return response.json();
	}).then(function(data){
		const pairs = makeArray(data.results);
		$.each(pairs, function(index, val) {
			$(".results").append(`
				<div class="row">
				<div class="col-md-3></div>
				<div class="col-md-6">
                   
					<i>${amount}</i> <i>${val.fr}</i> is approximately equal to 
					<i>${numeral(amount * val.val).format('0.000')}</i>
					<i>${val.to}</i> 
					
				</div>
				</div>
			`);
		});
	});
	return false;
}
function makeArray(objects) {
	const results = Object.keys(objects).map(i => objects[i]);
	return results;
}
$(document).ready(function (){
	currency();
});