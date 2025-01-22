import './style.css';
import { Game } from './classes/Game';
import { Modal } from 'bootstrap';

// const fetchUserData = async () => {
// 	const response = await window.fetch(
// 		'https://simple-api-isq7ga.fly.dev/blackjack'
// 	);

// 	if (response.ok) {
// 		const data = await response.json();
// 		console.log(data);
// 	}
// };

const signUpModal = new Modal(
	document.getElementById('modal-sign-in') as HTMLElement
);
const formEl = document.getElementById('form') as HTMLFormElement;
const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const validationEl = document.getElementById('validation') as HTMLElement;
const restartBtn = <HTMLButtonElement>document.getElementById('modal-button');
const activeGame = new Game();

const startGame = (skipMainScreen: boolean) => {
	if (activeGame) {
		activeGame.modal.hide();
	}

	return activeGame.preRound(skipMainScreen);
};

restartBtn.addEventListener('click', () => {
	return startGame(true);
});
formEl.addEventListener('submit', async (e) => {
	e.preventDefault();

	const loginResponse = await window.fetch(
		'https://simple-api-isq7ga.fly.dev/blackjack/login',
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json;charset=UTF-8'
			},
			body: JSON.stringify({
				nickname: nicknameInput.value,
				email: emailInput.value
			})
		}
	);

	const loginData = await loginResponse.json();

	if (loginData?.message && loginData.message === 'No user found.') {
		const signUpResponse = await window.fetch(
			'https://simple-api-isq7ga.fly.dev/blackjack',
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				},
				body: JSON.stringify({
					nickname: nicknameInput.value,
					email: emailInput.value
				})
			}
		);

		const signUpData = await signUpResponse.json();

		if (signUpData?.message) {
			validationEl.setAttribute('class', 'mx-3');
			validationEl.innerText = signUpData.message;
		} else {
			localStorage.setItem(
				'user',
				JSON.stringify({
					id: signUpData._id,
					nickname: signUpData.nickname,
					email: signUpData.email,
					money: signUpData.money
				})
			);
			activeGame.setUserData();
			signUpModal.hide();
		}
	} else {
		localStorage.setItem(
			'user',
			JSON.stringify({
				id: loginData._id,
				nickname: loginData.nickname,
				email: loginData.email,
				money: loginData.money
			})
		);
		activeGame.setUserData();
		signUpModal.hide();
	}
});

const userLoggedIn = localStorage.getItem('user');

if (!userLoggedIn) {
	signUpModal.show();
} else {
	startGame(false);
}
