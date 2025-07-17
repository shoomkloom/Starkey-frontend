import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadPanelComponent } from './components/upload-panel/upload-panel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ChatPanelComponent } from './components/chat-panel/chat-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, UploadPanelComponent, AdminPanelComponent, ChatPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}