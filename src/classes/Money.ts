import { delay } from '../utils/delay';

export class Money {
	amount: number;
	currentBet: number;
	nickname: string;
	htmlEl = document.getElementById('money') as HTMLElement;

	constructor(currentBet: number, amount: number, nickname: string) {
		this.currentBet = currentBet ?? 10;
		this.amount = amount;
		this.nickname = nickname;
	}

	setStorage() {
		localStorage.setItem('money', this.amount.toString());
		return;
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

		for (let i = 0; i < value; i++) {
			this.amount++;
			this.populate();

			await delay(value > 10 ? 5 : 30);
		}

		this.setStorage();

		return;
	}

	async subtract() {
		for (let i = 0; i < this.currentBet; i++) {
			this.amount--;
			this.populate();

			await delay(this.currentBet > 10 ? 5 : 30);
		}

		this.setStorage();

		return;
	}
}
