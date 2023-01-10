import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  filters: string[] = ['Popular', 'Top Rated', 'Upcoming'];
  urlRequestToken: string = '';
  requestTokenApproved: boolean = false;

  constructor(
    public movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.movieList();

    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.urlRequestToken = params['request_token'];
        this.requestTokenApproved = params['approved'];
      }
    });

    if (this.requestTokenApproved) {
      localStorage.setItem(
        'requestToken',
        JSON.stringify(this.urlRequestToken)
      );
      this.movieService.createSession(this.urlRequestToken).then(
        (response) => {
          localStorage.setItem(
            'sessionId',
            JSON.stringify(response.session_id)
          );
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log('session not created');
    }
  }

  filter(event: any) {
    this.movieService.movieFilter = event.value;
    this.movieList();
  }

  prevPage() {
    this.movieService.pageNumber -= 1;
    this.movieList();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  nextPage() {
    this.movieService.pageNumber += 1;
    this.movieList();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  movieList() {
    this.movieService
      .getMovieList()
      .then((res: any) => {
        this.movieService.movieList = res.results;
        this.movieService.totalPages = res.total_pages;
      })
      .catch((err) => {});
  }

  viewMovie(movieid: any) {
    this.router.navigate(['/movie', movieid]);
  }
}
