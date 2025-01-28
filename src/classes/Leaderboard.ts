export class Leaderboard {
	leaderboardDiv: HTMLElement;
	mainDiv: HTMLElement;
	preGameDiv: HTMLElement;
	actionButtonsDiv: HTMLElement;
	bettingButtonsDiv: HTMLElement;
	validationEl: HTMLElement;
	spinnerEl: HTMLElement;
	tableEl: HTMLElement;
	loading: boolean;

	constructor() {
		// HTML Elements
		this.preGameDiv = document.getElementById('pre-game') as HTMLElement;
		this.mainDiv = document.getElementById('main') as HTMLElement;
		this.leaderboardDiv = document.getElementById(
			'leaderboard-div'
		) as HTMLElement;
		this.actionButtonsDiv = document.getElementById('buttons') as HTMLElement;
		this.bettingButtonsDiv = document.getElementById(
			'betting-buttons'
		) as HTMLElement;
		this.validationEl = document.getElementById(
			'leader-validation'
		) as HTMLElement;
		this.spinnerEl = document.getElementById('leader-spinner') as HTMLElement;
		this.tableEl = document.getElementById('table') as HTMLElement;

		// Other variables
		this.loading = false;

		// Flip UI
		this.showLeaderboard();
	}

	async populateLeaderboard() {
		try {
			this.setLoading();
			const response = await window.fetch(
				'https://simple-api-isq7ga.fly.dev/blackjack/top-ten'
			);
			const data = await response.json();

			for (let i = 0; i < data.length; i++) {
				const { nickname, money } = data[i];
				const targetTableRow = document.getElementById(
					`table-row-${i + 1}`
				) as HTMLElement;
				const targetNameCell = targetTableRow.children[1] as HTMLElement;
				const targetMoneyCell = targetTableRow.children[2] as HTMLElement;

				targetNameCell.innerText = nickname;
				targetMoneyCell.innerText = `$${money}.00`;
			}
		} catch (error) {
			console.error(error);
			// validationEl.setAttribute('class', 'text-danger mb-4');
		} finally {
			this.setLoading();
		}
	}

	showLeaderboard() {
		this.mainDiv.setAttribute('class', 'd-none');
		this.preGameDiv.setAttribute('class', 'd-none');
		this.actionButtonsDiv.setAttribute('class', 'd-none');
		this.bettingButtonsDiv.setAttribute('class', 'd-none');
		this.leaderboardDiv.setAttribute('class', 'container text-center');
	}

	hideLeaderboard() {
		this.mainDiv.setAttribute(
			'class',
			'container-fluid text-center text-white'
		);
		this.preGameDiv.setAttribute(
			'class',
			'container text-center mt-5 text-white'
		);
		this.actionButtonsDiv.setAttribute('class', '');
		this.bettingButtonsDiv.setAttribute('class', 'bet');
		this.leaderboardDiv.setAttribute('class', 'd-none');
	}

	setLoading() {
		this.loading = !this.loading;

		if (this.loading) {
			this.spinnerEl.setAttribute('class', 'spinner-border mt-5');
			this.tableEl.setAttribute('class', 'd-none');
		} else {
			this.spinnerEl.setAttribute('class', 'd-none');
			this.tableEl.setAttribute(
				'class',
				'table table-bordered table-dark table-striped table-hover'
			);
		}

		return;
	}
}
