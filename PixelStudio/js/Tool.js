/**
 * Tool.js
 * Bevat de tool-interface en concrete implementaties.
 *
 * Elke tool implementeert:
 *   - name: String
 *   - apply(pixel, color, grid): void
 */

class PenTool {
  constructor() {
    this.name = 'pen';
  }

  /** Geeft de pixel de gekozen kleur. */
  apply(pixel, color) {
    if (pixel) pixel.setColor(color);
  }
}

class EraserTool {
  constructor() {
    this.name = 'eraser';
  }

  /** Reset de pixel naar de standaard achtergrondkleur. */
  apply(pixel) {
    if (pixel) pixel.reset();
  }
}

class FillTool {
  constructor() {
    this.name = 'fill';
  }

  /** Flood-fill via het grid. */
  apply(pixel, color, grid) {
    if (pixel && grid) grid.fill(pixel, color);
  }
}
