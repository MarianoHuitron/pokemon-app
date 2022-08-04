import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon } from './pokemon.class';

const url = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private _pokemonList = new BehaviorSubject<Pokemon[]>([]);
  private _pokeSelected = new BehaviorSubject<Pokemon | null>(null)
  private _filteredPokemon = new BehaviorSubject<Pokemon[]>([]);
  private _editMode = new BehaviorSubject<boolean>(false);



  constructor(private _http: HttpClient) { }



  get pokemonList$(): Observable<Pokemon[]> {
    return this._filteredPokemon.asObservable();
  }

  get editMode$(): Observable<boolean> {
    return this._editMode.asObservable();
  }

  set editMode(edit: boolean) {
    this._editMode.next(edit);
  }

  get pokemonSelected$(): Observable<Pokemon | null> {
    return this._pokeSelected.asObservable();
  }

  set pokemonSelected(pokemon: Pokemon) {
    this._pokeSelected.next(pokemon);
  }


  getPokemons(): Observable<Pokemon[]> {
    return this._http.get<Pokemon[]>(`${url}/?idAuthor=1`).pipe(
      tap(response => {
        this._pokemonList.next(response);
        this._filteredPokemon.next(response);
      })
    ) 
  }

  filterPokemon(query: string): Observable<Pokemon[]> {
   
    return this._pokemonList.pipe(
      tap(pokemons => {
        let filtered = pokemons.filter(poke => poke.name.toLowerCase().includes(query.toLowerCase()));
        this._filteredPokemon.next(filtered)
      })
    )
    
  }


  save(data: Pokemon): Observable<Pokemon> {
    return this._pokemonList.pipe(
      take(1),
      switchMap((pokemons => this._http.post<Pokemon>(`${url}/?idAuthor=1`, data).pipe(
        map(newPokemon => {
          pokemons = [...pokemons, newPokemon];
          this._pokemonList.next(pokemons);
          this._filteredPokemon.next(pokemons);
          return newPokemon;
        })
      )))
    )
  }

  delete(id: number) {
    return this._pokemonList.pipe(
      take(1),
      switchMap(pokemons => this._http.delete(`${url}/${id}`).pipe(
        map((deleted) => {
          pokemons = pokemons.filter(p => p.id !== id);
          this._pokemonList.next(pokemons);
          this._filteredPokemon.next(pokemons);
          return deleted;
        })
      ))
    )
  }

  edit(pokemon: Pokemon, id: number): Observable<Pokemon> {
    return this._pokemonList.pipe(
      take(1),
      switchMap(pokemons => this._http.put<Pokemon>(`${url}/${id}`, pokemon).pipe(
        map(updated => {
          pokemons = pokemons.map((poke) => {
            if(poke.id === id) {
              return updated;
            }
            return poke;
          })
          this._pokemonList.next(pokemons);
          this._filteredPokemon.next(pokemons);
          return updated;
        })
      ))
    )
  }

 }
