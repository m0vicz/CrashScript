// Normal Increase Payout + Display Profit Version. Still at V1
var baseBet = 1;
var basePayout = 1.60;
var profit = 0;
var winToReset = 2; // Number win - 1
var winStack = 0;
var lossStack = 0;
var firstGame = true;

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
 
  if(engine.lastGamePlay() == 'LOST' && !firstGame) {
		console.log('[Loss -'+baseBet+' Bits]');
    profit = profit - baseBet;
		console.log('[Lost] Now Profit = '+ profit +' bits');
		baseBet *= 1.8;
		console.log('Next bet will be = '+ baseBet +' ..');
		lossStack++;
		winStack = 0;
  } else if(engine.lastGamePlay() == 'WON' && !firstGame){
		winStack++;
		if(winStack >= winToReset){
			console.log('[Win Reset We get +'+((baseBet * basePayout) -baseBet)+' Bits], Return to BaseBet ..');
    	profit += (baseBet * basePayout)-baseBet;
			console.log('[Win Reset] Profit = '+profit+' bits');
    	baseBet = 1;
			lossStack = 0;
		}
		if(winStack == 1 && !firstGame){
			console.log('[Win after lose] We get +'+((baseBet * basePayout) -baseBet)+' Bits]');
			profit += ((baseBet*basePayout)-baseBet);
			console.log('[Win Reset] Profit = '+profit+' bits');
			baseBet *= 0.90;
			console.log('Next bet will be = '+ baseBet +' ..');
			lossStack = 0;
		}
	}
});
