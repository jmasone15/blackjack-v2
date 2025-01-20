import { Card } from './Card';
import { Player } from './Player';
import { GameButton } from './Button';
import { delay } from '../utils/delay';

export class Game {
	// Game Variables | Make all private?
	playingCards: Card[] = [];
	roundCount: number = 0;
	cardIdx: number = 0;
	userAction: boolean = false;

	// Players
	user: Player = new Player();
	dealer: Player = new Player(true);

	// Deck Variables
	deckCount: number = 1;
	suits: string[] = ['H', 'D', 'C', 'S'];
	cards: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

	// UI Variables
	buttonsDiv = <HTMLDivElement>document.getElementById('buttons');
	standBtn = new GameButton('stand');
	splitBtn = new GameButton('split');
	doubleBtn = new GameButton('double');
	hitBtn = new GameButton('hit');

	constructor() {
		// Event Listeners
		this.hitBtn.element.addEventListener('click', async () => {
			if (!this.userAction || !this.hitBtn.active) {
				return;
			}

			await this.user.deal(this.playingCards[this.cardIdx]);
			this.cardIdx++;

			if (this.user.total > 20) {
				this.endUserTurn();
			}

			return;
		});

		this.standBtn.element.addEventListener('click', () => {
			if (!this.userAction || !this.standBtn.active) {
				return;
			}

			return this.endUserTurn();
		});
	}

	async init() {
		this.roundCount++;

		// Generate Shuffled Cards
		this.createDeck();
		// this.setDefaultStartingCards();

		// Deal Initial Cards
		for (let i = 0; i < 4; i++) {
			// Delay between deals
			await delay(500);

			if (i % 2 == 0) {
				await this.user.deal(this.playingCards[i]);
			} else {
				await this.dealer.deal(this.playingCards[i], i !== 3);
			}

			// Increment cardIdx
			this.cardIdx++;
		}

		await delay(500);

		// Initial end of game checks
		if (this.user.total == 21 || this.dealer.total == 21) {
			this.endUserTurn();
			return;
		}

		this.userAction = true;

		// Handle Action Buttons
		this.hitBtn.turnOnButton();
		this.standBtn.turnOnButton();
	}

	// For Testing
	setDefaultStartingCards() {
		const startingCards = [new Card('H', 14)];

		startingCards.forEach((card) => {
			this.playingCards.unshift(card);
		});
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

	endUserTurn() {
		this.userAction = false;

		// Handle Buttons
		this.standBtn.turnOffButton();
		this.splitBtn.turnOffButton();
		this.doubleBtn.turnOffButton();
		this.hitBtn.turnOffButton();

		return this.dealerTurn();
	}

	async dealerTurn() {
		this.dealer.hand[1].flipCard();
		this.dealer.hideTotal = false;
		this.dealer.calculateHandTotal();

		await delay(500);

		if (this.user.total > 21) {
			return;
		}

		while (this.dealer.total < 17) {
			await this.dealer.deal(this.playingCards[this.cardIdx]);
			this.cardIdx++;
		}

		return this.endGame();
	}

	endGame() {
		// ...
	}
}
