/* globals __DEV__ */
import Phaser from 'phaser'
import Node from '../objects/Node';
import Rect from '../objects/Rect';

export default class extends Phaser.State {
  init () { }
  preload () { }

  shuffle (array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Sorting and displaying algorithm
  iteration () {
    const asset = this.images.pop();
    if (asset) {
      const element = this.game.add.sprite(0, 0, asset);
      element.visible = false;
      const rect = new Rect(0, 0,
        element.width,
        element.height);

      const node = this.start_node.insertRect(rect);
      if (node) {
        const r = node.rect;
        if (!r.spr) {
          r.spr = element;
          r.spr.position.set(r.x, r.y);
          element.visible = true;
          this.filledArea += r.w * r.h;
        } else return;
      }
      if (Math.abs(this.total_area - this.filledArea) > this.total_area * 0.05) {
        this.iteration();
      }
    }
  }

  create () {
    // Populate with random image and shuffle it
    const imagesPath = this.imagesPath = ['50', '100', '150', '200'];
    // const sizes = this.sizes = [
    //   this.game.cache.getImage(imagesPath[0]).width,
    //   this.game.cache.getImage(imagesPath[1]).width,
    //   this.game.cache.getImage(imagesPath[2]).width,
    //   this.game.cache.getImage(imagesPath[3]).width
    // ]
    const images = this.images = [];

    let auxArray = [];
    for (let i = 0; i < 60; i++) {
      const img = this.game.add.sprite(0, 0, this.imagesPath[0]);
      img.visible = false;
      auxArray.push(img);
    };
    this.images.push(auxArray);

    auxArray = [];
    for (let i = 0; i < 20; i++) {
      const img = this.game.add.sprite(0, 0, this.imagesPath[1]);
      img.visible = false;
      auxArray.push(img);
    };
    this.images.push(auxArray);

    auxArray = [];
    for (let i = 0; i < 10; i++) {
      const img = this.game.add.sprite(0, 0, this.imagesPath[2]);
      img.visible = false;
      auxArray.push(img);
    };
    this.images.push(auxArray);

    auxArray = [];
    for (let i = 0; i < 5; i++) {
      const img = this.game.add.sprite(0, 0, this.imagesPath[3]);
      img.visible = false;
      auxArray.push(img);
    };
    this.images.push(auxArray);

    // Define the size of area
    const width = this.game.width;
    const height = this.game.height;

    const cols = this.cols = Math.ceil(width / this.images[0][0].width);
    const rows = this.rows = Math.ceil(height / this.images[0][0].height);

    this.cellWidth = this.images[0][0].width;
    this.cellHeight = this.images[0][0].height;

    console.log
    this.grid = new Array(rows); // [rows][cols];
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      this.grid[rowIndex] = new Array(cols);
      const row = this.grid[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        row[colIndex] = {
          empty: true,
          size: 0,
          indexes: {
            row: rowIndex,
            col: colIndex,
          }
        }
      }
    }
    this.totalCells = rows * cols;
    this.pendingCells = rows * cols;
    this.currentImageIndex = images.length - 1;

    this.cellsQueue = [];

    this.setImage(this.currentImageIndex);
  }

  setImage (index) {
    const currentImage = this.images[index].pop();
    const result = this.findEmptySpace(currentImage);

    if (result !== null) {
      this.setUsedSpace(currentImage, index, result)
      if (this.cellsQueue.length > 0) this.processQueue();
    }
  }

  setUsedSpace (image, sizeIndex, result) {
    // const cell = this.grid[result.row][result.col];
    // cell.empty = false;
    // cell.size = index;

    const widthCols = Math.round(image.width / this.cellWidth);
    const heightRows = Math.round(image.height / this.cellHeight);

    for (let rowIndex = 0; rowIndex < heightRows; rowIndex++) {
      if (result.row + rowIndex < this.grid.length) {
        const row = this.grid[result.row + rowIndex];
        for (let colIndex = 0; colIndex < widthCols; colIndex++) {
          if (result.col + colIndex < row.length) {
            const element = row[result.col + colIndex];
            element.empty = false;
            element.size = sizeIndex;

            if (rowIndex === 0 && result.row + rowIndex > 0) {
              const toQueue = this.grid[result.row + rowIndex - 1][result.col + colIndex];
              if (toQueue.empty && this.cellsQueue.indexOf(toQueue) === -1) this.cellsQueue.push(toQueue);
            }
            if (rowIndex === heightRows - 1 && result.row + rowIndex < this.grid.length - 1) {
              const toQueue = this.grid[result.row + rowIndex + 1][result.col + colIndex];
              if (toQueue.empty && this.cellsQueue.indexOf(toQueue) === -1) this.cellsQueue.push(toQueue);
            }
            if (colIndex === 0 && result.col + colIndex > 0) {
              const toQueue = row[result.col + colIndex - 1];
              if (toQueue.empty && this.cellsQueue.indexOf(toQueue) === -1) this.cellsQueue.push(toQueue);
            }
            if (colIndex === widthCols - 1 && result.col + colIndex < row.length - 1) {
              const toQueue = row[result.col + colIndex + 1];
              if (toQueue.empty && this.cellsQueue.indexOf(toQueue) === -1) this.cellsQueue.push(toQueue);
            }
          }
        }
      }
    }
  }

  processQueue () {
    console.log(this.cellsQueue)
    const element = this.cellsQueue.shift();
    const biggestSize = this.findBiggestNeighbourSize(element.indexes.row, element.indexes.col);
    let maxPossibleSize = 0;
    if (biggestSize !== this.images.length - 1) maxPossibleSize = this.images.length - 1;
    else maxPossibleSize = biggestSize - 1;
    
    const newSize = this.game.rnd.integerInRange(0, Math.max(0, biggestSize - 1));
  }

  findBiggestNeighbourSize (row, col) {
    const rowLimit = this.grid.length - 1;
    const columnLimit = this.grid[0].length - 1;
    let biggest = 0;

    for (let x = Math.max(0, row - 1); x <= Math.min(row + 1, rowLimit); x++) {
      for (let y = Math.max(0, col - 1); y <= Math.min(col + 1, columnLimit); y++) {
        if (x !== row || y !== col) {
          if (this.grid[x][y].size > biggest) biggest = this.grid[x][y].size;
        }
      }
    }
    return biggest;
  }

  findEmptySpace (currentImage) {
    let row = this.game.rnd.integerInRange(0, this.rows - 1);
    let col = this.game.rnd.integerInRange(0, this.cols - 1);

    if (this.grid[row][col].empty) {
      currentImage.position.set(col * this.cellWidth, row * this.cellHeight);
      currentImage.visible = true;
      return { row: row, col: col };
    } else return null;
  }
}
