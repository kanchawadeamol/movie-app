import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RequestTokenInterface, SessionIdInterface } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movieList: any;
  pageNumber: number = 1;
  totalPages: number = 1;
  searchedMovieList: boolean = false;
  movieFilter: string = 'popular';

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  getMovieList() {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://api.themoviedb.org/3/movie/${this.movieFilter}?api_key=59458baf36700a45b24324d33c819a96&language=en-US&page=${this.pageNumber}`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  searchMovie(searchText: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://api.themoviedb.org/3/search/movie?api_key=59458baf36700a45b24324d33c819a96&query=${searchText}&language=en-US&page=${this.pageNumber}&include_adult=false`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  movieDetails(movieId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=59458baf36700a45b24324d33c819a96&language=en-US`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  requestToken() {
    return new Promise<RequestTokenInterface>((resolve, reject) => {
      this.http
        .get(
          `https://api.themoviedb.org/3/authentication/token/new?api_key=59458baf36700a45b24324d33c819a96`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  requestTokenValidation() {
    this.requestToken().then(
      (response) => {
        window.open(
          `https://www.themoviedb.org/authenticate/${response?.request_token}?redirect_to=https://movie-app-ak24.web.app/home`,
          '_self'
        );
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  createSession(requestToken: string) {
    return new Promise<SessionIdInterface>((resolve, reject) => {
      this.http
        .post(
          `https://api.themoviedb.org/3/authentication/session/new?api_key=59458baf36700a45b24324d33c819a96`,
          {
            request_token: requestToken,
          }
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  addRemoveFavoriteList(
    movieId: number,
    userId: number,
    sessionId: string,
    isFavorite: boolean
  ) {
    const favoriteData = {
      media_type: 'movie',
      media_id: movieId,
      favorite: isFavorite,
    };
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };

    return new Promise((resolve, reject) => {
      this.http
        .post(
          `https://api.themoviedb.org/3/account/${userId}/favorite?api_key=59458baf36700a45b24324d33c819a96&session_id=${sessionId}`,
          favoriteData,
          { headers }
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
            this.snackbar.open(err.message, '', { duration: 5000 });
          }
        );
    });
  }

  getFavoriteList(userId: string, sessionId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `
          https://api.themoviedb.org/3/account/${userId}/favorite/movies?api_key=59458baf36700a45b24324d33c819a96&session_id=${sessionId}&language=en-US&sort_by=created_at.asc&page=1`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  addRemoveWatchList(
    movieId: number,
    userId: number,
    sessionId: string,
    isInWatchList: boolean
  ) {
    const watchListData = {
      media_type: 'movie',
      media_id: movieId,
      watchlist: isInWatchList,
    };
    const headers = { 'Content-Type': 'application/json;charset=utf-8' };

    return new Promise((resolve, reject) => {
      this.http
        .post(
          `https://api.themoviedb.org/3/account/${userId}/watchlist?api_key=59458baf36700a45b24324d33c819a96&session_id=${sessionId}`,
          watchListData,
          { headers }
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
            this.snackbar.open(err.message, '', { duration: 5000 });
          }
        );
    });
  }

  getWatchList(userId: string, sessionId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `
          https://api.themoviedb.org/3/account/${userId}/watchlist/movies?api_key=59458baf36700a45b24324d33c819a96&session_id=${sessionId}&language=en-US&sort_by=created_at.asc&page=1`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getVideos(movieId: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=59458baf36700a45b24324d33c819a96&language=en-US`
        )
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}
