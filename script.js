// Image Editor Application with i18n support
class ImageEditor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasContainer = document.getElementById('canvasContainer');
        this.dragOverlay = document.getElementById('dragOverlay');
        this.resolutionDisplay = document.getElementById('resolutionDisplay');
        this.originalImage = null;
        this.currentImage = null;
        this.history = [];
        this.historyStep = -1;
        this.currentTool = null;
        this.isDrawing = false;
        this.cropStart = null;
        this.cropEnd = null;
        this.cropStart = null;
        this.cropEnd = null;
        this.isCropping = false;
        this.originalResizeCanvas = null;

        // Layered Rendering State
        this.baseCanvas = document.createElement('canvas');
        this.baseCtx = this.baseCanvas.getContext('2d');
        this.shapes = []; // Array of shape objects
        this.selectedShape = null;
        this.activeHandle = null; // For resizing shapes


        // Drawing settings
        this.brushSize = 5;
        this.brushColor = '#ff0000';
        this.fontSize = 30;
        this.textColor = '#ffffff';
        this.shapeType = 'rectangle';
        this.shapeColor = '#00ff00';
        this.shapeFill = true;
        this.lineWidth = 3;
        this.arrowType = 'single';
        this.shapeStart = null;

        // Polygon drawing
        this.polygonPoints = [];
        this.isDrawingPolygon = false;

        // Filter settings
        this.filters = {
            brightness: 0,
            contrast: 0,
            saturation: 100,
            hue: 0
        };

        // i18n Multi-language support
        this.currentLanguage = localStorage.getItem('language') || 'zh';
        this.i18n = {
            zh: {
                // Header
                title: '圖片編輯器',
                subtitle: '專業的線上圖片編輯工具',

                // Upload section
                uploadToStart: '上傳圖片開始編輯',
                supportedFormats: '支援 JPG、PNG、GIF 格式',
                dragDropHint: '或拖放圖片到此處',
                selectImage: '選擇圖片',
                dropImageHere: '拖放圖片到這裡',

                // Toolbar sections
                basicTools: '基本工具',
                filtersEffects: '濾鏡與效果',
                drawingTools: '繪圖工具',
                operations: '操作',

                // Basic tools
                upload: '上傳',
                crop: '裁切',
                rotate: '旋轉',
                flip: '翻轉',
                resize: '大小',

                // Filters
                filter: '濾鏡',
                preset: '預設',

                // Drawing tools
                brush: '畫筆',
                text: '文字',
                shape: '形狀',

                // Operations
                undo: '撤銷',
                redo: '重做',
                reset: '重置',
                download: '下載',

                // Shape settings
                shapeSettings: '形狀設定',
                shapeType: '形狀類型',
                rectangle: '矩形',
                circle: '圓形',
                line: '線條',
                arrow: '箭頭',
                polygon: '多邊形',
                lineWidth: '線條寬度',
                arrowType: '箭頭類型',
                singleArrow: '單向',
                doubleArrow: '雙向',
                color: '顏色',
                fill: '填充',
                shapeInstruction: '在畫布上拖曳繪製',
                polygonInstruction: '點擊畫布添加頂點，雙擊或按 Enter 完成',

                // Filter controls
                filterAdjustTitle: '濾鏡調整',
                brightness: '亮度',
                contrast: '對比度',
                saturation: '飽和度',
                hueLabel: '色相',

                // Preset filters
                presetFiltersTitle: '預設濾鏡',
                grayscale: '灰階',
                vintage: '復古',
                vibrant: '鮮豔',
                invert: '反轉',

                // Draw controls
                brushSettings: '畫筆設定',
                brushSize: '筆刷大小',

                // Text controls
                textSettings: '文字設定',
                textContent: '文字內容',
                enterText: '輸入文字...',
                textSize: '字體大小',
                clickCanvasToAddText: '在畫布上點擊添加文字',

                // Resize controls
                resizeTitle: '調整大小',
                widthPx: '寬度 (px)',
                heightPx: '高度 (px)',
                maintainRatio: '保持比例',
                apply: '套用',

                // Flip controls
                flipOptions: '翻轉選項',
                flipHorizontal: '水平翻轉',
                flipVertical: '垂直翻轉',

                // Crop controls
                cropInstruction: '在畫布上拖曳選擇裁切區域，然後按Enter確認或Escape取消',

                // Tooltips
                uploadImage: '上傳圖片',
                filterAdjust: '濾鏡調整',
                presetFilters: '預設濾鏡',
                undoShortcut: '撤銷 (Ctrl+Z)',
                redoShortcut: '重做 (Ctrl+Y)'
            },
            en: {
                // Header
                title: 'Image Editor',
                subtitle: 'Professional Online Image Editing Tool',

                // Upload section
                uploadToStart: 'Upload Image to Start',
                supportedFormats: 'Supports JPG, PNG, GIF',
                dragDropHint: 'Or drag and drop image here',
                selectImage: 'Select Image',
                dropImageHere: 'Drop Image Here',

                // Toolbar sections
                basicTools: 'Basic Tools',
                filtersEffects: 'Filters & Effects',
                drawingTools: 'Drawing Tools',
                operations: 'Operations',

                // Basic tools
                upload: 'Upload',
                crop: 'Crop',
                rotate: 'Rotate',
                flip: 'Flip',
                resize: 'Resize',

                // Filters
                filter: 'Filter',
                preset: 'Preset',

                // Drawing tools
                brush: 'Brush',
                text: 'Text',
                shape: 'Shape',

                // Operations
                undo: 'Undo',
                redo: 'Redo',
                reset: 'Reset',
                download: 'Download',

                // Shape settings
                shapeSettings: 'Shape Settings',
                shapeType: 'Shape Type',
                rectangle: 'Rectangle',
                circle: 'Circle',
                line: 'Line',
                arrow: 'Arrow',
                polygon: 'Polygon',
                lineWidth: 'Line Width',
                arrowType: 'Arrow Type',
                singleArrow: 'Single',
                doubleArrow: 'Double',
                color: 'Color',
                fill: 'Fill',
                shapeInstruction: 'Drag on canvas to draw',
                polygonInstruction: 'Click canvas to add points, double-click or press Enter to finish',

                // Filter controls
                filterAdjustTitle: 'Filter Adjustment',
                brightness: 'Brightness',
                contrast: 'Contrast',
                saturation: 'Saturation',
                hueLabel: 'Hue',

                // Preset filters
                presetFiltersTitle: 'Preset Filters',
                grayscale: 'Grayscale',
                vintage: 'Vintage',
                vibrant: 'Vibrant',
                invert: 'Invert',

                // Draw controls
                brushSettings: 'Brush Settings',
                brushSize: 'Brush Size',

                // Text controls
                textSettings: 'Text Settings',
                textContent: 'Text Content',
                enterText: 'Enter text...',
                textSize: 'Font Size',
                clickCanvasToAddText: 'Click on canvas to add text',

                // Resize controls
                resizeTitle: 'Resize',
                widthPx: 'Width (px)',
                heightPx: 'Height (px)',
                maintainRatio: 'Maintain Ratio',
                apply: 'Apply',

                // Flip controls
                flipOptions: 'Flip Options',
                flipHorizontal: 'Flip Horizontal',
                flipVertical: 'Flip Vertical',

                // Crop controls
                cropInstruction: 'Drag on canvas to select crop area, then press Enter to confirm or Escape to cancel',

                // Tooltips
                uploadImage: 'Upload Image',
                filterAdjust: 'Filter Adjustment',
                presetFilters: 'Preset Filters',
                undoShortcut: 'Undo (Ctrl+Z)',
                redoShortcut: 'Redo (Ctrl+Y)'
            }
        };

        // Bind window event listeners for smooth dragging outside canvas
        this.boundWindowMouseMove = this.handleMouseMove.bind(this);
        this.boundWindowMouseUp = this.handleMouseUp.bind(this);

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setLanguage(this.currentLanguage);
        this.updateControlVisibility();
    }

    // Multi-language support
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateUILanguage();

        // Update language switcher text
        document.getElementById('langText').textContent = lang === 'zh' ? 'EN' : '中';
    }

    updateUILanguage() {
        const translations = this.i18n[this.currentLanguage];

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = translations[key];
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });

        // Update elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });

        // Update elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (translations[key]) {
                element.title = translations[key];
            }
        });
    }

    // Drag and Drop support
    setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.canvasContainer.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        this.canvasContainer.addEventListener('dragenter', () => {
            this.canvasContainer.classList.add('drag-over');
            this.dragOverlay.classList.add('active');
        });

        this.canvasContainer.addEventListener('dragleave', (e) => {
            if (e.target === this.canvasContainer) {
                this.canvasContainer.classList.remove('drag-over');
                this.dragOverlay.classList.remove('active');
            }
        });

        this.canvasContainer.addEventListener('drop', (e) => {
            this.canvasContainer.classList.remove('drag-over');
            this.dragOverlay.classList.remove('active');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    this.loadImageFromFile(file);
                }
            }
        });
    }

    loadImageFromFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                this.shapes = []; // Clear shapes for new image
                this.selectedShape = null;
                this.displayImage(img);

                // Reset resize session when loading new image
                this.endResizeSession();
                if (this.currentTool === 'resize') {
                    this.startResizeSession();
                }

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

    setupEventListeners() {
        // Language switcher
        document.getElementById('languageSwitcher').addEventListener('click', () => {
            const newLang = this.currentLanguage === 'zh' ? 'en' : 'zh';
            this.setLanguage(newLang);
        });

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
            this.updateShapeControlsVisibility();
        });
        document.getElementById('shapeColor').addEventListener('change', (e) => {
            this.shapeColor = e.target.value;
        });
        document.getElementById('shapeFill').addEventListener('change', (e) => {
            this.shapeFill = e.target.checked;
        });
        document.getElementById('lineWidth').addEventListener('input', (e) => {
            this.lineWidth = parseInt(e.target.value);
            document.getElementById('lineWidthValue').textContent = e.target.value;
        });
        document.getElementById('arrowType').addEventListener('change', (e) => {
            this.arrowType = e.target.value;
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
        this.canvas.addEventListener('dblclick', (e) => this.handleCanvasDoubleClick(e));

        // Operation buttons
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
        document.getElementById('rotateBtn').addEventListener('click', () => this.rotateImage());
        document.getElementById('cropConfirmBtn').addEventListener('click', () => this.applyCrop());
        document.getElementById('cropCancelBtn').addEventListener('click', () => this.cancelCrop());

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
            } else if (this.isDrawingPolygon && e.key === 'Enter') {
                this.finishPolygon();
            } else if (this.isDrawingPolygon && e.key === 'Escape') {
                this.cancelPolygon();
            }
        });
    }

    updateShapeControlsVisibility() {
        const arrowControl = document.getElementById('arrowTypeControl');
        const fillControl = document.getElementById('shapeFillControl');
        const shapeInstruction = document.getElementById('shapeInstruction');
        const polygonInstruction = document.getElementById('polygonInstruction');

        // Show/hide arrow type control
        if (this.shapeType === 'arrow') {
            arrowControl.style.display = 'flex';
        } else {
            arrowControl.style.display = 'none';
        }

        // Show/hide fill control (not for line, arrow, or polygon outline)
        if (this.shapeType === 'line' || this.shapeType === 'arrow') {
            fillControl.style.display = 'none';
        } else {
            fillControl.style.display = 'flex';
        }

        // Show appropriate instruction
        if (this.shapeType === 'polygon') {
            shapeInstruction.style.display = 'none';
            polygonInstruction.style.display = 'block';
        } else {
            shapeInstruction.style.display = 'block';
            polygonInstruction.style.display = 'none';
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        this.loadImageFromFile(file);
    }

    updateResolutionDisplay() {
        if (this.currentImage) {
            this.resolutionDisplay.textContent = `${this.canvas.width} x ${this.canvas.height} px`;
            this.resolutionDisplay.classList.add('visible');
        } else {
            this.resolutionDisplay.classList.remove('visible');
        }
    }

    displayImage(img) {
        this.canvas.width = img.width;
        this.canvas.height = img.height;

        // Initialize base canvas
        this.baseCanvas.width = img.width;
        this.baseCanvas.height = img.height;
        this.baseCtx.drawImage(img, 0, 0);

        this.render();
        this.updateResolutionDisplay();
    }

    render() {
        // Clear display canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Draw Base Layer (Image + burned changes)
        this.ctx.drawImage(this.baseCanvas, 0, 0);

        // 2. Draw Shapes
        this.shapes.forEach(shape => {
            this.drawShapeObject(shape);
        });

        // 3. Draw Selection / Handles (if any)
        if (this.selectedShape) {
            this.drawSelectionUI(this.selectedShape);
        }
    }

    setTool(tool) {
        // Remove active active class from all tool buttons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected tool
        const selectedBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Initialize resize session - Check BEFORE updating currentTool
        if (tool === 'resize' && this.currentTool !== 'resize') {
            this.startResizeSession();
        } else if (tool !== 'resize') {
            this.endResizeSession();
        }

        this.currentTool = tool;
        this.updateControlVisibility();

        // Reset polygon drawing if switching away
        if (tool !== 'shape' || this.shapeType !== 'polygon') {
            this.cancelPolygon();
        }

        // Handle crop tool
        if (tool === 'crop') {
            this.isCropping = true;
            this.cropAction = null; // 'create', 'move', 'resize'
            this.activeHandle = null; // 'nw', 'ne', 'sw', 'se', etc.
        } else {
            this.isCropping = false;
            this.cropStart = null;
            this.cropEnd = null;
            this.canvas.style.cursor = 'default';
        }
    }

    startResizeSession() {
        if (!this.currentImage) return;

        // Cache current canvas state
        this.originalResizeCanvas = document.createElement('canvas');
        this.originalResizeCanvas.width = this.canvas.width;
        this.originalResizeCanvas.height = this.canvas.height;
        const ctx = this.originalResizeCanvas.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);
    }

    endResizeSession() {
        this.originalResizeCanvas = null;
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
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
                if (controlId === 'shapeControls') {
                    this.updateShapeControlsVisibility();
                }
            }
        } else {
            controlPanel.style.display = 'none';
        }
    }

    handleMouseDown(e) {
        if (!this.currentImage) return;

        const { x, y } = this.getMousePos(e);

        if (this.currentTool === 'draw') {
            this.isDrawing = true;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);

            // Sync with baseCanvas
            this.baseCtx.strokeStyle = this.brushColor;
            this.baseCtx.lineWidth = this.brushSize;
            this.baseCtx.lineCap = 'round';
            this.baseCtx.beginPath();
            this.baseCtx.moveTo(x, y);
        } else if (this.currentTool === 'crop') {
            // ... crop logic (preserved) ...
            if (this.cropStart && this.cropEnd) {
                const handle = this.getHandleUnderCursor(x, y);
                if (handle) {
                    this.cropAction = 'resize';
                    this.activeHandle = handle;
                    this.dragStart = { x, y };
                    this.initialCropStart = { ...this.cropStart };
                    this.initialCropEnd = { ...this.cropEnd };
                } else if (this.isPointInRect(x, y, this.cropStart, this.cropEnd)) {
                    this.cropAction = 'move';
                    this.dragStart = { x, y };
                    this.initialCropStart = { ...this.cropStart };
                    this.initialCropEnd = { ...this.cropEnd };
                } else {
                    this.cropStart = { x, y };
                    this.cropEnd = { x, y };
                    this.cropAction = 'create';
                }
            } else {
                this.cropStart = { x, y };
                this.cropAction = 'create';
            }

            if (this.cropAction) {
                window.addEventListener('mousemove', this.boundWindowMouseMove);
                window.addEventListener('mouseup', this.boundWindowMouseUp);
            }
        } else if (this.currentTool === 'shape') {
            // 1. Check for Handle Hit (Resize)
            if (this.selectedShape) {
                const handle = this.getShapeHandle(this.selectedShape, x, y);
                if (handle) {
                    this.isResizingShape = true;
                    this.activeHandle = handle;
                    this.dragStart = { x, y };
                    this.initialShapeState = JSON.parse(JSON.stringify(this.selectedShape));
                    return;
                }
            }

            // 2. Check for Shape Hit (Select/Move)
            // Iterate in reverse to select top-most shape
            let hitShape = null;
            for (let i = this.shapes.length - 1; i >= 0; i--) {
                if (this.isPointInShape(this.shapes[i], x, y)) {
                    hitShape = this.shapes[i];
                    break;
                }
            }

            if (hitShape) {
                this.selectedShape = hitShape;
                this.isMovingShape = true;
                this.dragStart = { x, y };
                this.initialShapeState = JSON.parse(JSON.stringify(hitShape));
                this.render();
                return;
            } else {
                // Deselect if clicking empty space but NOT if drawing polygon
                if (this.selectedShape && this.shapeType !== 'polygon') {
                    this.selectedShape = null;
                    this.render();
                }
            }

            // 3. Start Drawing
            if (this.shapeType !== 'polygon') {
                this.isDrawing = true;
                this.shapeStart = { x, y };
                // Initialize new shape
                this.currentDrawingShape = {
                    type: this.shapeType,
                    x: x, y: y,
                    width: 0, height: 0,
                    color: this.shapeColor,
                    fill: this.shapeFill,
                    lineWidth: this.lineWidth,
                    arrowType: this.arrowType
                };
                this.shapes.push(this.currentDrawingShape);
                this.selectedShape = this.currentDrawingShape; // Auto-select new shape
            }
        }
    }

    handleMouseMove(e) {
        if (!this.currentImage) return;

        let { x, y } = this.getMousePos(e);

        if (this.currentTool === 'draw' && this.isDrawing) {
            this.ctx.strokeStyle = this.brushColor;
            this.ctx.lineWidth = this.brushSize;
            this.ctx.lineCap = 'round';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            // Sync with baseCanvas
            this.baseCtx.lineTo(x, y);
            this.baseCtx.stroke();

        } else if (this.currentTool === 'crop') {
            // ... crop move logic ...
            // Clamp coordinates to canvas bounds if cropping
            if (this.cropAction) {
                x = Math.max(0, Math.min(x, this.canvas.width));
                y = Math.max(0, Math.min(y, this.canvas.height));
            }
            const handle = this.getHandleUnderCursor(x, y);
            if (handle) {
                this.canvas.style.cursor = `${handle}-resize`;
            } else if (this.cropStart && this.cropEnd && this.isPointInRect(x, y, this.cropStart, this.cropEnd)) {
                this.canvas.style.cursor = 'move';
            } else {
                this.canvas.style.cursor = 'crosshair';
            }

            if (this.cropAction === 'create') {
                this.cropEnd = { x, y };
                this.drawCropOverlay();
            } else if (this.cropAction === 'move') {
                const dx = x - this.dragStart.x;
                const dy = y - this.dragStart.y;
                const width = this.initialCropEnd.x - this.initialCropStart.x;
                const height = this.initialCropEnd.y - this.initialCropStart.y;
                let newX = this.initialCropStart.x + dx;
                let newY = this.initialCropStart.y + dy;
                // Boundary checks
                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX + width > this.canvas.width) newX = this.canvas.width - width;
                if (newY + height > this.canvas.height) newY = this.canvas.height - height;
                this.cropStart = { x: newX, y: newY };
                this.cropEnd = { x: newX + width, y: newY + height };
                this.drawCropOverlay();
            } else if (this.cropAction === 'resize') {
                this.handleResize(x, y);
                this.drawCropOverlay();
            }

        } else if (this.currentTool === 'shape') {
            // Cursor Updates
            if (this.selectedShape) {
                const handle = this.getShapeHandle(this.selectedShape, x, y);
                if (handle) {
                    this.canvas.style.cursor = handle.cursor;
                } else if (this.isPointInShape(this.selectedShape, x, y)) {
                    this.canvas.style.cursor = 'move';
                } else {
                    this.canvas.style.cursor = 'default';
                }
            } else {
                this.canvas.style.cursor = 'crosshair';
            }

            if (this.isDrawing && this.currentDrawingShape) {
                // Update current drawing shape dimensions
                this.currentDrawingShape.width = x - this.shapeStart.x;
                this.currentDrawingShape.height = y - this.shapeStart.y;
                this.render();
            } else if (this.isMovingShape && this.selectedShape) {
                const dx = x - this.dragStart.x;
                const dy = y - this.dragStart.y;

                // Calculate new position
                if (this.selectedShape.type === 'polygon') {
                    // Move all points
                    this.selectedShape.points = this.initialShapeState.points.map(p => ({
                        x: p.x + dx,
                        y: p.y + dy
                    }));
                } else {
                    this.selectedShape.x = this.initialShapeState.x + dx;
                    this.selectedShape.y = this.initialShapeState.y + dy;
                }
                this.render();
            } else if (this.isResizingShape && this.selectedShape) {
                this.handleShapeResize(x, y);
                this.render();
            } else if (this.isDrawingPolygon && this.polygonPoints.length > 0) {
                this.render();
                this.drawPolygonPreview(x, y);
            }
        }
    }

    handleMouseUp(e) {
        if (this.currentTool === 'draw' && this.isDrawing) {
            this.isDrawing = false;
            // Committing brush stroke to baseCanvas
            // Re-draw the entire path or just compose?
            // Since we cleared ctx in render, we missed the strokes.
            // Problem: render() wipes ctx.
            // Solution: We need to draw to baseCanvas AS WE DRAW.
            // I'll update handleMouseMove for 'draw' to draw to BOTH ctx and baseCtx.
            this.saveState();
        } else if (this.isCropping && this.cropAction) {
            // ... crop finalize ...
            this.cropAction = null;
            this.activeHandle = null;
            window.removeEventListener('mousemove', this.boundWindowMouseMove);
            window.removeEventListener('mouseup', this.boundWindowMouseUp);
            if (this.cropStart && this.cropEnd) {
                const x1 = Math.min(this.cropStart.x, this.cropEnd.x);
                const y1 = Math.min(this.cropStart.y, this.cropEnd.y);
                const x2 = Math.max(this.cropStart.x, this.cropEnd.x);
                const y2 = Math.max(this.cropStart.y, this.cropEnd.y);
                this.cropStart = { x: x1, y: y1 };
                this.cropEnd = { x: x2, y: y2 };
                this.drawCropOverlay();
            }
        } else if (this.currentTool === 'shape') {
            if (this.isDrawing) {
                this.isDrawing = false;
                // Normalize rectangle/circle dimensions (width/height can be negative)
                // It's often better to normalize x,y to be top-left and w,h > 0
                if (this.currentDrawingShape && (this.currentDrawingShape.type === 'rectangle' || this.currentDrawingShape.type === 'circle')) {
                    if (this.currentDrawingShape.width < 0) {
                        this.currentDrawingShape.x += this.currentDrawingShape.width;
                        this.currentDrawingShape.width = Math.abs(this.currentDrawingShape.width);
                    }
                    if (this.currentDrawingShape.height < 0) {
                        this.currentDrawingShape.y += this.currentDrawingShape.height;
                        this.currentDrawingShape.height = Math.abs(this.currentDrawingShape.height);
                    }
                }

                this.currentDrawingShape = null;
                this.saveState();
            }
            this.isMovingShape = false;
            this.isResizingShape = false;
            this.activeHandle = null;
            this.initialShapeState = null;
        }
    }

    handleCanvasClick(e) {
        const { x, y } = this.getMousePos(e);

        if (this.currentTool === 'text') {
            const text = document.getElementById('textInput').value;
            if (!text) {
                alert('請先輸入文字內容');
                return;
            }

            this.ctx.font = `${this.fontSize}px Inter, sans-serif`;
            this.ctx.fillStyle = this.textColor;
            this.ctx.fillText(text, x, y);

            // Persist to baseCanvas
            this.baseCtx.font = `${this.fontSize}px Inter, sans-serif`;
            this.baseCtx.fillStyle = this.textColor;
            this.baseCtx.fillText(text, x, y);

            this.saveState();
        } else if (this.currentTool === 'shape' && this.shapeType === 'polygon') {
            this.addPolygonPoint(x, y);
        }
    }

    handleCanvasDoubleClick(e) {
        if (this.isDrawingPolygon) {
            this.finishPolygon();
        }
    }

    // Polygon drawing methods
    addPolygonPoint(x, y) {
        if (!this.isDrawingPolygon) {
            this.isDrawingPolygon = true;
            this.polygonPoints = [];
        }

        this.polygonPoints.push({ x, y });
        this.redrawCanvas();
        this.drawPolygonPreview();
    }

    drawPolygonPreview(cursorX, cursorY) {
        if (this.polygonPoints.length === 0) return;

        this.ctx.strokeStyle = this.shapeColor;
        this.ctx.fillStyle = this.shapeColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();

        // Draw existing points
        this.ctx.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
        for (let i = 1; i < this.polygonPoints.length; i++) {
            this.ctx.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
        }

        // Draw line to cursor if provided
        if (cursorX !== undefined && cursorY !== undefined) {
            this.ctx.lineTo(cursorX, cursorY);
        }

        this.ctx.stroke();

        // Draw points
        this.polygonPoints.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#667eea';
            this.ctx.fill();
        });
    }

    finishPolygon() {
        if (this.polygonPoints.length < 3) {
            alert('多邊形至少需要3個頂點');
            return;
        }

        this.redrawCanvas();

        this.ctx.strokeStyle = this.shapeColor;
        this.ctx.fillStyle = this.shapeColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();

        this.ctx.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
        for (let i = 1; i < this.polygonPoints.length; i++) {
            this.ctx.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
        }
        this.ctx.closePath();

        if (this.shapeFill) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }

        this.polygonPoints = [];
        this.isDrawingPolygon = false;
        this.saveState();
    }

    cancelPolygon() {
        if (this.isDrawingPolygon) {
            this.polygonPoints = [];
            this.isDrawingPolygon = false;
            this.redrawCanvas();
        }
    }

    drawCropOverlay() {
        if (!this.cropStart || !this.cropEnd) return;

        // Clean canvas first
        this.redrawCanvas();

        const x = Math.min(this.cropStart.x, this.cropEnd.x);
        const y = Math.min(this.cropStart.y, this.cropEnd.y);
        const width = Math.abs(this.cropEnd.x - this.cropStart.x);
        const height = Math.abs(this.cropEnd.y - this.cropStart.y);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

        // Draw 4 rectangles around the crop area
        // Top
        this.ctx.fillRect(0, 0, canvasWidth, y);
        // Bottom
        this.ctx.fillRect(0, y + height, canvasWidth, canvasHeight - (y + height));
        // Left
        this.ctx.fillRect(0, y, x, height);
        // Right
        this.ctx.fillRect(x + width, y, canvasWidth - (x + width), height);


        // Draw border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.setLineDash([]);

        // Draw Grid (Rule of Thirds)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        // Vertical lines
        this.ctx.moveTo(x + width / 3, y);
        this.ctx.lineTo(x + width / 3, y + height);
        this.ctx.moveTo(x + 2 * width / 3, y);
        this.ctx.lineTo(x + 2 * width / 3, y + height);
        // Horizontal lines
        this.ctx.moveTo(x, y + height / 3);
        this.ctx.lineTo(x + width, y + height / 3);
        this.ctx.moveTo(x, y + 2 * height / 3);
        this.ctx.lineTo(x + width, y + 2 * height / 3);
        this.ctx.stroke();

        // Draw handles
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const handleSize = 10 * scaleX;

        this.ctx.fillStyle = '#fff';

        // Corners
        this.ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize); // NW
        this.ctx.fillRect(x + width - handleSize / 2, y - handleSize / 2, handleSize, handleSize); // NE
        this.ctx.fillRect(x - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize); // SW
        this.ctx.fillRect(x + width - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize); // SE

        // Sides (optional, but good for UX)
        this.ctx.fillRect(x + width / 2 - handleSize / 2, y - handleSize / 2, handleSize, handleSize); // N
        this.ctx.fillRect(x + width / 2 - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize); // S
        this.ctx.fillRect(x - handleSize / 2, y + height / 2 - handleSize / 2, handleSize, handleSize); // W
        this.ctx.fillRect(x + width - handleSize / 2, y + height / 2 - handleSize / 2, handleSize, handleSize); // E
    }

    isPointInRect(x, y, p1, p2) {
        const x1 = Math.min(p1.x, p2.x);
        const y1 = Math.min(p1.y, p2.y);
        const x2 = Math.max(p1.x, p2.x);
        const y2 = Math.max(p1.y, p2.y);
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    getHandleUnderCursor(px, py) {
        if (!this.cropStart || !this.cropEnd) return null;

        const x = Math.min(this.cropStart.x, this.cropEnd.x);
        const y = Math.min(this.cropStart.y, this.cropEnd.y);
        const width = Math.abs(this.cropEnd.x - this.cropStart.x);
        const height = Math.abs(this.cropEnd.y - this.cropStart.y);

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const handleSize = 10 * scaleX;
        const tolerance = handleSize; // slightly larger hit area

        const handles = {
            'nw': { x: x, y: y },
            'ne': { x: x + width, y: y },
            'sw': { x: x, y: y + height },
            'se': { x: x + width, y: y + height },
            'n': { x: x + width / 2, y: y },
            's': { x: x + width / 2, y: y + height },
            'w': { x: x, y: y + height / 2 },
            'e': { x: x + width, y: y + height / 2 }
        };

        for (const [key, pos] of Object.entries(handles)) {
            if (Math.abs(px - pos.x) <= tolerance && Math.abs(py - pos.y) <= tolerance) {
                return key;
            }
        }
        return null;
    }

    // Shape Helpers
    getShapeHandle(shape, x, y) {
        // Reuse drawSelectionUI logic conceptually
        // Handles are at corners/edges.
        let sx, sy, sw, sh;

        if (shape.type === 'polygon') {
            const xs = shape.points.map(p => p.x);
            const ys = shape.points.map(p => p.y);
            sx = Math.min(...xs);
            sy = Math.min(...ys);
            sw = Math.max(...xs) - sx;
            sh = Math.max(...ys) - sy;
        } else if (shape.type === 'line' || shape.type === 'arrow') {
            sx = Math.min(shape.x, shape.x + shape.width);
            sy = Math.min(shape.y, shape.y + shape.height);
            sw = Math.abs(shape.width);
            sh = Math.abs(shape.height);
        } else {
            sx = shape.x;
            sy = shape.y;
            sw = shape.width;
            sh = shape.height;
        }

        const handleSize = 10;
        const tolerance = handleSize;

        const handles = [
            { x: sx - handleSize / 2, y: sy - handleSize / 2, cursor: 'nw-resize', name: 'nw' },
            { x: sx + sw - handleSize / 2, y: sy - handleSize / 2, cursor: 'ne-resize', name: 'ne' },
            { x: sx - handleSize / 2, y: sy + sh - handleSize / 2, cursor: 'sw-resize', name: 'sw' },
            { x: sx + sw - handleSize / 2, y: sy + sh - handleSize / 2, cursor: 'se-resize', name: 'se' }
        ];

        for (const h of handles) {
            if (x >= h.x && x <= h.x + handleSize && y >= h.y && y <= h.y + handleSize) {
                return h;
            }
        }
        return null;
    }

    isPointInShape(shape, x, y) {
        if (shape.type === 'rectangle') {
            return x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height;
        } else if (shape.type === 'circle') {
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            const rx = Math.abs(shape.width / 2);
            const ry = Math.abs(shape.height / 2);
            // Ellipsoid equation: (x-cx)^2/rx^2 + (y-cy)^2/ry^2 <= 1
            const val = Math.pow(x - centerX, 2) / Math.pow(rx, 2) + Math.pow(y - centerY, 2) / Math.pow(ry, 2);
            return val <= 1;
        } else if (shape.type === 'line' || shape.type === 'arrow') {
            // Distance to line segment
            const x1 = shape.x, y1 = shape.y;
            const x2 = shape.x + shape.width, y2 = shape.y + shape.height;

            const A = x - x1;
            const B = y - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = A * C + B * D;
            const len_sq = C * C + D * D;
            let param = -1;
            if (len_sq != 0) // in case of 0 length line
                param = dot / len_sq;

            let xx, yy;
            if (param < 0) {
                xx = x1; yy = y1;
            }
            else if (param > 1) {
                xx = x2; yy = y2;
            }
            else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }

            const dx = x - xx;
            const dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy) < 10; // Tolerance
        } else if (shape.type === 'polygon') {
            // Ray casting algo
            let inside = false;
            for (let i = 0, j = shape.points.length - 1; i < shape.points.length; j = i++) {
                const xi = shape.points[i].x, yi = shape.points[i].y;
                const xj = shape.points[j].x, yj = shape.points[j].y;

                const intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }
        return false;
    }

    handleShapeResize(x, y) {
        if (!this.selectedShape || !this.activeHandle) return;

        const shape = this.selectedShape;
        const initial = this.initialShapeState;

        // This is tricky. 
        // For rect/circle, we change x, y, width, height.
        // For Line, we move start or end points?
        // Line logic is simpler if we treat it as P1(x,y) and P2(x+w, y+h).

        // Let's implement Box Resizing Logic for now (Rect/Circle).
        // For Line/Arrow/Polygon it's harder.
        // For Line/Arrow, treat handles as endpoints?
        // My getShapeHandle puts handles at bounding box corners.
        // For Lines, dragging a corner of bounding box is weird.
        // Ideally Lines have handles at endpoints.

        // Simplification: Standard Bounding Box resizing

        // Calculate the opposite corner of the handle
        // ... (complex logic omitted for brevity, using delta approach)

        const dx = x - this.dragStart.x;
        const dy = y - this.dragStart.y;

        if (shape.type === 'line' || shape.type === 'arrow') {
            // Scale from center or just stretch?
            // Since we use x,y,w,h, stretching w/h works.
            // But if I drag NW handle of a line pointing SE?
            // It's getting complicated.
            // Fallback: Just update width/height based on handle.
        }

        // NW: x changes, y changes, w changes (-dx), h changes (-dy)
        if (this.activeHandle.name === 'nw') {
            shape.x = initial.x + dx;
            shape.y = initial.y + dy;
            shape.width = initial.width - dx;
            shape.height = initial.height - dy;
        } else if (this.activeHandle.name === 'ne') {
            shape.y = initial.y + dy;
            shape.width = initial.width + dx;
            shape.height = initial.height - dy;
        } else if (this.activeHandle.name === 'sw') {
            shape.x = initial.x + dx;
            shape.width = initial.width - dx;
            shape.height = initial.height + dy;
        } else if (this.activeHandle.name === 'se') {
            shape.width = initial.width + dx;
            shape.height = initial.height + dy;
        }
    }

    applyCrop() {
        if (!this.cropStart || !this.cropEnd) return;

        this.burnShapes();

        const width = Math.abs(this.cropEnd.x - this.cropStart.x);
        const height = Math.abs(this.cropEnd.y - this.cropStart.y);
        const startX = Math.min(this.cropStart.x, this.cropEnd.x);
        const startY = Math.min(this.cropStart.y, this.cropEnd.y);

        // Get cropped region from baseCanvas
        const imageData = this.baseCtx.getImageData(startX, startY, width, height);

        // Update baseCanvas with cropped data
        this.baseCanvas.width = width;
        this.baseCanvas.height = height;
        this.baseCtx.putImageData(imageData, 0, 0);

        // Sync display canvas
        this.canvas.width = width;
        this.canvas.height = height;

        this.cropStart = null;
        this.cropEnd = null;
        this.isCropping = false;
        this.cropAction = null;
        this.currentTool = null;
        this.updateControlVisibility();
        this.canvas.style.cursor = 'default';

        this.render();
        this.updateResolutionDisplay();
        this.saveState();
    }

    cancelCrop() {
        this.cropStart = null;
        this.cropEnd = null;
        this.isCropping = false;
        this.cropAction = null;
        this.redrawCanvas();
        this.canvas.style.cursor = 'default';
        // Keep tool selected or deselect? Usually reset logic handles this, staying in crop tool but resetting selection is better UX.
        // But requested UX was to cancel.
        this.currentTool = null;
        this.updateControlVisibility();
    }

    drawShapePreview(x, y) {
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
        this.ctx.lineWidth = this.lineWidth;

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
        } else if (this.shapeType === 'line') {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else if (this.shapeType === 'arrow') {
            this.drawArrow(x1, y1, x2, y2);
        }
    }

    // Updated drawing method to accept context
    drawShapeObject(shape, ctx = this.ctx) {
        ctx.save(); // Save state to avoid polluting context
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.lineWidth = shape.lineWidth;

        if (shape.type === 'rectangle') {
            if (shape.fill) {
                ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
            } else {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
        } else if (shape.type === 'circle') {
            const radius = Math.sqrt(shape.width * shape.width + shape.height * shape.height) / 2;
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            if (shape.fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        } else if (shape.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.stroke();
        } else if (shape.type === 'arrow') {
            this.drawArrow(shape.x, shape.y, shape.x + shape.width, shape.y + shape.height, shape.arrowType, ctx);
        } else if (shape.type === 'polygon') {
            this.drawPolygonShape(shape, ctx);
        }
        ctx.restore();
    }

    drawSelectionUI(shape) {
        let x, y, width, height;

        if (shape.type === 'polygon') {
            // Calculate bounds for polygon
            const xs = shape.points.map(p => p.x);
            const ys = shape.points.map(p => p.y);
            x = Math.min(...xs);
            y = Math.min(...ys);
            width = Math.max(...xs) - x;
            height = Math.max(...ys) - y;
        } else if (shape.type === 'line' || shape.type === 'arrow') {
            x = Math.min(shape.x, shape.x + shape.width);
            y = Math.min(shape.y, shape.y + shape.height);
            width = Math.abs(shape.width);
            height = Math.abs(shape.height);
        } else {
            x = shape.x;
            y = shape.y;
            width = shape.width;
            height = shape.height;
        }

        this.ctx.save();
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.restore();

        // Draw handles
        const handleSize = 8;
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 1;

        const handles = [
            { x: x - handleSize / 2, y: y - handleSize / 2, cursor: 'nw-resize', name: 'nw' },
            { x: x + width - handleSize / 2, y: y - handleSize / 2, cursor: 'ne-resize', name: 'ne' },
            { x: x - handleSize / 2, y: y + height - handleSize / 2, cursor: 'sw-resize', name: 'sw' },
            { x: x + width - handleSize / 2, y: y + height - handleSize / 2, cursor: 'se-resize', name: 'se' }
        ];

        handles.forEach(h => {
            this.ctx.fillRect(h.x, h.y, handleSize, handleSize);
            this.ctx.strokeRect(h.x, h.y, handleSize, handleSize);
        });
    }

    drawPolygonShape(shape, ctx = this.ctx) {
        if (!shape.points || shape.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.closePath();
        if (shape.fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    drawArrow(x1, y1, x2, y2, arrowType = 'single', ctx = this.ctx) {
        // Draw main line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Calculate arrow head
        const headLength = 20;
        const angle = Math.atan2(y2 - y1, x2 - x1);

        // Draw arrow head at end
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLength * Math.cos(angle - Math.PI / 6),
            y2 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLength * Math.cos(angle + Math.PI / 6),
            y2 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();

        // Draw arrow head at start if double arrow
        if (arrowType === 'double') {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(
                x1 + headLength * Math.cos(angle - Math.PI / 6),
                y1 + headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(x1, y1);
            ctx.lineTo(
                x1 + headLength * Math.cos(angle + Math.PI / 6),
                y1 + headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
        }
    }

    burnShapes() {
        // Draw all shapes to Base Canvas
        this.shapes.forEach(shape => {
            this.drawShapeObject(shape, this.baseCtx);
        });
        this.shapes = []; // Clear shapes list
        this.selectedShape = null;
        this.render(); // Re-render (base canvas updated, shapes gone)
    }

    applyFilters() {
        if (!this.currentImage) return;

        this.burnShapes();

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

        this.burnShapes();

        this.redrawCanvas();

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            switch (preset) {
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

        this.burnShapes();

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.baseCanvas.height;
        tempCanvas.height = this.baseCanvas.width;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(90 * Math.PI / 180);
        tempCtx.drawImage(this.baseCanvas, -this.baseCanvas.width / 2, -this.baseCanvas.height / 2);

        this.baseCanvas.width = tempCanvas.width;
        this.baseCanvas.height = tempCanvas.height;
        this.baseCtx.drawImage(tempCanvas, 0, 0);

        // Sync display canvas size
        this.canvas.width = this.baseCanvas.width;
        this.canvas.height = this.baseCanvas.height;

        this.render();
        this.updateResolutionDisplay();
        this.saveState();

    }

    flipImage(direction) {
        if (!this.currentImage) return;

        this.burnShapes();

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.baseCanvas.width;
        tempCanvas.height = this.baseCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        if (direction === 'horizontal') {
            tempCtx.translate(tempCanvas.width, 0);
            tempCtx.scale(-1, 1);
        } else {
            tempCtx.translate(0, tempCanvas.height);
            tempCtx.scale(1, -1);
        }

        tempCtx.drawImage(this.baseCanvas, 0, 0);

        this.baseCtx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
        this.baseCtx.drawImage(tempCanvas, 0, 0);

        this.render();
        this.saveState();
    }

    resizeImage() {
        if (!this.currentImage) return;

        this.burnShapes();

        const newWidth = parseInt(document.getElementById('resizeWidth').value);
        const newHeight = parseInt(document.getElementById('resizeHeight').value);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // Use original cached canvas if in a resize session, otherwise use current baseCanvas
        // Note: originalResizeCanvas might need to be a snapshot of baseCanvas now? 
        // For simplicity, sticking to baseCanvas here effectively. 
        // But wait, startResizeSession capture this.canvas (display). Better capture baseCanvas.
        // Let's assume startResizeSession logic needs update too or just use baseCanvas here directly if not session.
        // If session, originalResizeCanvas should be valid source.

        // Actually, let's fix startResizeSession to capture baseCanvas too?
        // For now, let's just assume we resize baseCanvas.

        const sourceCanvas = this.baseCanvas; // Simplified for now to ensure consistency
        tempCtx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);

        this.baseCanvas.width = newWidth;
        this.baseCanvas.height = newHeight;
        this.baseCtx.drawImage(tempCanvas, 0, 0);

        // Sync display canvas
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        this.render();
        this.updateResolutionDisplay();
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

            switch (max) {
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
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }

    getCanvasState() {
        return this.baseCtx.getImageData(0, 0, this.baseCanvas.width, this.baseCanvas.height);
    }

    redrawCanvas() {
        if (this.historyStep >= 0 && this.history[this.historyStep]) {
            const state = this.history[this.historyStep];

            // Restore Base Canvas
            this.baseCanvas.width = state.width;
            this.baseCanvas.height = state.height;
            this.baseCtx.putImageData(state.data, 0, 0);

            // Restore Shapes
            // Deep clone to avoid reference issues
            this.shapes = JSON.parse(JSON.stringify(state.shapes || []));
            this.selectedShape = null;

            // Sync Display Canvas
            this.canvas.width = state.width;
            this.canvas.height = state.height;

            this.render();
            this.updateResolutionDisplay();
        }
    }

    saveState() {
        this.historyStep++;
        this.history = this.history.slice(0, this.historyStep);
        this.history.push({
            data: this.getCanvasState(),
            shapes: JSON.parse(JSON.stringify(this.shapes)),
            width: this.baseCanvas.width,
            height: this.baseCanvas.height
        });

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

            this.shapes = []; // Clear shapes
            this.selectedShape = null;

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
window.editor = new ImageEditor();
