// Een Tool is de pen of de gum.
class Tool {
  // Slaat op welke tool dit is.
  constructor(name) {
    this.name = name;
  }

  // Gebruikt de tool op een vakje.
  use(pixel, color) {
    if (this.name === 'pen') {
      pixel.setColor(color);
    }

    if (this.name === 'eraser') {
      pixel.reset();
    }
  }
}
