import { Card } from './Card';
import { delay } from '../utils/delay';

export class Player {
	identifier: string = 'user';
	hand: Card[] = [];
	cardDiv: HTMLDivElement;
	scoreDiv: HTMLDivElement;
	total: number = 0;
	aceCount: number = 0;
	hideTotal: boolean = false;

	constructor(isDealer?: boolean) {
		if (isDealer) {
			this.identifier = 'dealer';
			this.hideTotal = true;
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
			await delay(250);
			card.flipCard();
		}

		this.calculateHandTotal();
		await delay(250);
	}

	calculateHandTotal() {
		this.total = 0;
		let totalString = '';

		// Handle faceDown cards.
		if (this.hideTotal) {
			this.scoreDiv.innerHTML = '<b>Total:</b> ???';
			return;
		}

		// Initial Total
		this.hand.forEach((card) => {
			if (card.card == 14) {
				// Ace
				this.total++;
				this.aceCount++;
			} else if (card.card > 10) {
				// J, Q, K
				this.total += 10;
			} else {
				// Number Cards
				this.total += card.card;
			}
		});

		// Handle Aces
		if (this.aceCount > 0 && this.total + 10 < 22) {
			if (this.total + 10 == 21) {
				this.total = 21;
			} else {
				totalString = `${this.total} / ${this.total + 10}`;
				this.total += 10;
			}
		}

		if (totalString.length == 0) {
			totalString = this.total.toString();
		}

		this.scoreDiv.innerHTML = `<b>Total:</b> ${totalString}`;
	}

	reset() {
		// Remove stale card images
		while (this.cardDiv.firstChild) {
			this.cardDiv.removeChild(this.cardDiv.lastChild as Node);
		}

		// Remove stale total
		this.scoreDiv.innerHTML = '';
	}
}
