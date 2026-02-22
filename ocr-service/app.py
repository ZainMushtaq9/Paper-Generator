"""
ExamGen AI — Python OCR Microservice
Handles scanned PDF processing with Tesseract + OpenCV
"""

from flask import Flask, request, jsonify
import os
import json
import tempfile
import base64

app = Flask(__name__)

# Try importing OCR libraries (optional — use stubs if not installed)
try:
    import cv2
    import numpy as np
    import pytesseract
    from pdf2image import convert_from_path
    import pdfplumber
    from PIL import Image
    OCR_AVAILABLE = True
    print("✅ OCR libraries loaded successfully")
except ImportError as e:
    OCR_AVAILABLE = False
    print(f"⚠️  OCR libraries not fully installed: {e}")
    print("   Install with: pip install pytesseract opencv-python pdf2image pdfplumber Pillow")


def preprocess_image(img):
    """Apply preprocessing to improve OCR accuracy."""
    if not OCR_AVAILABLE:
        return img
    # Convert PIL to OpenCV
    img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    # Grayscale
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    # Deskew (simple threshold for rotation detection)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Denoise
    denoised = cv2.medianBlur(thresh, 3)
    # Contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    return Image.fromarray(enhanced)


def detect_content_type(text):
    """Classify text content type based on patterns."""
    text_lower = text.lower().strip()
    # Formula detection
    formula_patterns = ['=', 'sin', 'cos', 'tan', 'log', 'sqrt', '∑', '∫', 'dx', 'dy', 'mg', 'kg', 'm/s', '%']
    if any(p in text_lower for p in formula_patterns) and len(text) < 200:
        return 'formula'
    # Definition detection
    if any(text_lower.startswith(p) for p in ['definition:', 'define:', 'is defined as', 'refers to']):
        return 'definition'
    # Example detection
    if any(text_lower.startswith(p) for p in ['example', 'e.g.', 'for example', 'example:']):
        return 'example'
    # Heading detection (short, capitalized)
    if len(text) < 80 and text[0].isupper() and text.count('\n') == 0:
        return 'heading'
    return 'paragraph'


def detect_chapter(text, current_chapter):
    """Detect if text is a chapter/unit heading."""
    text_lower = text.lower().strip()
    chapter_keywords = ['chapter', 'unit', 'chapter:', 'unit:']
    for kw in chapter_keywords:
        if text_lower.startswith(kw) and len(text) < 100:
            return text.strip()
    return current_chapter


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'ocr_available': OCR_AVAILABLE,
        'service': 'ExamGen AI OCR Microservice',
        'version': '1.0.0'
    })


@app.route('/process', methods=['POST'])
def process_pdf():
    """
    Process a PDF file and extract text content with page mapping.
    
    Request: multipart/form-data with:
      - file: PDF or image file
      - language: 'eng' or 'urd' (default: 'eng')
      - mode: 'ocr' or 'text' (default: auto-detect)
    
    Response: {
      pages: [{ pageNumber, text, confidence, contentType }],
      totalPages: int,
      language: str,
      extractionMethod: str
    }
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    language = request.form.get('language', 'eng')
    
    if not OCR_AVAILABLE:
        return jsonify({
            'error': 'OCR libraries not installed',
            'pages': [],
            'totalPages': 0,
            'language': language,
            'extractionMethod': 'unavailable',
            'message': 'Run: pip install pytesseract opencv-python pdf2image pdfplumber Pillow'
        }), 503

    results = []
    extraction_method = 'ocr'
    
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        # Try text extraction first (faster, more accurate for text PDFs)
        try:
            with pdfplumber.open(tmp_path) as pdf:
                text_pages = []
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ''
                    if text.strip():
                        text_pages.append({
                            'pageNumber': i + 1,
                            'text': text.strip(),
                            'confidence': 0.98,
                        })

                if len(text_pages) > 0:
                    extraction_method = 'text_extraction'
                    for page_data in text_pages:
                        results.append({
                            'pageNumber': page_data['pageNumber'],
                            'text': page_data['text'],
                            'confidence': page_data['confidence'],
                            'contentType': detect_content_type(page_data['text']),
                        })
        except Exception:
            pass

        # Fall back to OCR if no text extracted
        if len(results) == 0:
            extraction_method = 'ocr'
            lang_code = 'urd+eng' if language == 'urdu' else 'eng'
            
            images = convert_from_path(tmp_path, dpi=200)
            
            for i, img in enumerate(images):
                processed = preprocess_image(img)
                
                # Get confidence data
                data = pytesseract.image_to_data(
                    processed,
                    lang=lang_code,
                    output_type=pytesseract.Output.DICT
                )
                
                text = pytesseract.image_to_string(processed, lang=lang_code)
                
                # Calculate confidence
                confidences = [int(c) for c in data['conf'] if int(c) > 0]
                avg_conf = sum(confidences) / len(confidences) if confidences else 0
                
                results.append({
                    'pageNumber': i + 1,
                    'text': text.strip(),
                    'confidence': avg_conf / 100,
                    'contentType': detect_content_type(text),
                })

    finally:
        os.unlink(tmp_path)

    return jsonify({
        'pages': results,
        'totalPages': len(results),
        'language': language,
        'extractionMethod': extraction_method,
    })


@app.route('/index', methods=['POST'])
def index_content():
    """
    Index extracted text to detect chapters, topics, and content types.
    
    Request: { pages: [...] }
    Response: { indexed: [{ page, chapter, topic, contentType, text }] }
    """
    data = request.get_json()
    pages = data.get('pages', [])
    
    indexed = []
    current_chapter = 'General'
    current_topic = None
    
    for page in pages:
        text = page.get('text', '')
        page_num = page.get('pageNumber', 1)
        
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect chapter
            new_chapter = detect_chapter(line, current_chapter)
            if new_chapter != current_chapter:
                current_chapter = new_chapter
                current_topic = None
                continue
            
            # Detect topic (sub-heading)
            content_type = detect_content_type(line)
            if content_type == 'heading' and len(line) > 5:
                current_topic = line
            
            if len(line) > 20:  # Skip very short lines
                indexed.append({
                    'pageNumber': page_num,
                    'chapterName': current_chapter,
                    'topicName': current_topic,
                    'textContent': line,
                    'contentType': content_type,
                    'confidence': page.get('confidence', 0.8),
                })
    
    return jsonify({'indexed': indexed, 'total': len(indexed)})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 OCR Microservice starting on port {port}")
    print(f"📊 OCR Available: {OCR_AVAILABLE}")
    app.run(host='0.0.0.0', port=port, debug=False)
