import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map } from 'rxjs';
import { PokemonService } from 'src/app/pokemon.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchControl: FormControl = new FormControl()

  constructor(
    private _pokemonService: PokemonService
  ) { }

  ngOnInit(): void {

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      map(query => {
        this._pokemonService.filterPokemon(query).subscribe();
      })
    ).subscribe();

  }


  addNew() {
    this._pokemonService.editMode = true;
  }

}
