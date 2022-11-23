import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Charity, User } from '@charity-app-production/api-interfaces';
import { CharitiesApiService } from '../utils/charities-api.service';
import { CurrentUserService } from '../utils/current-user.service';
@Component({
  selector: 'charity-app-production-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  charities: Charity[] = [];
  currentSearch: Charity[] = [];
  user!: User;
  options: string[] = [];
  tags: string[] = [];
  currentTag: string = '';
  formValue = '';
  formDisabled = true;

  constructor(
    private api: CharitiesApiService,
    private userService: CurrentUserService,
    private router: Router
  ) { }

  checkValidity() {
    const search = this.formValue.toLowerCase();
    this.currentSearch = this.charities.filter((charity) => {
      return (this.currentTag === '')
        ? charity.name.toLowerCase().includes(search)//if no tag is specified
        : charity.tags.includes(this.currentTag) && charity.name.toLowerCase().includes(search)
    });
    //--Updating suggested search options--
    this.options = this.currentSearch.map(e => e.name);
  }

  ngOnInit(): void {
    this.userService
      .setUser()
      .then(() => {
        this.charities = this.currentSearch = [...this.api.db].sort(
          () => 0.5 - Math.random()
        );
        //-----------------------Previous Version----------------------------
        /* var start = performance.now();
        this.options = this.charities.map((el) => el.name).sort();
        //Extracting all the available tags from charities to use as filter
        const allTags = this.charities.map((el) => el.tags).reduce((acc, e) => acc = [...e, ...acc], []);
        const uniqueTags = new Set([...allTags]);//Romoving duplicates by converting to Set
        this.tags = Array.from(uniqueTags).sort();//Converting back to array
        var end = performance.now(); */
        //-----------------------New Version---------------------------------
        var start = performance.now();
        const uniqueTags = new Set<string>();
        this.charities.forEach((el) => {
          this.options.push(el.name);
          el.tags.map(tag => uniqueTags.add(tag));
        });
        this.tags = Array.from(uniqueTags).sort();
        var end = performance.now();
        //-------------------------------------------------------------------
        console.log("Speed performance: ", (end - start));
        this.user = this.userService.currentUser;
      })
      .catch((e) => console.log(e));
  }
}
