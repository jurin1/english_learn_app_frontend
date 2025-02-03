import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
})
export class LearningComponent {}
