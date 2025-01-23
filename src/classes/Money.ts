import { delay } from '../utils/delay';
import { Game } from './Game';

export class Money {
	parent: Game;
	amount: number = 0;
	currentBet: number = 10;
	nickname: string = '';
	htmlEl = document.getElementById('money') as HTMLSpanElement;

	constructor(parent: Game) {
		this.parent = parent;
	}

	populate() {
		this.htmlEl.innerText = `${this.nickname}: $${this.amount}`;
		return;
	}

	async add(double: boolean) {
		let value: number = this.currentBet;
		if (double) {
			value = this.currentBet * 2;
		}

		await this.setCurrentMoney(this.amount + value);

		for (let i = 0; i < value; i++) {
			this.amount++;
			this.populate();

			await delay(value > 10 ? 5 : 30);
		}

		return;
	}

	async subtract() {
		await this.setCurrentMoney(this.amount - this.currentBet);

		for (let i = 0; i < this.currentBet; i++) {
			this.amount--;
			this.populate();

			await delay(this.currentBet > 10 ? 5 : 30);
		}

		return;
	}

	async setCurrentMoney(money: number) {
		try {
			const response = await window.fetch(
				`${this.parent.auth.apiUrl}/${this.parent.auth.id}`,
				{
					method: 'PUT',
					headers: {
						'content-type': 'application/json;charset=UTF-8'
					},
					body: JSON.stringify({
						money
					})
				}
			);

			if (!response.ok) {
				throw new Error('oops');
			}

			return;
		} catch (error) {
			console.error(error);
			this.htmlEl.setAttribute('style', 'color: red');
			this.htmlEl.innerText = 'something broke, go yell at jordan';
		}
	}
}
