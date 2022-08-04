import { fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Pokemon } from './pokemon.class';

import { PokemonService } from './pokemon.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('PokemonService', () => {
  let service: PokemonService;
  let http: HttpTestingController;

  const pokemonToUse: Pokemon[] = [
    {
      id: 1903,
      name: "Charmander240 Editado",
      image: "https://www.pngmart.com/files/13/Charmander-PNG-HD.png",
      attack: 100,
      defense: 100,
      hp: 100,
      type: "Dragon",
      id_author: 1
    },
    {
      id: 1907,
      name: "Pikachu",
      image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png",
      attack: 10,
      defense: 10,
      hp: 10,
      type: "n/a",
      id_author: 1
    }
  ]



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);

    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return pokemon list from bakend', () =>  {
    let result: Pokemon[] = [];
    service.getPokemons().subscribe(data => {
      result = data;
    })

    const req = http.expectOne(environment.api + '/?idAuthor=1');
    expect(req.request.method).toEqual('GET');
    req.flush(pokemonToUse);
    http.verify();
    
  });


  it('should throw if backend returns an error', () => {
    let error = false;
    service.getPokemons().subscribe({
      error: () => {
        error = true;
      },
    })

    const req = http.expectOne(environment.api + '/?idAuthor=1', 'Request');
    expect(req.request.method).toEqual('GET');
    req.flush('ERROR', {status: 500, statusText: 'Internal server error'});
    expect(error).toBeTruthy();
    http.verify();

  });


  describe('Edit mode', () => {
    
    it('should set the edit mode', () => {
      service.editMode = true;
      service.editMode$.subscribe({
        next: mode => {
          expect(mode).toBe(true);
        } 
      })
    });

  });


  describe('Filter', () => {
    
    it('Filter pokemon list', fakeAsync(() => {

      spyOn(service, 'getPokemons').and.callFake(() => {
        return of([...pokemonToUse]);
      })
      service.getPokemons().subscribe();

      service.filterPokemon('Pika').subscribe((result) => {

      })
    }));

  });

  describe('Actions', () => {

    it('Save new pokemon', () => {

      let result: Pokemon;
      service.save(pokemonToUse[0]).subscribe(data => {
        result = data;
      })

      const req = http.expectOne(environment.api + '/?idAuthor=1');
      expect(req.request.method).toEqual('POST');
      req.flush(pokemonToUse[0])
      http.verify();
    });

    it('Delete pokemon', () => {


      service.delete(pokemonToUse[0].id).subscribe(response => {
        expect(response).toEqual({"success":true,"type":"pokemon_removed","data":[]});
      });
      const req = http.expectOne(environment.api + `/${pokemonToUse[0].id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({"success":true,"type":"pokemon_removed","data":[]});
      http.verify();

    });

    it('edit pokemon', () => {

      

      service.edit(pokemonToUse[0], pokemonToUse[0].id).subscribe((response) => {
        expect(response).toEqual(response);
      })

      const req = http.expectOne(environment.api + `/${pokemonToUse[0].id}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(pokemonToUse[0]);
      http.verify();

    });

  });



  

});
