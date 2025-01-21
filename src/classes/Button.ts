export class GameButton {
	element: HTMLButtonElement;
	isAction: boolean;

	constructor(id: string, isAction: boolean) {
		this.element = <HTMLButtonElement>document.getElementById(id);
		this.isAction = isAction;
	}

	get class(): string {
		return this.element.getAttribute('class') as string;
	}

	get active(): boolean {
		return !['disabled', 'disabled-selected'].includes(this.class);
	}

	get selected(): boolean {
		return this.class.includes('green');
	}

	setClickEvent(func: Function) {
		this.element.addEventListener('click', () => {
			return func();
		});
	}

	turnOnButton() {
		if (this.isAction) {
			this.element.setAttribute('class', 'fancy-button');
		} else if (this.selected) {
			this.element.setAttribute('class', 'green-btn fancy-button');
		} else {
			this.element.setAttribute('class', 'blue-btn fancy-button');
		}
	}

	turnOffButton() {
		if (!this.isAction && this.selected) {
			this.element.setAttribute('class', 'disabled-green');
		} else {
			this.element.setAttribute('class', 'disabled');
		}
	}

	selectButton(otherBtns: GameButton[]) {
		for (let i = 0; i < otherBtns.length; i++) {
			if (otherBtns[i].selected) {
				otherBtns[i].element.setAttribute('class', 'blue-btn fancy-button');
			}
		}

		this.element.setAttribute('class', 'green-btn fancy-button');
	}
}
