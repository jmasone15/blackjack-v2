import { Card } from './Card';
import { delay } from '../utils/delay';

export class Player {
	identifier: string = 'user';
	hand: Card[] = [];
	cardDiv: HTMLDivElement;
	scoreDiv: HTMLDivElement;
	total: number = 0;
	aceCount: number = 0;

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

	async deal(card: Card, flipCard: boolean = true) {
		// TODO - Deal animations

		this.cardDiv.appendChild(card.createHTMLElement());
		this.hand.push(card);

		if (card.card == 14) {
			this.aceCount++;
		}

		if (flipCard) {
			await delay(500);
			card.flipCard();
		}

		this.calculateHandTotal();
	}

	calculateHandTotal() {
		this.total = 0;

		// Initial Total
		this.hand.forEach((card) => {
			if (card.card == 14) {
				// Ace
				this.total++;
			} else if (card.card > 10) {
				// J, Q, K
				this.total += 10;
			} else {
				// Number Cards
				this.total += card.card;
			}
		});

		// TODO - Handle Aces
		this.scoreDiv.innerHTML = `<b>Total:</b> ${this.total}`;
	}
}
