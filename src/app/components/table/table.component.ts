import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/pokemon.class';
import { PokemonService } from 'src/app/pokemon.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  pokemonList$: Observable<Pokemon[]>;

  constructor(
    private _pokemonService: PokemonService
  ) { 
    this.pokemonList$ = this._pokemonService.pokemonList$;
  }

  ngOnInit(): void {

    this._pokemonService.getPokemons().subscribe();
  }


  delete(pokemon: Pokemon) {
    const choice = confirm(`¿Eliminar ${pokemon.name} de la lista?`);
    if(choice) {
      this._pokemonService.delete(pokemon.id).subscribe();
    }
  }

  setEdit(pokemon: Pokemon) {
    this._pokemonService.pokemonSelected = pokemon;
    this._pokemonService.editMode = true;
  }

  
}
