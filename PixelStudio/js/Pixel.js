// Een Pixel is 1 vakje.
class Pixel {
  // Geeft het vakje een startkleur.
  constructor(color = '#15152a') {
    this.color = color;
  }

  // Verandert de kleur van het vakje.
  setColor(color) {
    this.color = color;
  }

  // Zet het vakje terug naar donker.
  reset() {
    this.color = '#15152a';
  }
}
