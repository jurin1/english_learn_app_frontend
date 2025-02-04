import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared';
import { AuthService } from '../../auth/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Import MatPaginatorModule und PageEvent
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

interface Word {
  id: number;
  word: string;
  translation: string;
  oxford_list: string;
}

interface UserWord {
  id: number;
  word: number;
  is_known: boolean;
}

@Component({
  selector: 'app-word-database',
  standalone: true,
  imports: [
    SharedModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  templateUrl: './word-database.component.html',
  styleUrl: './word-database.component.scss',
})
export class WordDatabaseComponent implements OnInit {
  allWords: Word[] = [];
  userWords: UserWord[] = [];
  newWords: Word[] = [];
  displayedWords: Word[] = []; // Array für die aktuell angezeigten Wörter
  displayedColumns: string[] = ['word', 'translation', 'is_known']; // Spalten für die Tabelle

  pageSize = 10; // Anzahl der Wörter pro Seite
  pageIndex = 0; // Aktuelle Seite
  totalItems = 0; // Gesamtzahl der Wörter

  listOptions: string[] = ['alle','Oxford_3000', 'Oxford_5000'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService) {}
  selectedList: string = 'alle';

  ngOnInit(): void {
    this.selectedList = localStorage.getItem('filter_list') || 'alle';
    this.authService.getAllWords().subscribe((words) => {
      this.allWords = words;
      this.authService.getUserWords().subscribe((userWords) => {
        this.userWords = userWords;
        this.filterNewWords();
      });
    });
  }

  ngAfterViewInit() {
    // Initialisiere die Paginierung, nachdem die View initialisiert wurde
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updateDisplayedWords();
    });
  }

  filterNewWords(): void {
    let filteredWords = this.allWords.filter(
      (word) => !this.userWords.some((userWord) => userWord.word === word.id)
    );

    if (this.selectedList !== 'alle' && this.selectedList) {
      filteredWords = filteredWords.filter(
        (word) => word.oxford_list === this.selectedList
      );
    }

    this.newWords = filteredWords;
    this.totalItems = this.newWords.length;
    this.updateDisplayedWords();
  }

  updateDisplayedWords(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedWords = this.newWords.slice(start, end);
  }

  isKnown(wordId: number): boolean {
    return !!this.userWords.find(
      (userWord) => userWord.word === wordId && userWord.is_known
    );
  }

  updateWord(id: number, isKnown: boolean): void {
    this.authService.updateUserWord(id, isKnown).subscribe(() => {
      this.newWords = this.newWords.filter((w) => w.id !== id);
      this.updateDisplayedWords();
    });
  }

  selectList(list: string): void {
    this.selectedList = list;
    localStorage.setItem('filter_list', list);
    this.pageIndex = 0;
    this.filterNewWords();
  }
}
