/**
 * Pixel.js
 * Vertegenwoordigt één vakje op het canvas.
 */
class Pixel {
  constructor(x, y, size, color = '#15152a') {
    this.x = x;           // positie in pixels op het canvas (niet de rasterkolom)
    this.y = y;
    this.size = size;     // breedte / hoogte van het vakje
    this.color = color;   // huidige vulkleur
  }

  /** Tekent dit vakje op het canvas. */
  draw(ctx, showGrid) {
    // Vulkleur
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    // Rasterlijntje
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.size - 1, this.size - 1);
    }
  }

  /** Verander de kleur van dit vakje. */
  setColor(newColor) {
    this.color = newColor;
  }

  /** Herstel naar de standaard (doorzichtige) achtergrondkleur. */
  reset() {
    this.color = '#15152a';
  }
}
