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
  file: File | null = null;
  webLink: string = '';

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
}
