import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.css'],
})
export class FavoriteMoviesComponent implements OnInit {
  constructor(
    public movieService: MovieService,
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}
  favMovieList: any = [];
  user: any;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.favoriteMovieList();
  }

  favoriteMovieList() {
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);
    this.movieService
      .getFavoriteList(this.user.providerData[0].uid, sessionId)
      .then((res: any) => {
        this.favMovieList = res.results;
      })
      .catch((err) => {});
  }

  viewMovie(movieid: any) {
    this.router.navigate(['/movie', movieid]);
  }

  removeFromFavorite(movieId: number, event: any) {
    event.stopPropagation();
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);
    if (!this.authService.isLoggedIn) {
      this.snackbar.open('Please login to add in favorite list', '', {
        duration: 5000,
      });
    } else {
      if (sessionId === null && this.authService.isLoggedIn) {
        this.movieService.requestTokenValidation();
      } else {
        this.movieService
          .addRemoveFavoriteList(
            movieId,
            parseInt(this.authService.userData.providerData[0].uid),
            sessionId,
            false
          )
          .then(
            (res) => {
              this.snackbar.open('Removed from favorite list', '', {
                duration: 5000,
              });
              this.favoriteMovieList();
            },
            (err) => {
              console.log(err.message);
            }
          );
      }
    }
  }
}
