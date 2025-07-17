import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent {
  messages: string[] = [];
  currentMessage = '';

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.messages.push(this.currentMessage.trim());
      this.currentMessage = '';
    }
  }
}