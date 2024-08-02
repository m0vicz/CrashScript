// Normal Increase Payout + Display Profit Version. Still at V1
var baseBet = 1;
var basePayout = 1.6;
var profit = 0;

var startingBalance = engine.getBalance(); // in satoshi

console.log('================== m0viCz in  CoinsCrash ==================');
console.log('My username is: ' + engine.getUsername());
console.log('Starting balance: ' + (startingBalance/100).toFixed(2) + ' bits');

var playing = false;
 
engine.on('game_starting', function(info) {
  console.log('Total Profit = ' + profit.toFixed(2) + ' bits');
  
});

  engine.placeBet(Math.floor(baseBet)*100, Math.round(basePayout * 100));
  console.log('Bet ' + baseBet + ' Cashout at ' + basePayout + 'x');
	playing = true;
engine.on('game_crash', function(data) {
  if(!playing) {
    return;
  } 
	playing = false;
 
  if(engine.lastGamePlay() == 'LOST') {
    basePayout += 1.25; 
    console.log('[Loss -'+baseBet+' Bits] , Now Payout change to ' + basePayout + 'x');
    profit = profit - baseBet;    
  } else { // Win   
    console.log('[Win +'+((baseBet * basePayout) -baseBet)+' Bits], Return Payout to Base Payout ..');
    profit += ((baseBet*basePayout)-baseBet);
    basePayout = 1.25;    
  }
});
