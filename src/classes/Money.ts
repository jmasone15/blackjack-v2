import { delay } from '../utils/delay';

export class Money {
	amount: number;
	currentBet: number;
	htmlEl = document.getElementById('money') as HTMLElement;

	constructor(currentBet?: number) {
		this.currentBet = currentBet ?? 10;

		let localStoreVal = localStorage.getItem('money') as string;

		if (!localStoreVal) {
			localStorage.setItem('money', '1000');
			this.amount = 1000;
		} else {
			this.amount = parseInt(localStoreVal);
		}
	}

	setStorage() {
		localStorage.setItem('money', this.amount.toString());
		return;
	}

	populate() {
		this.htmlEl.innerText = `$${this.amount}`;
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
