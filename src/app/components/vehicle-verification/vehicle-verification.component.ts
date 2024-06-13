import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OcrService } from '../../services/ocr.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OcrResult } from '../../interfaces/ocr-result';
import { VerifyFormComponent } from '../verify-form/verify-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';

@Component({
  selector: 'app-vehicle-verification',
  templateUrl: './vehicle-verification.component.html',
  styleUrls: ['./vehicle-verification.component.css']
})
export class VehicleVerificationComponent implements OnDestroy {
  selectedFile: File | null = null;
  filePreviewUrl: string | ArrayBuffer | null = null;
  extractedText: string = '';
  ocrForm: FormGroup;
  private ocrSubscription: Subscription | null = null;
  ocrData: OcrResult | null = null;
  policyStatus: string ='';

  constructor(
    private snackBar: MatSnackBar,
    private ocrService: OcrService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.ocrForm = this.fb.group({
      clientCompany: [''],
      userName: [''],
      idCompanyNo: [''],
      unitType: [''],
      unitSerialNo: [''],
      vehicleType: [''],
      regNo: [''],
      vinNo: [''],
      vehicleDescription: [''],
      serviceCentre: [''],
      serviceCentreTel: [''],
      authorisedTechnicianName: [''],
      date: ['']
    });
  }

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
          const extractedData = this.extractData(result);
          this.ocrForm.patchValue(extractedData);
          this.ocrData = extractedData; // Set the OCR data to be displayed
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

  extractData(result: any): OcrResult {
    // Extract the fields from the OCR result
    // This function needs to be implemented based on the OCR result structure
    const data: OcrResult = {
      clientCompany: result.clientCompany || '', 
      userName: result.userName || '',
      idCompanyNo: result.idCompanyNo || '',
      unitType: result.unitType || '',
      unitSerialNo: result.unitSerialNo || '',
      vehicleType: result.vehicleType || '',
      regNo: result.regNo || '',
      vinNo: result.vinNo || '',
      vehicleDescription: result.vehicleDescription || '',
      serviceCentre: result.serviceCentre || '',
      serviceCentreTel: result.serviceCentreTel || '',
      authorisedTechnicianName: result.authorisedTechnicianName || '',
      date: result.date || ''
    };
    return data;
  }

  

  resetForm(): void {
    this.selectedFile = null;
    this.filePreviewUrl = null;
    this.extractedText = ''; // Ensure this resets
    this.ocrForm.reset();
    this.ocrData = null; // Reset the OCR data
    this.ocrSubscription?.unsubscribe(); // Clean up the subscription
  }

  verifyForm(): void {
    const dialogRef = this.dialog.open(VerifyFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.setPolicyStatus(true);
        this.dialog.open(ResultDialogComponent, {
          data: { verified: true }
        });
      } else {
        this.setPolicyStatus(false);
        this.dialog.open(ResultDialogComponent, {
          data: { verified: false }
        });
      }
    });
  }

  setPolicyStatus(verified: boolean): void {
    this.policyStatus = verified ? 'Policy has been upgraded' : 'Policy has been downgraded';
  }

  ngOnDestroy(): void {
    this.ocrSubscription?.unsubscribe(); // Ensure cleanup if component is destroyed
  }
}
