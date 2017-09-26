import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postId = null;
  constructor(private route:ActivatedRoute, private router: Router) {
    route.params.subscribe(
      params =>{
        this.postId = parseInt(params['id']);

        if (isNaN(this.postId)) {
          this.router.navigateByUrl('/404', { skipLocationChange: true });
        }
      }
    );
  }

  ngOnInit() {
    console.log(this.postId);
  }

}
