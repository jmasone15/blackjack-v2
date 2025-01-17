import { Card } from './Card';

export class Player {
	identifier: string = 'user';
	hand: Card[] = [];
	cardDiv: HTMLDivElement;
	scoreDiv: HTMLDivElement;

	constructor(isDealer?: boolean) {
		if (isDealer) {
			this.identifier = 'dealer';
		}

		this.cardDiv = <HTMLDivElement>(
			document.getElementById(`${this.identifier}-cards`)
		);
		this.scoreDiv = <HTMLDivElement>(
			document.getElementById(`${this.identifier}-score`)
		);
	}

	deal(card: Card) {
		this.cardDiv.appendChild(card.createHTMLElement());
		this.hand.push(card);
	}

	calculateHandTotal() {
		// ... TODO
	}
}
