'use strict';

class Field {
	constructor(wrap, {size=40, nodeSize=20, alifeRule1=3, alifeRule2=2, alifeRule3=3} ) {
		this.alifeRule1 = alifeRule1;
		this.alifeRule2 = alifeRule2;
		this.alifeRule3 = alifeRule3;
		this.newField = [];
		this._size = size;
		this._wrap = wrap;
		this._nodeSize = nodeSize;
		this._field = [];
		this._field._size = size;
		this._recX1;
		this._recX2;
		this._recY1;
		this._recY2;
		for (let i = 0; i < size; i++) {
			let line = [];
			for (let j = 0; j < size; j++) {
				let node = {
					x: j,
					y: i,
					h: false
				};
				this.createNode(node);
				line.push(node);
			};
			this._field.push(line);
		};
		wrap.style.width = `${size * nodeSize}px`;
		wrap.style.height = `${size * nodeSize}px`;

		this._field[Symbol.iterator] = function () {
			let currentX = 0;
			let currentY = 0;
			let self = this;
			return {
				next() {
					if (currentX == self._size) {
						currentX = 0;
						currentY++;
					}
					if (currentY == self._size) {
						return {
							done: true
						}
					}
					return { 
							value: self[currentY][currentX++],
							done: false
					}
				}
			}
		}
	}

	createNode(node) {
		let nodeElement = document.createElement('div');
		node.html = nodeElement;
		nodeElement.x = node.x;
		nodeElement.y = node.y;
		let color;
		if (node.h) {
			color = 'green';
		} else {
			color = '#DDD'
		}
		nodeElement.style.cssText = `
			box-sizing: border-box;
			border: ${this._nodeSize*0.01}px solid black; 
			background-color: ${color};
			height: ${this._nodeSize}px;
			width: ${this._nodeSize}px;
			font-family: Arial;
			text-align: center;
			color: white;`;
		nodeElement.addEventListener('mousedown', () => {
			this._recX1 = node.x;
			this._recY1 = node.y;
		})
		nodeElement.addEventListener('mouseup', () => {
			this._recX2 = node.x;
			this._recY2 = node.y;
			this.fillRectangle();
		});
		this._wrap.append(nodeElement);
	}

	fillRectangle() {
		let x1 = this._recX1;
		let x2 = this._recX2;
		let y1 = this._recY1;
		let y2 = this._recY2;
		if (this._recX2 < this._recX1) {
			x1 = this._recX2;
			x2 = this._recX1;
		}
		if (this._recY2 < this._recX1) {
			y1 = this._recY2;
			y2 = this._recY1;
		}
		for (let i = y1; i <= y2; i++) {
			for (let j = x1; j <= x2; j++) {
				if (this._field[i][j].h) {
					this._field[i][j].h = false;
					this._field[i][j].html.style.backgroundColor = "#DDD";
				} else {
					this._field[i][j].h = true;
					this._field[i][j].html.style.backgroundColor = "green";
				}
			}
		}
	}

	updateMap() {
		for (let i = 0; i < this._field._size; i++) {
			let line = [];
			for (let j = 0; j < this._field._size; j++) {
				let node = {};
				node.x = this._field[i][j].x;
				node.y = this._field[i][j].y;
				node.h = this._field[i][j].h
				node.html = this._field[i][j].html;
				line.push(node);
			}
			this.newField._size = this._field._size;
			this.newField.push(line);
		}

		let allAlifes = 0;
		for (let elem of this._field) {

			let sum = this.countOfNeighbours(elem, this._field);
			if (sum == this.alifeRule1) {
				this.newField[elem.y][elem.x].h = true;
			} 
			if (sum < this.alifeRule2) {
				this.newField[elem.y][elem.x].h = false;
			}
			if (sum > this.alifeRule3) {
				this.newField[elem.y][elem.x].h = false;
			}
			if (this.newField[elem.y][elem.x].h) {
				allAlifes++;
				elem.html.style.backgroundColor = "green";
			} else {
				elem.html.style.backgroundColor = "#DDD";
			}
		}

		for (let i = 0; i < this.newField._size; i++) {
			for (let j = 0; j < this.newField._size; j++) {
				this._field[i][j].x = this.newField[i][j].x;
				this._field[i][j].y = this.newField[i][j].y;
				this._field[i][j].h = this.newField[i][j].h;
				this._field[i][j].html = this.newField[i][j].html;
			}
		}
		return allAlifes;
	}

	countOfNeighbours (node, field) {
		let x = node.x;
		let y = node.y;
		let sum = 0;
		try {
			if (field[y-1][x-1].h) {
				sum++;
			} 
			if (field[y-1][x].h) {
				sum++;
			}
			if (field[y-1][x+1].h) {
				sum++;
			}
			if (field[y][x-1].h) {
				sum++;
			}
			if (field[y][x+1].h) {
				sum++;
			}
			if (field[y+1][x-1].h) {
				sum++;
			}
			if (field[y+1][x].h) {
				sum++;
			}
			if (field[y+1][x+1].h) {
				sum++;
			}
			return sum;
		} catch (err) {
			if (err.name == 'TypeError') {

			}
		}
	}
}

class Node {

}

const wrapper = document.querySelector('.wrapper');
const button = document.querySelector('.button');
button.on = false;
button.timer = 0;

let options = {};
options.size = prompt('size {cells}', '40');
options.nodeSize = prompt('size of cell {px}', '20');
options.alifeRule1 = prompt('count of alive cells around then cell will live', '3');
options.alifeRule2 = prompt('min of alive neighbours for living', '2');
options.alifeRule3 = prompt('max of alive neighbours for living', '3');
let frequency = prompt('frequency {ms}', '100');

let university = new Field(wrapper, options);



button.addEventListener('click', () => {
		if (!button.on) {
			button.on = true;

			button.timer = setInterval(() => {
				button.innerHTML = university.updateMap();
			}, frequency);
		} else {
			clearInterval(button.timer);
			button.on = false;
		}
});