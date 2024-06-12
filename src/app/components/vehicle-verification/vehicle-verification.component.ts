import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OcrService } from '../../services/ocr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicle-verification',
  templateUrl: './vehicle-verification.component.html',
  styleUrls: ['./vehicle-verification.component.css']
})
export class VehicleVerificationComponent implements OnDestroy {
  selectedFile: File | null = null;
  filePreviewUrl: string | ArrayBuffer | null = null;
  extractedText: string = '';
  private ocrSubscription: Subscription | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private ocrService: OcrService
  ) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    this.processWithOCR();
  }

  processWithOCR(): void {
    if (this.selectedFile) {
      this.ocrSubscription = this.ocrService.analyzeFile(this.selectedFile).subscribe({
        next: (result) => {
          console.log('OCR result:', result);
          this.extractedText = result.analyzeResult.readResults
            .map((page: any) => page.lines.map((line: any) => line.text).join(' '))
            .join('\n');
          
          this.snackBar.open('OCR processing successful.', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error during OCR:', error);
          this.snackBar.open('Error during OCR processing.', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }

  resetForm(): void {
    this.selectedFile = null;
    this.filePreviewUrl = null;
    this.extractedText = ''; // Ensure this resets
    this.ocrSubscription?.unsubscribe(); // Clean up the subscription
  }

  ngOnDestroy(): void {
    this.ocrSubscription?.unsubscribe(); // Ensure cleanup if component is destroyed
  }
}
