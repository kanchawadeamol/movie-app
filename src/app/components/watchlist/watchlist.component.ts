import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  constructor(
    public movieService: MovieService,
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}
  watchList: any = [];
  user: any;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.myWatchList();
  }

  myWatchList() {
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);
    this.movieService
      .getWatchList(this.user.providerData[0].uid, sessionId)
      .then((res: any) => {
        this.watchList = res.results;
      })
      .catch((err) => {});
  }

  viewMovie(movieid: any) {
    this.router.navigate(['/movie', movieid]);
  }

  removeFromWatchList(movieId: number, event: any) {
    event.stopPropagation();
    const sessionId = JSON.parse(localStorage.getItem('sessionId')!);

    if (sessionId === null) {
      this.movieService.requestTokenValidation();
    } else {
      this.movieService
        .addRemoveWatchList(
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
            this.myWatchList();
          },
          (err) => {
            console.log(err.message);
          }
        );
    }
  }
}
