import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload-panel',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './upload-panel.component.html',
  styleUrl: './upload-panel.component.css'
  })
export class UploadPanelComponent {
  webLink: string = '';
  selectedFileName: string = '';
  //@@differences: string[] = [];

  constructor(private http: HttpClient) {}

  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;

      const formData = new FormData();
      formData.append('file', file);

      this.http.post(`${environment.serverUrl}/api/upload`, formData).subscribe({
        next: response => {
          console.log('Upload successful', response)
          this.selectedFileName = '';
          alert('File uploaded successfully!');
        },
        error: error => {
          console.error('Upload error', error)
          alert(`File upload failed!\n\n${error.message || error}`);
        }
      });
    }
  }

  /*@@
  uploadLink() {
    if (this.webLink.trim()) {
      this.http.post<{message: string; differences?: string[];}>(`${environment.serverUrl}/api/link`, { link: this.webLink }).subscribe({
        next: response => {
          console.log('Link upload successful', response);

          if (response.differences && Array.isArray(response.differences)) {
            this.differences = response.differences;
            alert('Link already exists. Differences were detected!');
          } 
          else {
            this.webLink = '';
            this.differences = [];
            alert('Link uploaded successfully!');
          }
          
        },
        error: error => {
          console.error('Link upload error', error);
          alert(`Link upload failed!\n\n${error.message || error}`);
        }
      });
    } 
    else {
      console.error('Please enter a valid link.');
      alert('Please enter a valid link.');
    }
  }
    @@*/
    uploadLink() {
    if (this.webLink.trim()) {
      this.http.post('http://localhost:3000/api/link', { link: this.webLink }).subscribe({
        next: response => {
          console.log('Link upload successful', response);
          this.webLink = '';
          alert('Link uploaded successfully!');
        },
        error: error => {
          console.error('Link upload error', error);
          alert(`Link upload failed!\n\n${error.error.error || error}`);
        }
      });
    } 
    else {
      console.error('Please enter a valid link.');
      alert('Please enter a valid link.');
    }
  }
}
