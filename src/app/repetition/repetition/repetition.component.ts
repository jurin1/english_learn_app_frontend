import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared';

@Component({
  selector: 'app-repetition',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './repetition.component.html',
  styleUrl: './repetition.component.scss',
})
export class RepetitionComponent {}
