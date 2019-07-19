"use strict";

const Field = {
  generate(wrapper, options) {
    wrapper.innerHTML = "";
    this.wrapper = wrapper;
    this.options = options;
    const { fieldSquareSize } = options;
    this.field = Array(fieldSquareSize)
      .fill(0)
      .map(x => Array(fieldSquareSize).fill(0));
    FieldRender.render();
    this._addListeners();
  },
  _addListeners() {
    this.wrapper.addEventListener("mousedown", e => {
      e.preventDefault();
      if (e.target.classList.contains("cell")) {
        const { x: x1, y: y1 } = e.target;
        self = this;
        this.wrapper.addEventListener("mouseup", function rectangleMouseUp(e) {
          e.preventDefault();
          const { x: x2, y: y2 } = e.target;
          self.wrapper.removeEventListener("mouseup", rectangleMouseUp);
          self.fillRectangle({ x1, y1, x2, y2 });
        });
        FieldRender.updateRender();
      }
    });
  },
  fillRectangle({ x1, y1, x2, y2 }) {
    let _X1, _X2, _Y1, _Y2;
    if (x2 < x1) {
      _X1 = x2;
      _X2 = x1;
    } else {
      _X1 = x1;
      _X2 = x2;
    }
    if (y2 < y1) {
      _Y1 = y2;
      _Y2 = y1;
    } else {
      _Y1 = y1;
      _Y2 = y2;
    }
    for (let i = _Y1; i <= _Y2; i++) {
      for (let j = _X1; j <= _X2; j++) {
        this.field[i][j] = this.field[i][j] ? 0 : 1;
      }
    }
    FieldRender.updateRender();
  },
  update() {
    const currentField = this.field;
    const newField = Array(currentField.length)
      .fill(0)
      .map(x => Array(currentField.length).fill(0));
    currentField.forEach((row, y) => {
      row.forEach((cellValue, x) => {
        newField[y][x] = CellUtility.cellIsWillAlive({ x, y }, currentField)
          ? 1
          : 0;
      });
    });
    this.field = newField;
    FieldRender.updateRender();
  }
};

const CellUtility = {
  cellIsWillAlive({ x, y }, field) {
    let countOfLiveNeighbors = 0;
    field[y - 1] && field[y - 1][x - 1] && countOfLiveNeighbors++;
    field[y - 1] && field[y - 1][x] && countOfLiveNeighbors++;
    field[y - 1] && field[y - 1][x + 1] && countOfLiveNeighbors++;
    field[y][x - 1] && countOfLiveNeighbors++;
    field[y][x + 1] && countOfLiveNeighbors++;
    field[y + 1] && field[y + 1][x - 1] && countOfLiveNeighbors++;
    field[y + 1] && field[y + 1][x] && countOfLiveNeighbors++;
    field[y + 1] && field[y + 1][x + 1] && countOfLiveNeighbors++;
    if (!field[y][x] && countOfLiveNeighbors === this.options.alifeRule1) {
      return true;
    }
    if (
      field[y][x] &&
      (countOfLiveNeighbors === this.options.alifeRule2 ||
        countOfLiveNeighbors === this.options.alifeRule3)
    ) {
      return true;
    }
    return false;
  }
};
Object.setPrototypeOf(CellUtility, Field);

const FieldRender = {
  render() {
    const { cellSize } = this.options;
    this.wrapper.style.width = `${this.field.length * cellSize}px`;
    this.wrapper.style.height = `${this.field.length * cellSize}px`;
    this.field.forEach((row, y) => {
      row.forEach((cellValue, x) => {
        const cellElement = document.createElement("div");
        cellElement.x = x;
        cellElement.y = y;
        cellElement.classList.add("cell");
        cellElement.isLife = cellValue;
        cellElement.style.cssText = `
        box-sizing: border-box;
        border: ${cellSize * 0.01}px solid black; 
        background-color: ${cellValue ? "green" : "#DDD"};
        height: ${cellSize}px;
        width: ${cellSize}px;
        font-family: Arial;
        text-align: center;
        color: white;`;
        this.wrapper.append(cellElement);
      });
    });
    this.liveCellCollection = Array.from(this.wrapper.children);
  },
  updateRender() {
    this.liveCellCollection.forEach(cellElement => {
      const alive = this.field[cellElement.y][cellElement.x];
      cellElement.style.backgroundColor = alive ? "green" : "#ddd";
      cellElement.isLife = alive ? 1 : 0;
    });
  }
};
Object.setPrototypeOf(FieldRender, Field);

const wrapper = document.querySelector(".wrapper");
const updateBtn = document.querySelector(".update");
const generateBtn = document.querySelector(".generate");

updateBtn.addEventListener("click", () => {
  if (!updateBtn.on) {
    updateBtn.timer = setInterval(() => {
      Field.update();
    }, Number(document.querySelector("#frequency").value));
  } else {
    clearInterval(updateBtn.timer);
  }
  updateBtn.on = !updateBtn.on;
});

generateBtn.addEventListener("click", () => {
  const options = {
    fieldSquareSize: Number(document.querySelector("#fieldSquareSize").value),
    cellSize: Number(document.querySelector("#cellSize").value),
    alifeRule1: Number(document.querySelector("#alifeRule1").value),
    alifeRule2: Number(document.querySelector("#alifeRule2").value),
    alifeRule3: Number(document.querySelector("#alifeRule3").value),
    frequency: Number(document.querySelector("#frequency").value)
  };
  Field.generate(wrapper, options);
  document.querySelector(".menu").style.display = "none";
});
