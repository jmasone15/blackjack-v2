export class Money {
	amount: number;
	htmlEl = document.getElementById('money') as HTMLElement;

	constructor() {
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

	add(value: number) {
		this.amount += value;

		this.populate();
		this.setStorage();

		return;
	}

	subtract(value: number) {
		this.amount -= value;

		this.populate();
		this.setStorage();

		return;
	}
}
