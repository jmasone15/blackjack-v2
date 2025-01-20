export class GameButton {
	element: HTMLButtonElement;

	constructor(id: string) {
		this.element = <HTMLButtonElement>document.getElementById(id);
	}

	get active(): boolean {
		return this.element.getAttribute('class') !== 'disabled';
	}

	turnOnButton() {
		this.element.setAttribute('class', 'fancy-button');
	}

	turnOffButton() {
		this.element.setAttribute('class', 'disabled');
	}
}
