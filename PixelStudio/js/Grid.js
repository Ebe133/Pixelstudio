// Grid maakt en tekent alle vakjes.
class Grid {
  // Maakt een nieuw raster.
  constructor(amount, cellSize) {
    this.amount = amount;
    this.cellSize = cellSize;
    this.pixels = [];

    this.makePixels();
  }

  // Maakt alle vakjes leeg/donker.
  makePixels() {
    for (let row = 0; row < this.amount; row++) {
      this.pixels[row] = [];

      for (let col = 0; col < this.amount; col++) {
        this.pixels[row][col] = new Pixel();
      }
    }
  }

  // Zoekt welk vakje bij de muispositie hoort.
  getPixelAt(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    if (row < 0 || row >= this.amount || col < 0 || col >= this.amount) {
      return null;
    }

    return this.pixels[row][col];
  }

  // Wist alle vakjes.
  clearAll() {
    this.makePixels();
  }

  // Tekent alle vakjes op het canvas.
  draw(ctx) {
    for (let row = 0; row < this.amount; row++) {
      for (let col = 0; col < this.amount; col++) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;

        ctx.fillStyle = this.pixels[row][col].color;
        ctx.fillRect(x, y, this.cellSize, this.cellSize);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      }
    }
  }
}
