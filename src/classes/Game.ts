import { Modal } from 'bootstrap';
import { Card } from './Card';
import { Player } from './Player';
import { GameButton } from './Button';
import { Money } from './Money';
import { delay } from '../utils/delay';
import JSConfetti from 'js-confetti';

// Interfaces
interface WinTextObj {
	userWin: string;
	header: string;
	message: string;
}

export class Game {
	// Game Variables | Make all private?
	playingCards: Card[] = [];
	roundCount: number = 0;
	cardIdx: number = 0;
	preGame: boolean = true;
	userAction: boolean = false;
	money: any;

	// Players
	user: Player = new Player();
	dealer: Player = new Player(true);

	// Database & API Variables
	userId: string = '';
	nickname: string = '';

	// Deck Variables
	deckCount: number = 1;
	suits: string[] = ['H', 'D', 'C', 'S'];
	cards: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

	// Action Button Variables
	buttonsDiv = <HTMLDivElement>document.getElementById('buttons');
	standBtn = new GameButton('stand', true);
	splitBtn = new GameButton('split', true);
	doubleBtn = new GameButton('double', true);
	hitBtn = new GameButton('hit', true);

	// Betting Button Variables
	betButtonsDiv = <HTMLDivElement>document.getElementById('betting-buttons');
	betButtons = [
		new GameButton('bet-1', false),
		new GameButton('bet-5', false),
		new GameButton('bet-10', false),
		new GameButton('bet-50', false),
		new GameButton('bet-100', false)
	];

	// Other UI Variables
	preGameDiv = <HTMLDivElement>document.getElementById('pre-game');
	startHandBtn = <HTMLButtonElement>document.getElementById('hand-start');
	changeBetBtn = <HTMLButtonElement>(
		document.getElementById('modal-button-change')
	);
	modalDiv = document.getElementById('staticBackdrop') as HTMLElement;
	modal = new Modal(this.modalDiv);
	modalHeader = <HTMLHeadingElement>document.getElementById('modal-header');
	modalBodyDiv = <HTMLDivElement>document.getElementById('modal-body');
	confetti: JSConfetti = new JSConfetti();

	constructor() {
		// Start Event
		this.startHandBtn.addEventListener('click', () => {
			return this.init();
		});

		// Change Bet Event
		this.changeBetBtn.addEventListener('click', () => {
			this.preRound(false);
		});

		// Hit Event
		this.hitBtn.setClickEvent(async () => {
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

		// Stand Event
		this.standBtn.setClickEvent(() => {
			if (!this.userAction || !this.standBtn.active) {
				return;
			}

			return this.endUserTurn();
		});

		// Betting Events
		this.betButtons.forEach((btn) => {
			btn.setClickEvent(() => {
				if (!btn.active || !this.preGame) {
					return;
				}

				// Turn on clicked button & set bet amount.
				btn.selectButton(this.betButtons);
				this.money.currentBet = parseInt(
					btn.element.getAttribute('data-value') as string
				);
			});
		});
	}

	async init() {
		this.betButtons.forEach((btn) => {
			btn.turnOffButton();
		});
		this.preGame = false;

		// Hide pregame section
		this.preGameDiv.setAttribute('class', 'd-none');

		// Eventually stick with one Game object and reshuffle when necessary.
		this.roundCount++;

		await this.money.subtract();

		// Generate Shuffled Cards if needed.
		if (this.roundCount == 1) {
			this.createDeck();
			// this.setDefaultStartingCards();
		} else {
			this.reset();
		}

		// Deal Initial Cards
		for (let i = 0; i < 4; i++) {
			// Delay between deals
			await delay(500);

			if (i % 2 == 0) {
				await this.user.deal(this.playingCards[this.cardIdx]);
			} else {
				await this.dealer.deal(this.playingCards[this.cardIdx], i !== 3);
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

	preRound(noBreak: boolean) {
		// Clear stale data
		this.reset();
		this.modal.hide();
		this.preGame = true;
		this.setUserData();

		// Set Cash
		this.money.populate();

		// Allow betting
		this.betButtons.forEach((btn) => {
			btn.turnOnButton();
		});

		// Show pre game section
		this.preGameDiv.setAttribute(
			'class',
			'container text-center mt-5 text-white'
		);

		if (noBreak) {
			return this.init();
		}
	}

	setUserData() {
		// Set User Data Properties
		const userData = JSON.parse(localStorage.getItem('user') as string);
		this.nickname = userData.nickname;
		this.userId = userData._id;
		this.money = new Money(10, userData.money, this.nickname);

		this.money.htmlEl.setAttribute('class', '');
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

		if (this.user.total < 21) {
			while (this.dealer.total < 17) {
				await this.dealer.deal(this.playingCards[this.cardIdx]);
				this.cardIdx++;
			}
		}

		return this.endGame();
	}

	determineWinner(): WinTextObj {
		let userWin = '';
		let header = '';
		let message = '';

		if (this.dealer.total > 21) {
			userWin = 'yes';
			header = 'You win!';
			message = 'Dealer Bust.';
		} else if (this.user.total > 21) {
			userWin = 'no';
			header = 'You lose!';
			message = 'User Bust.';
		} else if (this.dealer.total == this.user.total) {
			userWin = 'push';
			header = 'Push';
			message = "Y'all tied.";
		} else if (this.dealer.total == 21) {
			userWin = 'no';
			header = 'You lose!';
			message = 'Dealer Blackjack.';
		} else if (this.user.total == 21) {
			userWin = 'yes';
			header = 'You win!';
			message = 'User Blackjack.';
		} else if (this.dealer.total > this.user.total) {
			userWin = 'no';
			header = 'You lose!';
			message = 'Dealer has better hand.';
		} else {
			userWin = 'yes';
			header = 'You win!';
			message = 'User has better hand.';
		}

		return {
			userWin,
			header,
			message
		};
	}

	async endGame() {
		const { userWin, header, message } = this.determineWinner();

		this.modalHeader.innerText = header;
		this.modalBodyDiv.innerText = message;
		this.modal.show();

		// Confetti toss
		if (userWin === 'yes') {
			await delay(250);
			this.money.add(true);
			await this.confetti.addConfetti({ confettiNumber: 500 });
			this.confetti.clearCanvas();
		} else if (userWin === 'push') {
			this.money.add(false);
		}
	}

	reset() {
		// Clear stale Player data
		this.user = new Player();
		this.dealer = new Player(true);

		// Clear stale UI elements
		this.user.reset();
		this.dealer.reset();
	}
}
