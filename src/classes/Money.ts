import { delay } from '../utils/delay';

export class Money {
	amount: number = 0;
	currentBet: number = 10;
	nickname: string = '';
	htmlEl = document.getElementById('money') as HTMLSpanElement;

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

		return;
	}

	async subtract() {
		for (let i = 0; i < this.currentBet; i++) {
			this.amount--;
			this.populate();

			await delay(this.currentBet > 10 ? 5 : 30);
		}

		return;
	}
}
