// Normal Increase Payout + Display Profit Version. Still at V1
var baseBet = 1;
var basePayout = 1.69;
var profit = 0;
var winToReset = 2; // Number win - 1
var winStack = 0;
var lossStack = 0;

var startingBalance = engine.getBalance(); // in satoshi

console.log('================== m0viCz in  CoinsCrash ==================');
console.log('My username is: ' + engine.getUsername());
console.log('Starting balance: ' + (startingBalance/100).toFixed(2) + ' bits');

var playing = false;
 
engine.on('game_starting', function(info) {
	console.log('Total Profit = ' + profit.toFixed(2) + ' bits');
  engine.placeBet(Math.floor(baseBet)*100, Math.round(basePayout * 100));
  console.log('Bet ' + baseBet + ' Cashout at ' + basePayout + 'x');
  playing = true;
});	

 
engine.on('game_crash', function(data) {
  if(!playing) {
    return;
  } 
	playing = false;
 
  if(engine.lastGamePlay() == 'LOST') {
		console.log('[Loss -'+baseBet+' Bits]');
    profit = profit - baseBet;
		baseBet *= 1.7; 
		lossStack++;
		winStack = 0;
  } else { // Win
		if(winStack >= winToReset){
			console.log('[Win Reset +'+((baseBet * basePayout) -baseBet)+' Bits], Return to BaseBet ..');
    	profit += ((baseBet*basePayout)-baseBet);
    	baseBet = 1;
		} else if(winStack == 1){
			console.log('[Win after lose +'+((baseBet * basePayout) -baseBet)+' Bits]');
			baseBet *=0.93
			
  }
});
