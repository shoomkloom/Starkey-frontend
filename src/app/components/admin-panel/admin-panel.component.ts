import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  openApiKey = '';
  modelName = '';
  historyLength = 5;
  temperature = 0.7;
  numTopFiles = 3;
  numTopLinks = 2;
}