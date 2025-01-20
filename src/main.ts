import './style.css';
import { Game } from './classes/Game';

const startGame = () => {
	if (activeGame) {
		activeGame.modal.hide();
	}

	return activeGame.init();
};

const restartBtn = <HTMLButtonElement>document.getElementById('modal-button');
const activeGame = new Game();

restartBtn.addEventListener('click', startGame);
startGame();
