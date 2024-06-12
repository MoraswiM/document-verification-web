import { HttpClient, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  public apiUrl = 'https://hack24-verify.cognitiveservices.azure.com/vision/v3.2/ocr?detectOrientation=true'; // Updated API endpoint

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': 'dcadc12c28d74ddea2e86826907b0c0b', // Replace with your subscription key
      'Content-Type': 'application/octet-stream' // Content type for binary data
    });

    return this.http.post<any>(this.apiUrl, file, {
      headers: headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
