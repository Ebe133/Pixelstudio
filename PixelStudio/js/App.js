// App regelt de knoppen en de muis.
class App {
  // Zet de app klaar.
  constructor() {
    this.canvas = document.getElementById('pixelCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.size = 512;
    this.amount = 16;
    this.cell = this.size / this.amount;

    this.color = '#e63946';
    this.isDrawing = false;

    this.tools = {
      pen: new Tool('pen'),
      eraser: new Tool('eraser'),
    };
    this.currentTool = this.tools.pen;

    this.canvas.width = this.size;
    this.canvas.height = this.size;

    this.grid = new Grid(this.amount, this.cell);

    this.addEvents();
    this.draw();
  }

  // Zet alle klik- en muisacties klaar.
  addEvents() {
    this.canvas.addEventListener('mousedown', (event) => {
      this.isDrawing = true;
      this.useTool(event);
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (this.isDrawing) {
        this.useTool(event);
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDrawing = false;
    });

    document.getElementById('btn-pen').addEventListener('click', () => {
      this.setTool('pen');
    });

    document.getElementById('btn-eraser').addEventListener('click', () => {
      this.setTool('eraser');
    });

    document.getElementById('colorPicker').addEventListener('input', (event) => {
      this.color = event.target.value;
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      this.grid.clearAll();
      this.draw();
    });
  }

  // Verandert de gekozen tool.
  setTool(name) {
    this.currentTool = this.tools[name];

    document.querySelectorAll('.tool-btn').forEach((button) => {
      button.classList.remove('active');
    });
 
    document.getElementById(`btn-${name}`).classList.add('active');
  }

  // Gebruikt de pen of gum op het aangeklikte vakje.
  useTool(event) {
    const box = this.canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const pixel = this.grid.getPixelAt(x, y);

    if (pixel) {
      this.currentTool.use(pixel, this.color);
      this.draw();
    }
  }

  // Tekent het raster opnieuw.
  draw() {
    this.grid.draw(this.ctx);
  }
}
