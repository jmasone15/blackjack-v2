export class Card {
	id!: any;
	suit: string;
	card: number;
	faceDown: boolean;

	constructor(suit: string, card: number, faceDown?: boolean) {
		this.suit = suit;
		this.card = card;
		this.faceDown = faceDown ?? false;
	}

	createHTMLElement(): HTMLImageElement {
		const cardImg: HTMLImageElement = document.createElement('img');

		cardImg.setAttribute('src', this.generateCardSrc());
		cardImg.setAttribute('id', this.id);
		cardImg.setAttribute(
			'class',
			'playing-card col-5 col-sm-4 col-md-3 col-xl-2'
		);

		return cardImg;
	}

	generateCardSrc(): string {
		// Change for deployment.
		const prefix = '/cards/';

		if (this.faceDown) {
			return `${prefix}/1B.svg`;
		} else if (this.card > 9) {
			switch (this.card) {
				case 10:
					return `${prefix}/T${this.suit}.svg`;
				case 11:
					return `${prefix}/J${this.suit}.svg`;
				case 12:
					return `${prefix}/Q${this.suit}.svg`;
				case 13:
					return `${prefix}/K${this.suit}.svg`;

				default:
					return `${prefix}/A${this.suit}.svg`;
			}
		} else {
			return `${prefix}/${this.card}${this.suit}.svg`;
		}
	}
}
