import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { PokemonService } from 'src/app/pokemon.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let service: PokemonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [PokemonService],
      imports: [HttpClientModule, ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PokemonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render', () => {

    it('should have a title', () => {
      const titleElement = fixture.debugElement.queryAll(By.css('h1'));
      expect(titleElement.length).toBe(1);
      expect(titleElement[0].nativeElement.innerHTML).toBe('Listado de Pokemon');
    });

    it('should have an input search', () => {
      const input = fixture.debugElement.queryAll(By.css('input'));
      expect(input.length).toBe(1);
    })

    it('should have a button to add pokemon', () => {
      const btn = fixture.debugElement.queryAll(By.css('button[data-test="btn-add"]'));
      expect(btn.length).toBe(1);
      const span = btn[0].queryAll(By.css('span'));
      expect(span.length).toBe(1);
      expect(span[0].nativeElement.innerHTML).toBe('Nuevo');
    });
  })


  describe('Add button action', () => {
    
    it('should call editMode from service', () => {
      const spy = spyOnProperty(service, 'editMode', 'set');
      component.addNew();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('Search', () => {
    
    it('should create a form control', () => {
      expect(component.searchControl).toBeTruthy();
    });

  });

});
