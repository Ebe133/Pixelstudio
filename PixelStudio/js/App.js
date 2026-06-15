/**
 * App.js
 * De motor van de applicatie.
 * Beheert het canvas, het grid, de actieve tool en alle events.
 */
class App {
  constructor() {
    this.canvas        = document.getElementById('pixelCanvas');
    this.ctx           = this.canvas.getContext('2d');
    this.selectedColor = '#e63946';
    this.showGrid      = true;
    this.isDrawing     = false;

    // Tools
    this.tools = {
      pen:    new PenTool(),
      eraser: new EraserTool(),
      fill:   new FillTool(),
    };
    this.currentTool = this.tools.pen;

    // Grid instellingen
    this.gridSize = 16;
    this.grid     = null;

    this.init();
  }

  /** Start de applicatie. */
  init() {
    this.resizeCanvas();
    this.createGrid();
    this.handleEvents();
    this.render();
  }

  /** Past de canvas-afmeting aan op basis van het beschikbare venster. */
  resizeCanvas() {
    const wrap = this.canvas.parentElement;
    const padding = 40;
    const available = Math.min(wrap.clientWidth - padding, wrap.clientHeight - padding);
    const canvasSize = Math.floor(available / this.gridSize) * this.gridSize;
    this.canvas.width  = canvasSize;
    this.canvas.height = canvasSize;
    this.cellSize = canvasSize / this.gridSize;
  }

  /** Maakt een nieuw Grid-object aan. */
  createGrid() {
    this.grid = new Grid(this.gridSize, this.gridSize, this.cellSize);
  }

  /** Tekent de hele scène opnieuw. */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.render(this.ctx, this.showGrid);
  }

  /** Registreert alle event listeners. */
  handleEvents() {
    // --- CANVAS: tekenen ---
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      this.applyToolAt(e);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.updateCoords(e);
      if (this.isDrawing) this.applyToolAt(e);
    });

    this.canvas.addEventListener('mouseup',    () => { this.isDrawing = false; });
    this.canvas.addEventListener('mouseleave', () => {
      this.isDrawing = false;
      document.getElementById('coords').textContent = '–';
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isDrawing = true;
      this.applyToolAt(e.touches[0]);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isDrawing) this.applyToolAt(e.touches[0]);
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => { this.isDrawing = false; });

    // --- TOOLS ---
    document.getElementById('btn-pen').addEventListener('click', () => {
      this.setTool('pen');
    });
    document.getElementById('btn-eraser').addEventListener('click', () => {
      this.setTool('eraser');
    });
    document.getElementById('btn-fill').addEventListener('click', () => {
      this.setTool('fill');
    });

    // --- KLEURENKIEZER ---
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', (e) => {
      this.selectedColor = e.target.value;
      this.syncSwatchHighlight();
    });

    // Palet-swatches
    document.querySelectorAll('.swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        this.selectedColor = e.currentTarget.dataset.color;
        colorPicker.value  = this.selectedColor;
        this.syncSwatchHighlight();
      });
    });

    // --- RASTER GROOTTE ---
    document.getElementById('gridSize').addEventListener('change', (e) => {
      this.gridSize = parseInt(e.target.value);
      this.resizeCanvas();
      this.createGrid();
      this.render();
    });

    // --- WISSEN ---
    document.getElementById('btn-clear').addEventListener('click', () => {
      this.grid.clearAll();
      this.render();
    });

    // --- EXPORT PNG ---
    document.getElementById('btn-export').addEventListener('click', () => {
      this.exportPNG();
    });

    // --- TOON RASTER TOGGLE ---
    document.getElementById('toggleGrid').addEventListener('change', (e) => {
      this.showGrid = e.target.checked;
      this.render();
    });

    // --- WINDOW RESIZE ---
    window.addEventListener('resize', () => {
      const oldColors = this.snapshotColors();
      this.resizeCanvas();
      this.createGrid();
      this.restoreColors(oldColors);
      this.render();
    });
  }

  /** Past de tool toe op het canvas op de positie van het event. */
  applyToolAt(e) {
    const { x, y } = this.getCanvasCoords(e);
    const pixel = this.grid.getPixelAt(x, y);
    if (!pixel) return;

    this.currentTool.apply(pixel, this.selectedColor, this.grid);
    this.render();
  }

  /** Zet de actieve tool en update de UI. */
  setTool(name) {
    this.currentTool = this.tools[name];
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${name}`).classList.add('active');
    // Cursor aanpassen
    this.canvas.style.cursor = name === 'eraser' ? 'cell' : 'crosshair';
  }

  /** Zet de highlight op de juiste kleurenswatch. */
  syncSwatchHighlight() {
    document.querySelectorAll('.swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === this.selectedColor);
    });
  }

  /** Update het coördinaten-label. */
  updateCoords(e) {
    const { x, y } = this.getCanvasCoords(e);
    const col = Math.floor(x / this.cellSize) + 1;
    const row = Math.floor(y / this.cellSize) + 1;
    if (col >= 1 && col <= this.gridSize && row >= 1 && row <= this.gridSize) {
      document.getElementById('coords').textContent = `${col}, ${row}`;
    }
  }

  /** Zet paginacoördinaten om naar canvas-relatieve coördinaten. */
  getCanvasCoords(e) {  
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width  / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  }

  /** Slaat alle pixelkleuren op als plat 2D-array (voor resize). */
  snapshotColors() {
    return this.grid.pixels.map(row => row.map(p => p.color));
  }

  /** Zet opgeslagen kleuren terug na een resize. */
  restoreColors(oldColors) {
    const minRows = Math.min(oldColors.length,    this.grid.rows);
    const minCols = Math.min(oldColors[0]?.length ?? 0, this.grid.cols);
    for (let r = 0; r < minRows; r++) {
      for (let c = 0; c < minCols; c++) {
        this.grid.pixels[r][c].setColor(oldColors[r][c]);
      }
    }
  }

  /** Exporteert het canvas als PNG-bestand. */
  exportPNG() {
    // Tijdelijk canvas zonder rasterlijnen voor een schone export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width  = this.canvas.width;
    exportCanvas.height = this.canvas.height;
    const ectx = exportCanvas.getContext('2d');
    this.grid.render(ectx, false);

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }
}
