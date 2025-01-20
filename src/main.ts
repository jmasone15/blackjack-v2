import './style.css';
import { Game } from './classes/Game';

const startGame = () => {
	if (activeGame) {
		activeGame.modal.hide();
	}

	return activeGame.init();
};

const setUserMoney = (): number => {
	let localStoreVal = localStorage.getItem('money') as string;

	if (!localStoreVal) {
		localStorage.setItem('money', '0');
		return 0;
	} else {
		return parseInt(localStoreVal);
	}
};

const restartBtn = <HTMLButtonElement>document.getElementById('modal-button');
const money: number = setUserMoney();
const activeGame = new Game(money);

restartBtn.addEventListener('click', startGame);
startGame();
