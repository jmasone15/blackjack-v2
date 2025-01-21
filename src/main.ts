import './style.css';
import { Game } from './classes/Game';

const startGame = (skipMainScreen: boolean) => {
	if (activeGame) {
		activeGame.modal.hide();
	}

	return activeGame.preRound(skipMainScreen);
};

const restartBtn = <HTMLButtonElement>document.getElementById('modal-button');
const activeGame = new Game();

restartBtn.addEventListener('click', () => {
	return startGame(true);
});
startGame(false);
