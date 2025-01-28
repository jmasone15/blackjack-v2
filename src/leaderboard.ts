import './style.css';

const validationEl = document.getElementById('validation') as HTMLElement;
const spinnerEl = document.getElementById('spinner') as HTMLElement;
const tableEl = document.getElementById('table') as HTMLElement;
let loading = false;

const setLoadingUI = () => {
	loading = !loading;

	if (loading) {
		spinnerEl.setAttribute('class', 'spinner-border mt-5');
		tableEl.setAttribute('class', 'd-none');
	} else {
		spinnerEl.setAttribute('class', 'd-none');
		tableEl.setAttribute(
			'class',
			'table table-bordered table-dark table-striped table-hover'
		);
	}
};

const populateLeaderboard = async () => {
	try {
		setLoadingUI();
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
		validationEl.setAttribute('class', 'text-danger mb-4');
	} finally {
		setLoadingUI();
	}
};

populateLeaderboard();
