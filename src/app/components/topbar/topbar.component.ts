import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit {
  searchText: string = '';
  constructor(public movieService: MovieService, private router: Router) {}

  ngOnInit(): void {}

  searchMovie() {
    this.router.navigate(['/home']);
    this.movieService
      .searchMovie(this.searchText)
      .then((res: any) => {
        this.movieService.movieList = res.results;
        this.movieService.searchedMovieList = true;
      })
      .catch((err) => {});
  }

  searchOnEnter(e: any) {
    if (e.keyCode === 13) {
      this.searchMovie();
    }
  }
}
