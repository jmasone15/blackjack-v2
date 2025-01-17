import { Card } from './Card';
import { Player } from './Player';

export class Game {
	// Game Variables | Make all private?
	playingCards: Card[] = [];
	roundCount: number = 0;
	cardIdx: number = 0;

	// Players
	user: Player = new Player();
	dealer: Player = new Player(true);

	// Deck Variables
	deckCount: number = 1;
	suits: string[] = ['H', 'D', 'C', 'S'];
	cards: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

	async init() {
		this.roundCount++;

		// Generate Shuffled Cards
		this.createDeck();

		// Deal Initial Cards
		for (let i = 0; i < 4; i++) {
			if (i % 2 == 0) {
				this.user.deal(this.playingCards[i]);
			} else {
				this.dealer.deal(this.playingCards[i]);
			}

			// Increment cardIdx and Delay between deals
			this.cardIdx++;
			await this.delay(500);
		}
	}

	delay(ms: number): Promise<Function> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	createDeck() {
		// Generate Deck based on Game parameters.
		for (let i = 0; i < this.deckCount; i++) {
			this.suits.forEach((suit) => {
				this.cards.forEach((card) => {
					this.playingCards.push(new Card(suit, card));
				});
			});
		}

		// Shuffle using Fisher-Yates Algorithim.
		for (let i = this.playingCards.length - 1; i > 0; i--) {
			// Generate a random index from 0 to i.
			const randomIndex = Math.floor(Math.random() * (i + 1));

			// Swap elements at i and randomIndex.
			[this.playingCards[i], this.playingCards[randomIndex]] = [
				this.playingCards[randomIndex],
				this.playingCards[i]
			];
		}

		// Set Card Ids
		for (let i = 0; i < this.playingCards.length; i++) {
			this.playingCards[i].id = i;
		}
	}
}
