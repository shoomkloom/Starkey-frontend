import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, NgIf],
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent {
  @ViewChild('chatWindow') chatWindowRef!: ElementRef<HTMLDivElement>;
  
  messages: { user: string, text: string, source?: string }[] = [];
  currentMessage = '';
  isWaiting = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.currentMessage?.trim() || this.isWaiting) return;
    this.isWaiting = true;

    this.messages.push({user: "You", text: this.currentMessage.trim(), source: ''});
    this.scrollToBottom();

    this.http.post<any>(`${environment.serverUrl}/api/chat`, { message: this.currentMessage }).subscribe({
      next: (response) => {
        this.isWaiting = false;
        let uniqueSources = new Set<string>();

        if (Array.isArray(response.excerpts)) {
          for (const ex of response.excerpts) {
            uniqueSources.add(ex.source);
          }
        }
        const sources = Array.from(uniqueSources).join(', ').trim();
        this.messages.push({ user: 'Assistant', text: response.summary, source: sources });
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Chat error', error);
        this.isWaiting = false;
        alert(`An error occurred while sending the message.\n\n${error.error.error}\n${error.message}`);
      }
    });

    this.currentMessage = '';

  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        const el = this.chatWindowRef.nativeElement;
        el.scrollTop = el.scrollHeight;
      } catch (err) {
        console.warn('Scroll error:', err);
      }
    }, 0);
  }
}