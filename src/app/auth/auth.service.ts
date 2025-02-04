import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map, of } from 'rxjs';

interface LoginResponse {
  access: string;
  refresh: string;
}

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login/';
  private allWordsUrl = 'http://localhost:8000/api/words/';
  private userWordsUrl = 'http://localhost:8000/api/user-word-progress/';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private allWordsKey = 'all_words';
  private allWordsTimestampKey = 'all_words_timestamp';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<LoginResponse>(this.apiUrl, credentials, { headers })
      .pipe(
        tap((response) => {
          this.setToken(response.access, response.refresh);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  setToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }
  getAllWords(updateIntervalWeeks: number = 2): Observable<Word[]> {
    const storedWords = localStorage.getItem(this.allWordsKey);
    const storedTimestamp = localStorage.getItem(this.allWordsTimestampKey);

    if (storedWords && storedTimestamp) {
      const timestamp = new Date(storedTimestamp);
      const now = new Date();
      const timeDiff = now.getTime() - timestamp.getTime();
      const weeksDiff = timeDiff / (1000 * 60 * 60 * 24 * 7);

      if (weeksDiff < updateIntervalWeeks) {
        return of(JSON.parse(storedWords));
      }
    }
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Word[]>(this.allWordsUrl, { headers: headers }).pipe(
      tap((words) => {
        localStorage.setItem(this.allWordsKey, JSON.stringify(words));
        localStorage.setItem(this.allWordsTimestampKey, new Date().toString());
      })
    );
  }
  getUserWords(): Observable<UserWord[]> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserWord[]>(this.userWordsUrl, { headers: headers });
  }
  updateUserWord(word: number, isKnown: boolean): Observable<UserWord> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<UserWord>(
      this.userWordsUrl,
      { word: word, is_known: isKnown },
      { headers }
    );
  }
}
