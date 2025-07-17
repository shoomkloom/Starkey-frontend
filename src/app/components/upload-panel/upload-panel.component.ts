import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-panel.component.html',
  styleUrl: './upload-panel.component.css'
  })
export class UploadPanelComponent {
  webLink: string = '';
  selectedFileName: string = '';

  constructor(private http: HttpClient) {}

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;

      const formData = new FormData();
      formData.append('file', file);

      this.http.post('http://localhost:3000/api/upload', formData).subscribe({
        next: response => console.log('Upload successful', response),
        error: error => console.error('Upload error', error)
      });
    }
  }
}
