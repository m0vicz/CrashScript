var baseBet = 1; // In bits
var basePayout = 1.55; // Target Payout : 1.10 recommended
var variableBase = false; // Enable variable mode (very experimental), read streakSecurity.
var streakSecurity = 10; // Number of loss-streak you wanna be safe/skip for. Increasing this massively reduces the variableBase calculated. (1-loss = 20%, 2-loss = 5%, 3-loss = 1.25% of your maximum balance). Recommended: 2+
var maximumBet = 550; // Maximum bet the bot will do (in bits).
var winReset = 2; // Number of win to return basebet
var lossReset = 4; // Number for stop if lose too much.

// Variables - Do not touch!
var baseSatoshi = baseBet * 100; // Calculated
var currentBet = baseSatoshi;
var currentPayout = Math.round(basePayout * 100);
//var currentGreenStreak = GetCurrentGreenStreak();
var currentGameID = -1;
var firstGame = true;
var lossStreak = 0;
var winStreak = 0;
var wins = 0;
var loss = 0;
var profit = 0;
var last = 0;
var countGame = 1;
var coolingDown = false;

var totalProfit = 0;
var startingBalance = engine.getBalance(); // in satoshi
//var simulation = true;	// (true/false) Setting this to true will make the bot to simulate a betting run
						// If you've changed any of the user settings, it's always recommended to test...
						// ...your changes by letting the bot run in simulator mode for a bit
//var simMsg = simulation ? '(SIMULATION) ' : ''; // This will appear in the console logs when running in simulator mode

// Initialization
console.log('====== m0v in CoinCrash  ======');
console.log('My username is: ' + engine.getUsername());
console.log('Starting balance: ' + (engine.getBalance() / 100).toFixed(2) + ' bits');

engine.on('game_starting', function(data){
	console.log('Current Profit: ' +(profit/100).toFixed(2)+ ' bits ('+wins+' Wins | '+loss+' Loses)');
	console.log('=========== New Game ===========');
	//console.log(simMsg + '[Bot] Game #' + countGame);
	countGame++;
	console.log('Game Number : ' + countGame);

	if(!firstGame){
		console.log('[Stats] Session profit: ' + ((engine.getBalance() - startingBalance) / 100).toFixed(2) + ' bits');
	} else {
		firstGame = false;
	}

	currentGameID = data.game_id;
	console.log('=========== New Game ===========');
	console.log('[Bot] Game #' + currentGameID);

	if(engine.lastGamePlay() == 'LOST' && !firstGame) {
		//lass++;	// key not cut when win1
		loss++;
		lossStreak++;
		profit -= currentBet;
		console.log('Profit [At Started]= ' + profit);
		
	//	if(lossStreak > streakSecurity) { coolingDown = true; return; }
		currentBet *= 1.88;
		
	} else {
		wins++;
		winStreak++;
		if(engine.lastGamePlay() == 'LOST' && last != 0 && !firstGame){
			currentBet *= 0.92;
		} else {
			currentBet = baseSatoshi;
			lossStreak = 0;
			winStreak = 0;
		}
	}
	console.log('Betting ' + (currentBet / 100) + ' bits, cashing out at ' + (currentPayout / 100) + 'x');
	firstGame = false;

	if (currentBet > 0){
		console.log('Betting ' + currentBet + ' bits, cashing out at ' + currentPayout + 'x');
	} else {
		console.warn('Base bet rounds to 0. Balance considered too low to continue.');
		engine.stop();
	}

	engine.placeBet(currentBet , currentPayout, false);
	
});

engine.on('game_started', function(data) {
	if (!firstGame) { 
		console.log('[Bot] Game #' + currentGameID + ' has started!');
	}
});
  
engine.on('cashed_out', function(data) {
	if(data.username == engine.getUsername()){
		var lastProfit = (currentBet * (data.stopped_at/100)) - currentBet;
		console.log('[Win] Cashed out at x'+(data.stopped_at/100) + 'x (+' + (lastProfit/100).toFixed(2)  + ')');
		wins++;
		winStreak++;
		lossStreak = 0;	
		profit += lastProfit;
	}
});

engine.on('game_crash', function(data){
	if (data.game_crash < (currentPayout *100) && !firstGame)
	{
		console.log('Game crashed at ' + (data.game_crash/100) + 'x (-' + currentBet + ')');
		last++;	// key not cut when win1
		loss++;
		lossStreak++;
		winStreak = 0;
		profit -= currentBet;
	} else if {
		(data.game_crash >= (currentPayout * 100) && !firstGame) {
			var lastProfit = (currentBet * currentPayoutt) - currentBet;
			console.log('Successfully cashed out at ' + currentCashout + 'x (+' + (lastProfit/100).toFixed(2) + ')');
		
			// Update global counters for win
			wins++;
			winStreak++;
			last = 0;
			lossStreak = 0;
			profit += lastProfit;
	}
});
