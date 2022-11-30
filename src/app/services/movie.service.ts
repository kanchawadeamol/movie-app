import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movieList: any;
  pageNumber: number = 1;
  searchedMovieList: boolean = false;
  constructor(private http: HttpClient) {}

  getMovieList() {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `https://api.themoviedb.org/3/discover/movie?api_key=59458baf36700a45b24324d33c819a96&language=en-US&page=${this.pageNumber}&sort_by=popularity.desc&include_adult=false&include_video=false`
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
}
