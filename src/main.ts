import './style.css';
import { Game } from './classes/Game';
import JSConfetti from 'js-confetti';

const restartBtn = <HTMLButtonElement>document.getElementById('modal-button');
const confettiEl = new JSConfetti();
let currentGame = new Game(confettiEl);

const startGame = () => {
	if (currentGame) {
		currentGame.modal.hide();
	}

	currentGame = new Game(confettiEl);

	return currentGame.init();
};

restartBtn.addEventListener('click', startGame);
startGame();
