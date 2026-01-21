// Image Editor Application
class ImageEditor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.currentImage = null;
        this.history = [];
        this.historyStep = -1;
        this.currentTool = null;
        this.isDrawing = false;
        this.cropStart = null;
        this.cropEnd = null;
        this.isCropping = false;
        
        // Drawing settings
        this.brushSize = 5;
        this.brushColor = '#ff0000';
        this.fontSize = 30;
        this.textColor = '#ffffff';
        this.shapeType = 'rectangle';
        this.shapeColor = '#00ff00';
        this.shapeFill = true;
        this.shapeStart = null;
        
        // Filter settings
        this.filters = {
            brightness: 0,
            contrast: 0,
            saturation: 100,
            hue: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateControlVisibility();
    }
    
    setupEventListeners() {
        // Upload
        document.getElementById('imageUpload').addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });
        
        // Tool buttons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.setTool(tool);
            });
        });
        
        // Filter controls
        ['brightness', 'contrast', 'saturation', 'hue'].forEach(filter => {
            const input = document.getElementById(filter);
            const valueDisplay = document.getElementById(`${filter}Value`);
            input.addEventListener('input', (e) => {
                this.filters[filter] = parseInt(e.target.value);
                valueDisplay.textContent = e.target.value;
                this.applyFilters();
            });
        });
        
        // Preset filters
        document.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyPresetFilter(e.target.dataset.preset);
            });
        });
        
        // Draw controls
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('brushSizeValue').textContent = e.target.value;
        });
        document.getElementById('brushColor').addEventListener('change', (e) => {
            this.brushColor = e.target.value;
        });
        
        // Text controls
        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.fontSize = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = e.target.value;
        });
        document.getElementById('textColor').addEventListener('change', (e) => {
            this.textColor = e.target.value;
        });
        
        // Shape controls
        document.getElementById('shapeType').addEventListener('change', (e) => {
            this.shapeType = e.target.value;
        });
        document.getElementById('shapeColor').addEventListener('change', (e) => {
            this.shapeColor = e.target.value;
        });
        document.getElementById('shapeFill').addEventListener('change', (e) => {
            this.shapeFill = e.target.checked;
        });
        
        // Flip controls
        document.getElementById('flipHorizontalBtn').addEventListener('click', () => {
            this.flipImage('horizontal');
        });
        document.getElementById('flipVerticalBtn').addEventListener('click', () => {
            this.flipImage('vertical');
        });
        
        // Resize controls
        document.getElementById('resizeWidth').addEventListener('input', (e) => {
            if (document.getElementById('maintainAspect').checked && this.currentImage) {
                const ratio = this.currentImage.height / this.currentImage.width;
                document.getElementById('resizeHeight').value = Math.round(e.target.value * ratio);
            }
        });
        document.getElementById('resizeHeight').addEventListener('input', (e) => {
            if (document.getElementById('maintainAspect').checked && this.currentImage) {
                const ratio = this.currentImage.width / this.currentImage.height;
                document.getElementById('resizeWidth').value = Math.round(e.target.value * ratio);
            }
        });
        document.getElementById('applyResizeBtn').addEventListener('click', () => {
            this.resizeImage();
        });
        
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Operation buttons
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
        document.getElementById('rotateBtn').addEventListener('click', () => this.rotateImage());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            } else if (this.isCropping && e.key === 'Enter') {
                this.applyCrop();
            } else if (this.isCropping && e.key === 'Escape') {
                this.cancelCrop();
            }
        });
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                this.displayImage(img);
                this.saveState();
                document.getElementById('uploadPrompt').style.display = 'none';
                this.canvas.classList.add('active');
                
                // Update resize inputs
                document.getElementById('resizeWidth').value = img.width;
                document.getElementById('resizeHeight').value = img.height;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    displayImage(img) {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
    }
    
    setTool(tool) {
        // Remove active class from all tool buttons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected tool
        const selectedBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        this.currentTool = tool;
        this.updateControlVisibility();
        
        // Handle crop tool
        if (tool === 'crop') {
            this.isCropping = true;
        } else {
            this.isCropping = false;
            this.cropStart = null;
            this.cropEnd = null;
        }
    }
    
    updateControlVisibility() {
        const controlPanel = document.getElementById('controlPanel');
        const allControls = controlPanel.querySelectorAll('.control-group');
        
        allControls.forEach(control => control.style.display = 'none');
        
        if (this.currentTool) {
            controlPanel.style.display = 'block';
            
            const controlMap = {
                'filter': 'filterControls',
                'preset': 'presetControls',
                'draw': 'drawControls',
                'text': 'textControls',
                'shape': 'shapeControls',
                'resize': 'resizeControls',
                'flip': 'flipControls',
                'crop': 'cropControls'
            };
            
            const controlId = controlMap[this.currentTool];
            if (controlId) {
                document.getElementById(controlId).style.display = 'block';
            }
        } else {
            controlPanel.style.display = 'none';
        }
    }
    
    handleMouseDown(e) {
        if (!this.currentImage) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.currentTool === 'draw') {
            this.isDrawing = true;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
        } else if (this.currentTool === 'crop') {
            this.cropStart = { x, y };
        } else if (this.currentTool === 'shape') {
            this.shapeStart = { x, y };
            this.isDrawing = true;
        }
    }
    
    handleMouseMove(e) {
        if (!this.currentImage) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.isDrawing && this.currentTool === 'draw') {
            this.ctx.strokeStyle = this.brushColor;
            this.ctx.lineWidth = this.brushSize;
            this.ctx.lineCap = 'round';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.cropStart && this.currentTool === 'crop') {
            this.cropEnd = { x, y };
            this.drawCropOverlay();
        } else if (this.isDrawing && this.currentTool === 'shape' && this.shapeStart) {
            this.drawShapePreview(x, y);
        }
    }
    
    handleMouseUp(e) {
        if (this.isDrawing && this.currentTool === 'draw') {
            this.isDrawing = false;
            this.saveState();
        } else if (this.isDrawing && this.currentTool === 'shape') {
            this.isDrawing = false;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.drawShape(x, y);
            this.saveState();
        }
    }
    
    handleCanvasClick(e) {
        if (this.currentTool === 'text') {
            const text = document.getElementById('textInput').value;
            if (!text) {
                alert('請先輸入文字內容');
                return;
            }
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.ctx.font = `${this.fontSize}px Inter, sans-serif`;
            this.ctx.fillStyle = this.textColor;
            this.ctx.fillText(text, x, y);
            this.saveState();
        }
    }
    
    drawCropOverlay() {
        if (!this.cropStart || !this.cropEnd) return;
        
        // Redraw image
        this.ctx.putImageData(this.getCanvasState(), 0, 0);
        
        // Draw overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear crop area
        const width = this.cropEnd.x - this.cropStart.x;
        const height = this.cropEnd.y - this.cropStart.y;
        this.ctx.clearRect(this.cropStart.x, this.cropStart.y, width, height);
        
        // Redraw image in crop area
        this.ctx.drawImage(this.canvas, 
            this.cropStart.x, this.cropStart.y, width, height,
            this.cropStart.x, this.cropStart.y, width, height
        );
        
        // Draw border
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.cropStart.x, this.cropStart.y, width, height);
    }
    
    applyCrop() {
        if (!this.cropStart || !this.cropEnd) return;
        
        const width = Math.abs(this.cropEnd.x - this.cropStart.x);
        const height = Math.abs(this.cropEnd.y - this.cropStart.y);
        const startX = Math.min(this.cropStart.x, this.cropEnd.x);
        const startY = Math.min(this.cropStart.y, this.cropEnd.y);
        
        const imageData = this.ctx.getImageData(startX, startY, width, height);
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.putImageData(imageData, 0, 0);
        
        this.cropStart = null;
        this.cropEnd = null;
        this.isCropping = false;
        this.currentTool = null;
        this.updateControlVisibility();
        this.saveState();
    }
    
    cancelCrop() {
        this.cropStart = null;
        this.cropEnd = null;
        this.isCropping = false;
        this.redrawCanvas();
    }
    
    drawShapePreview(x, y) {
        // Restore canvas state
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.canvas, 0, 0);
        
        this.redrawCanvas();
        this.drawShapeOnCanvas(this.shapeStart.x, this.shapeStart.y, x, y, true);
    }
    
    drawShape(x, y) {
        this.drawShapeOnCanvas(this.shapeStart.x, this.shapeStart.y, x, y, false);
        this.shapeStart = null;
    }
    
    drawShapeOnCanvas(x1, y1, x2, y2, isPreview) {
        const width = x2 - x1;
        const height = y2 - y1;
        
        this.ctx.strokeStyle = this.shapeColor;
        this.ctx.fillStyle = this.shapeColor;
        this.ctx.lineWidth = 3;
        
        if (this.shapeType === 'rectangle') {
            if (this.shapeFill) {
                this.ctx.fillRect(x1, y1, width, height);
            } else {
                this.ctx.strokeRect(x1, y1, width, height);
            }
        } else if (this.shapeType === 'circle') {
            const radius = Math.sqrt(width * width + height * height) / 2;
            const centerX = x1 + width / 2;
            const centerY = y1 + height / 2;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            if (this.shapeFill) {
                this.ctx.fill();
            } else {
                this.ctx.stroke();
            }
        }
    }
    
    applyFilters() {
        if (!this.currentImage) return;
        
        this.redrawCanvas();
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Brightness
            const brightnessFactor = this.filters.brightness;
            r += brightnessFactor;
            g += brightnessFactor;
            b += brightnessFactor;
            
            // Contrast
            const contrastFactor = (this.filters.contrast + 100) / 100;
            r = ((r - 128) * contrastFactor) + 128;
            g = ((g - 128) * contrastFactor) + 128;
            b = ((b - 128) * contrastFactor) + 128;
            
            // Convert to HSL for saturation and hue
            const hsl = this.rgbToHsl(r, g, b);
            
            // Saturation
            hsl[1] = hsl[1] * (this.filters.saturation / 100);
            
            // Hue
            hsl[0] = (hsl[0] + this.filters.hue) % 360;
            
            // Convert back to RGB
            const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
            
            data[i] = Math.max(0, Math.min(255, rgb[0]));
            data[i + 1] = Math.max(0, Math.min(255, rgb[1]));
            data[i + 2] = Math.max(0, Math.min(255, rgb[2]));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    applyPresetFilter(preset) {
        if (!this.currentImage) return;
        
        this.redrawCanvas();
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            switch(preset) {
                case 'grayscale':
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    break;
                    
                case 'vintage':
                    data[i] = r * 0.9;
                    data[i + 1] = g * 0.85;
                    data[i + 2] = b * 0.7;
                    break;
                    
                case 'vibrant':
                    const hsl = this.rgbToHsl(r, g, b);
                    hsl[1] = Math.min(1, hsl[1] * 1.5);
                    const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
                    data[i] = rgb[0];
                    data[i + 1] = rgb[1];
                    data[i + 2] = rgb[2];
                    break;
                    
                case 'invert':
                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;
                    data[i + 2] = 255 - b;
                    break;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.saveState();
    }
    
    rotateImage() {
        if (!this.currentImage) return;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.height;
        tempCanvas.height = this.canvas.width;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(90 * Math.PI / 180);
        tempCtx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);
        
        this.canvas.width = tempCanvas.width;
        this.canvas.height = tempCanvas.height;
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        this.saveState();
    }
    
    flipImage(direction) {
        if (!this.currentImage) return;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (direction === 'horizontal') {
            tempCtx.translate(tempCanvas.width, 0);
            tempCtx.scale(-1, 1);
        } else {
            tempCtx.translate(0, tempCanvas.height);
            tempCtx.scale(1, -1);
        }
        
        tempCtx.drawImage(this.canvas, 0, 0);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        this.saveState();
    }
    
    resizeImage() {
        if (!this.currentImage) return;
        
        const newWidth = parseInt(document.getElementById('resizeWidth').value);
        const newHeight = parseInt(document.getElementById('resizeHeight').value);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(this.canvas, 0, 0, newWidth, newHeight);
        
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        this.saveState();
    }
    
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch(max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
            
            h *= 360;
        }
        
        return [h, s, l];
    }
    
    hslToRgb(h, s, l) {
        h /= 360;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [r * 255, g * 255, b * 255];
    }
    
    getCanvasState() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    
    redrawCanvas() {
        if (this.historyStep >= 0 && this.history[this.historyStep]) {
            const state = this.history[this.historyStep];
            this.canvas.width = state.width;
            this.canvas.height = state.height;
            this.ctx.putImageData(state.data, 0, 0);
        }
    }
    
    saveState() {
        this.historyStep++;
        this.history = this.history.slice(0, this.historyStep);
        this.history.push({
            data: this.getCanvasState(),
            width: this.canvas.width,
            height: this.canvas.height
        });
        
        // Limit history to 50 steps
        if (this.history.length > 50) {
            this.history.shift();
            this.historyStep--;
        }
    }
    
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.redrawCanvas();
        }
    }
    
    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.redrawCanvas();
        }
    }
    
    reset() {
        if (!this.originalImage) return;
        
        if (confirm('確定要重置所有編輯嗎？')) {
            this.displayImage(this.originalImage);
            this.history = [];
            this.historyStep = -1;
            this.filters = {
                brightness: 0,
                contrast: 0,
                saturation: 100,
                hue: 0
            };
            
            // Reset filter controls
            document.getElementById('brightness').value = 0;
            document.getElementById('brightnessValue').textContent = 0;
            document.getElementById('contrast').value = 0;
            document.getElementById('contrastValue').textContent = 0;
            document.getElementById('saturation').value = 100;
            document.getElementById('saturationValue').textContent = 100;
            document.getElementById('hue').value = 0;
            document.getElementById('hueValue').textContent = 0;
            
            this.saveState();
        }
    }
    
    download() {
        if (!this.currentImage) {
            alert('請先上傳圖片');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// Initialize the app
const editor = new ImageEditor();
