interface BoundingBox {  
    boundingBox: string;  
    text?: string;  
}  
  
interface Word extends BoundingBox {}  
  
interface Line extends BoundingBox {  
    words: Word[];  
}  
  
interface Region extends BoundingBox {  
    lines: Line[];  
}  
  
interface OCRResponse {  
    language: string;  
    textAngle: number;  
    orientation: string;  
    regions: Region[];  
    modelVersion: string;  
}