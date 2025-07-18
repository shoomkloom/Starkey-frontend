import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  
  openaiKey = '';
  modelName = 'gpt-4o';
  historyLength = 10;
  temperature = 0.2;
  numTopFiles = 10;
  numTopLinks = 5;
  diffCheckIntervalId: any;
  
  constructor(private http: HttpClient) {}

  ngOnDestroy() {
    if (this.diffCheckIntervalId) {
      clearInterval(this.diffCheckIntervalId);
    }
  }

  apply() {
    const payload = {
      openaiKey: this.openaiKey,
      modelName: this.modelName,
      historyLength: this.historyLength,
      temperature: this.temperature,
      numTopFiles: this.numTopFiles,
      numTopLinks: this.numTopLinks,
    };

    // Send to backend
    this.http.post(`${environment.serverUrl}/api/sysparams`, payload).subscribe({
      next: res => {
        console.log('Uploaded successfully', res)
        alert('System parameters updated successfully!');
      },
      error: err => {
        console.error('Error uploading', err)
        alert(`System parameters update failed!\n\n${err.message || err}`);
      }
    });

    try{
      // Save as JSON file locally
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:]/g, '').replace('T', '_').substring(0, 15);
      const filename = `sysparams_${timestamp}.json`;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;

      // Emulate folder by prepending Sysparams/ (not enforced by browser)
      a.setAttribute('download', `${filename}`);
      a.click();
      URL.revokeObjectURL(a.href);
    }
    catch (e) {
      console.error('Error saving file', e);
    }

    //Start timer for automatic diffchecks
    if (this.diffCheckIntervalId) {
      clearInterval(this.diffCheckIntervalId);
    }
    this.diffCheckIntervalId = setInterval(() => {
      this.http.get<{ message: string }>(`${environment.serverUrl}/api/diffcheck`).subscribe({
        next: response => {
            alert('Differences detected in All Diff Check!');
        },
        error: error => {
          console.error('Diff Check error', error);
          alert(`Diff Check error!\n\n${error.message || error}`);
        }
      });
    }, 60000 * 60); // Check every hour
  }

  load() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`File selected: ${file.name}`);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result as string);
          this.openaiKey = obj.openaiKey || '';
          this.modelName = obj.modelName || '';
          this.historyLength = obj.historyLength ?? 0;
          this.temperature = obj.temperature ?? 0.7;
          this.numTopFiles = obj.numTopFiles ?? 0;
          this.numTopLinks = obj.numTopLinks ?? 0;
        } 
        catch (e) {
          console.error('Failed to parse JSON:', e);
        }
      };
      reader.readAsText(file);
    }
  }

  isFormValid(): boolean {
    return (
      this.openaiKey.trim() !== '' &&
      this.modelName.trim() !== '' &&
      this.historyLength > 0 &&
      this.temperature >= 0 &&
      this.numTopFiles > 0 &&
      this.numTopLinks > 0
    );
  }
}