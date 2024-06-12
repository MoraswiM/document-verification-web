import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private serverUrl = 'http://localhost:3000/analyze'; // Node.js server URL

  constructor(private http: HttpClient) { }

  analyzeFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.serverUrl, formData);
  }
}
