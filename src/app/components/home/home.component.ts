import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieList();
  }

  prevPage() {
    this.movieService.pageNumber -= 1;
    this.movieList();
  }
  nextPage() {
    this.movieService.pageNumber += 1;
    this.movieList();
  }

  movieList() {
    this.movieService
      .getMovieList()
      .then((res: any) => {
        this.movieService.movieList = res.results;
        console.log(res);
      })
      .catch((err) => {});
  }

  viewMovie(movieid: any) {
    this.router.navigate(['/movie', movieid]);
  }
}
