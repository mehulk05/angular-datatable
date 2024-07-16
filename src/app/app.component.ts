import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Api, Config } from 'datatables.net';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  posts: any = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };

    // Fetch initial data
    this.fetchData();
  }

  fetchData(): void {
    this.http.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((posts: any) => {
        this.posts = posts;
        this.dtTrigger.next(null);
      });
  }

  searchPosts(): void {
    if (this.searchTerm.trim() === '') {
      this.fetchData(); // If search term is empty, fetch all data
    } else {
      this.http.get(`https://jsonplaceholder.typicode.com/posts?title_like=${this.searchTerm}`)
        .subscribe((posts: any) => {
          this.posts = posts;
          this.rerender();
        });
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}