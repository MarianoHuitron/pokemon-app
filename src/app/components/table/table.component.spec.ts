import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Pokemon } from 'src/app/pokemon.class';
import { PokemonService } from 'src/app/pokemon.service';

import { TableComponent } from './table.component';
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
    name: "DRAGONITE",
    image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png",
    attack: 10,
    defense: 10,
    hp: 10,
    type: "n/a",
    id_author: 1
  }
]

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let service: PokemonService;


  

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      providers: [
        PokemonService,
      ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.pokemonList$ = of([...pokemonToUse]);

    service = TestBed.inject(PokemonService)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtain data from service', () => {

    const serviceSpy = spyOn(service, 'getPokemons').and.callFake(() => {
      return of([...pokemonToUse]);
    })
    
    component.ngOnInit();
    expect(serviceSpy).toHaveBeenCalled();
  });


  describe('Render', () => {
    
    it('should have  a table', () => {
      const tableElement = fixture.debugElement.queryAll(By.css('table'));
      expect(tableElement.length).toBe(1);
    });

    it('should contain the pokemon list', () => {


      const tbody = fixture.debugElement.queryAll(By.css('tbody'));
      expect(tbody.length).withContext('Check existence for tbody').toBe(1);
      const tr = tbody[0].queryAll(By.css('tr'));
      expect(tr.length).withContext('tr elements').toBe(pokemonToUse.length);

      tr.forEach((trElement: DebugElement, index) => {
        const tdElements = trElement.queryAll(By.css('td'));
        expect(tdElements.length).withContext('Number of columns td').toBe(5)
      })
    });
  });

  describe('Delete Pokemon', () => {
    it('Should to delete pokemon from server', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const spy = spyOn(service, 'delete').and.returnValue( of());
      component.delete(pokemonToUse[0]);
      expect(spy).toHaveBeenCalledOnceWith(pokemonToUse[0].id);
    });

    it('Should not delete pokemon from server', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const spy = spyOn(service, 'delete').and.returnValue( of());
      component.delete(pokemonToUse[0]);
      expect(spy).not.toHaveBeenCalledWith(pokemonToUse[0].id);
    });
  });

  describe('Edit Pokemon', () => {
  
    it('Set the edit mode: Store Pokemon & change Edit modo', () => {
      const spyPokemonSelected = spyOnProperty(service, 'pokemonSelected', 'set');
      const spyEditMode = spyOnProperty(service, 'editMode', 'set');
      component.setEdit(pokemonToUse[0]);
      expect(spyPokemonSelected).toHaveBeenCalledWith(pokemonToUse[0]);
      expect(spyEditMode).toHaveBeenCalledWith(true);
    });

  });


});
