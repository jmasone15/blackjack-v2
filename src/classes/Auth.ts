import { Modal } from 'bootstrap';
import { Game } from './Game';

export class Auth {
	id: string = '';
	initialMoney: number = 0;
	nickname: string = '';
	apiUrl: string = 'https://simple-api-isq7ga.fly.dev/blackjack';
	modal = new Modal(document.getElementById('login') as HTMLElement);
	modalFooter = document.getElementById('modal-footer') as HTMLElement;
	loginForm = document.getElementById('login-form') as HTMLFormElement;
	nameInput = document.getElementById('nickname') as HTMLInputElement;
	validationEl = document.getElementById('validation') as HTMLElement;
	secondValEl = document.getElementById('temp-val') as HTMLElement;
	parent: Game;
	loading: boolean = false;

	constructor(parent: Game) {
		this.parent = parent;

		this.loginForm.addEventListener('submit', (event) => {
			event.preventDefault();
			// Setup a spinner for waiting
			return this.login();
		});
	}

	get isLoggedIn() {
		return document.cookie !== '';
	}

	setLoading() {
		this.loading = !this.loading;
		this.modalFooter.innerHTML = this.loading
			? '<div class="spinner-border text-success" role="status"></div>'
			: '<button type="submit" class="btn btn-success">Submit</button>';
	}

	async login() {
		try {
			this.setLoading();
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
		} finally {
			this.setLoading();
		}
	}

	async getUserData() {
		try {
			this.id = this.getCookie('id');

			if (!this.id) {
				document.cookie = '';
				this.modal.show();
				return;
			}

			const response = await window.fetch(`${this.apiUrl}/user/${this.id}`);

			if (!response.ok) {
				const { message } = await response.json();

				if (message === 'No user found.') {
					document.cookie = '';
					this.modal.show();
					return;
				} else {
					throw new Error('Oops');
				}
			}

			const { money, nickname } = await response.json();

			this.nickname = nickname;
			this.initialMoney = money;
		} catch (error) {
			console.error(error);
			this.secondValEl.setAttribute('style', 'color: red');
			this.secondValEl.innerHTML = 'something broke, go yell at Jordan';
		}
	}

	getCookie(cname: string) {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}
}
