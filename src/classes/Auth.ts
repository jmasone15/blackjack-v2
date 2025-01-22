import { Modal } from 'bootstrap';
import { Game } from './Game';

export class Auth {
	id = '';
	initialMoney = 0;
	nickname = '';
	apiUrl = 'https://simple-api-isq7ga.fly.dev/blackjack';
	modal = new Modal(document.getElementById('login') as HTMLElement);
	loginForm = document.getElementById('login-form') as HTMLFormElement;
	nameInput = document.getElementById('nickname') as HTMLInputElement;
	validationEl = document.getElementById('validation') as HTMLElement;
	parent: Game;

	constructor(parent: Game) {
		this.parent = parent;

		if (this.isLoggedIn) {
		}

		this.loginForm.addEventListener('submit', (event) => {
			event.preventDefault();
			// Setup a spinner for waiting
			return this.login();
		});
	}

	get isLoggedIn() {
		return document.cookie !== '';
	}

	async login() {
		try {
			const response = await window.fetch(`${this.apiUrl}/login`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				},
				body: JSON.stringify({
					nickname: this.nameInput.value
				})
			});

			if (!response.ok) {
				throw new Error('oops');
			}

			const { _id, money, nickname } = await response.json();

			this.nickname = nickname;
			this.initialMoney = money;
			this.id = _id;
			document.cookie = `id=${_id}`;

			return this.parent.preRound(false);
		} catch (error) {
			console.error(error);
			this.validationEl.innerText = 'something broke, go yell at Jordan';
		}
	}

	async getUserData() {
		// ...
	}

	async getCurrentMoney() {
		// ...
	}

	async setCurrentMoney() {
		// ...
	}
}
