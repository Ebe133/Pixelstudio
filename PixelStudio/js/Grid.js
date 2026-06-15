/**
 * Grid.js
 * Beheert het raster: maakt alle Pixel-objecten aan en tekent ze.
 */
class Grid {
  constructor(cols, rows, cellSize) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.pixels = [];    // 2D-array: pixels[rij][kolom]
    this.createGrid();
  }

  /** Maakt alle Pixel-objecten aan in een 2D-array. */
  createGrid() {
    this.pixels = [];
    for (let row = 0; row < this.rows; row++) {
      this.pixels[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        this.pixels[row][col] = new Pixel(x, y, this.cellSize);
      }
    }
  }

  /**
   * Geeft het Pixel-object terug op basis van canvas-coördinaten.
   * Geeft null terug als buiten het raster.
   */
  getPixelAt(canvasX, canvasY) {
    const col = Math.floor(canvasX / this.cellSize);
    const row = Math.floor(canvasY / this.cellSize);
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.pixels[row][col];
    }
    return null;
  }

  /** Tekent het volledige raster op het canvas. */
  render(ctx, showGrid) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.pixels[row][col].draw(ctx, showGrid);
      }
    }
  }

  /** Reset alle pixels naar de standaardkleur. */
  clearAll() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.pixels[row][col].reset();
      }
    }
  }

  /**
   * Flood-fill: kleurt alle aangrenzende pixels met dezelfde kleur.
   * Gebruikt een iteratief BFS-algoritme.
   */
  fill(startPixel, newColor) {
    const targetColor = startPixel.color;
    if (targetColor === newColor) return;

    // Zoek rij/kolom van startPixel
    let startRow = -1, startCol = -1;
    outer:
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.pixels[r][c] === startPixel) {
          startRow = r; startCol = c;
          break outer;
        }
      }
    }
    if (startRow === -1) return;

    const queue = [[startRow, startCol]];
    const visited = new Set();
    visited.add(`${startRow},${startCol}`);

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const pixel = this.pixels[r][c];
      if (pixel.color !== targetColor) continue;
      pixel.setColor(newColor);

      const neighbors = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
      for (const [nr, nc] of neighbors) {
        const key = `${nr},${nc}`;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && !visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }
}
