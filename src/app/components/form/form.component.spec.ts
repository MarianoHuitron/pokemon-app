import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Pokemon } from 'src/app/pokemon.class';
import { PokemonService } from 'src/app/pokemon.service';

import { FormComponent } from './form.component';

const pokeToUse: Pokemon =   {
  id: 1903,
  name: "Charmander240 Editado",
  image: "https://www.pngmart.com/files/13/Charmander-PNG-HD.png",
  attack: 100,
  defense: 100,
  hp: 100,
  type: "Dragon",
  id_author: 1,
  idAuthor: 1
};



describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let service: PokemonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      providers: [PokemonService],
      imports: [HttpClientModule, ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PokemonService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Render', () => {
    
    it('should contain a form', () => {

      expect(component.form.get('name')).toBeTruthy();
      expect(component.form.get('image')).toBeTruthy();
      expect(component.form.get('attack')).toBeTruthy();
      expect(component.form.get('defense')).toBeTruthy();

    });


    it('name should be required', () => {
      const control = component.form.get('name');
      control?.setValue('');
      expect(control?.invalid).toBeTruthy();
    });
    
    it('image should be required', () => {
      const control = component.form.get('image');
      control?.setValue('');
      expect(control?.invalid).toBeTruthy();
    });

    it('should to display the form when show is valid', () => {
      component.show = of(true);
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('.form-container'));
      expect(element).toBeTruthy();
    });

    it('hide the form when show is false', () => {
      component.show = of(false);
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('.form-container'));
      expect(element).toBeFalsy();
    });

  });


  describe('Cancel button', () => {
    it('should to call service to change edit mode', () => {

      const spy = spyOnProperty(service, 'editMode', 'set');
      component.cancel();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(false);
      
    });

    it('should to reset form', () => {
      const spy = spyOn(component.form, 'reset');
      component.cancel();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

   describe('Patch form', () => {
     
      it('should patch form with the pokemon data', () => {

        const spy = spyOnProperty(service, 'pokemonSelected$', 'get').and.returnValue(of(pokeToUse));
        const spyPathcValue = spyOn(component.form, 'patchValue');
        component.ngOnInit()
        expect(spy).toHaveBeenCalled();
        expect(spyPathcValue).toHaveBeenCalledWith(pokeToUse)

        
      });

    });


    describe('Save', () => {
      
      it('should to create new pokemon', () => {
        const spy = spyOn(service, 'save').and.returnValue(of(pokeToUse))
        const spyCancel = spyOn(component, 'cancel');
        component.form.patchValue({
          name: 'Prueba',
          image: 'prueba',
          attack: 20,
          defense: 20
        });


        component.save();
        expect(spy).toHaveBeenCalled();
        expect(spyCancel).toHaveBeenCalled()
      });

      it('should update pokemon', () => {
        const spy = spyOn(service, 'edit').and.returnValue(of(pokeToUse))
        const spyCancel = spyOn(component, 'cancel');
        component.pokemon = pokeToUse;
        component.save()
        expect(spy).toHaveBeenCalled();
        expect(spyCancel).toHaveBeenCalled();

      });


    });

});
