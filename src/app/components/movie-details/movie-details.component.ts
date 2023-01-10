import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  movieId: string | null = '';
  favMovieList: any = [];
  user: any = [];
  isFavorite: boolean = false;
  isInWatchList: boolean = false;
  trailerKey: string = '';
  videos: any = [];

  constructor(
    public movieService: MovieService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.movieId = this.route.snapshot.paramMap.get('movieid');
    if (this.movieId !== null) {
      this.movieService
        .movieDetails(this.movieId)
        .then((res: any) => {
          this.movie = res;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.checkFavorite();
    this.checkWatchList();
  }

  addOrRemoveFavorite(movieId: number) {
    const addOrRemoveValue = this.isFavorite ? false : true;
    const message = this.isFavorite
      ? 'Removed from favorite list'
      : 'Added in favorite list';
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
            addOrRemoveValue
          )
          .then(
            (res) => {
              this.snackbar.open(message, '', {
                duration: 5000,
              });
              this.checkFavorite();
            },
            (err) => {
              console.log(err.message);
            }
          );
      }
    }
  }

  addOrRemoveWatchList(movieId: number) {
    const addOrRemoveWatchList = this.isInWatchList ? false : true;
    const message = this.isInWatchList
      ? 'Removed from watch list'
      : 'Added in watch list';
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);

    if (sessionId === null) {
      this.movieService.requestTokenValidation();
    } else {
      this.movieService
        .addRemoveWatchList(
          movieId,
          parseInt(this.authService.userData.providerData[0].uid),
          sessionId,
          addOrRemoveWatchList
        )
        .then(
          (res) => {
            this.snackbar.open(message, '', {
              duration: 5000,
            });
            this.checkWatchList();
          },
          (err) => {
            console.log(err.message);
          }
        );
    }
  }

  checkFavorite() {
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);
    this.movieService
      .getFavoriteList(this.user.providerData[0].uid, sessionId)
      .then((res: any) => {
        res.results.forEach((element: any) => {
          if (element.id == this.movieId) {
            this.isFavorite = true;
          } else {
            this.isFavorite = false;
          }
        });
      })
      .catch((err) => {});
  }

  checkWatchList() {
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);
    this.movieService
      .getWatchList(this.user.providerData[0].uid, sessionId)
      .then((res: any) => {
        res.results.forEach((element: any) => {
          if (element.id == this.movieId) {
            this.isInWatchList = true;
          } else {
            this.isInWatchList = false;
          }
        });
      })
      .catch((err) => {});
  }

  openTrailor(movieId: string) {
    this.movieService
      .getVideos(movieId)
      .then((res: any) => {
        this.videos = res.results;
        const trailorArray = this.videos.filter(
          (data: any) =>
            data.type == 'Trailer' &&
            data.site == 'YouTube' &&
            data.name == 'Official Teaser Trailer'
        );

        this.trailerKey = trailorArray[0].key;
        window.open(`https://www.youtube.com/watch?v=${this.trailerKey}`);
      })
      .catch((err) => {});
  }
}
