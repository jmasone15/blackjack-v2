import './style.css';
import { Game } from './classes/Game';
import { Leaderboard } from './classes/Leaderboard';

const restartBtn = <HTMLButtonElement>document.getElementById('modal-button');
const returnBtn = <HTMLButtonElement>document.getElementById('return');
const leaderboardBtn = <HTMLButtonElement>(
	document.getElementById('leaderboard')
);
const activeGame = new Game();
let leaderboard: Leaderboard;

const startGame = (skipMainScreen: boolean) => {
	if (activeGame) {
		activeGame.modal.hide();
	}

	return activeGame.preRound(skipMainScreen);
};

restartBtn.addEventListener('click', () => {
	return startGame(true);
});
returnBtn.addEventListener('click', () => {
	return leaderboard.hideLeaderboard();
});
leaderboardBtn.addEventListener('click', () => {
	leaderboard = new Leaderboard();
	return leaderboard.populateLeaderboard();
});

startGame(false);
