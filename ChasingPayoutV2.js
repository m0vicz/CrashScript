// Normal Increase Payout + Display Profit Version. Still at V1
let baseBet = 1;
let basePayout = 1.60;
var profit = 0;
let winToReset = 2; // Number win - 1
var numWins = 0;
var numLoss = 0;
let firstGame = true;
let currentBet = 0;
var lossMulti = 1.8;
var winMulti = 0.9;

let startingBalance = engine.getBalance(); // in satoshi
//currentBet = Math.round(baseBet * 100);
currentBet = baseBet;

console.log('================== m0viCz in  CoinsCrash ==================');
console.log('My username is: ' + engine.getUsername());
console.log('Starting balance: ' + (startingBalance/100).toFixed(2) + ' bits');

engine.on('game_starting', function(info) 
{
	if(!firstGame) {// Display stats only after first game played
		console.log('Total Profit = ' + (profit/100).toFixed(2) + ' bits');
	}	else {
		firstGame = false;
	}
	//Start Condition Win-Loss
	if(engine.lastGamePlay() === 'LOST' && !firstGame) {
		currentBet = currentbet * 1.8;
		console.log('Next bet will be = '+ currentBet +' ..');
	} else if(engine.lastGamePlay() == 'WON' && !firstGame){
		if(numWins >= winToReset){
			currentBet = 1;
		}
		if(numWins == 1){
			currentBet = currentBet * 0.9;
		}
	}
	//console.log('Bet ' + currentBet + ' Cashout at ' + basePayout + 'x');
	engine.placeBet(Math.floor(currentBet)*100, Math.round(basePayout * 100));
});	



engine.on('cashed_out', function(data) { //win
	if (data.username === engine.getUsername())	{
		var lastProfit = (currentBet * (data.stopped_at/100)) - currentBet;
		console.log('[Win] cashed out at ' + (data.stopped_at/100) + 'x (+' + (lastProfit/100).toFixed(2)  + ')');
		// Update global counters for win
		//lastResult = 'WON';
    numWins++;
		numLoss = 0;
	  profit += lastProfit;
	}
});

engine.on('game_crash', function(data) {
	if (data.game_crash < (basePayout * 100) && !firstGame)	{
		console.log('Game crashed at ' + (data.game_crash/100) + 'x (-' + baseBet + ')');
		// Update global counters for loss
		// lastResult = 'LOST';
		numLoss++;
		numWins = 0;
    profit -= currentBet;		
  }
	else if (data.game_crash >= (basePayout * 100) && !firstGame)
	{
		var lastProfit = (currentBet * basePayout) - currentBet;
		console.log('[Win] Cashed out at ' + basePayout + 'x (+' + (lastProfit/100).toFixed(2) + ')');
		
		// Update global counters for win
	  // lastResult = 'WON';
    numWins++;
		numLoss = 0;
    profit += lastProfit;
	}
});
