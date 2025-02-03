import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared';
import { AuthService } from '../../auth/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder } from '@angular/forms';

interface Word {
  id: number;
  word: string;
}

interface UserWord {
  id: number;
  word: number;
  is_known: boolean;
}
@Component({
  selector: 'app-word-database',
  standalone: true,
  imports: [SharedModule, MatTableModule, MatCheckboxModule],
  templateUrl: './word-database.component.html',
  styleUrl: './word-database.component.scss',
})
export class WordDatabaseComponent {
  allWords: Word[] = [];
  userWords: UserWord[] = [];
  displayedColumns: string[] = ['word', 'is_known'];

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.authService.getAllWords(6).subscribe((words) => {
      this.allWords = words;
    });
    this.authService.getUserWords().subscribe((userWords) => {
      this.userWords = userWords;
    });
  }
  isKnown(wordId: number): boolean {
    return !!this.userWords.find(
      (userWord) => userWord.word === wordId && userWord.is_known
    );
  }
  updateWord(word: Word, event: any): void {
    this.authService
      .updateUserWord(word.id, event.checked)
      .subscribe((userWord) => {
        const index = this.userWords.findIndex(
          (userWord) => userWord.word === word.id
        );
        if (index !== -1) {
          this.userWords[index] = userWord;
        } else {
          this.userWords.push(userWord);
        }
      });
  }
}
