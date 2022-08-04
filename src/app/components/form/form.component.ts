import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/pokemon.class';
import { PokemonService } from 'src/app/pokemon.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {


  show: Observable<boolean>;
  pokemon: Pokemon;

  form: FormGroup;

  constructor(
    private _pokemonService: PokemonService,
    private _formBuilder: FormBuilder
  ) { 
   this.initForm();
  }

  ngOnInit(): void {
    this.show = this._pokemonService.editMode$;

    this._pokemonService.pokemonSelected$.subscribe((poke) => {
      this.pokemon = poke;
      if(poke) {
        this.form.patchValue(poke);
      }
    })
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      image: ['', [Validators.required]],
      attack: [0],
      defense: [0]
    })
  }

  cancel() {
    this._pokemonService.editMode = false;
    this._pokemonService.pokemonSelected = null;
    this.form.reset();
    this.initForm();
  }

  save() {
    const poke = this.form.value;
    
    if(this.pokemon) {
      this.pokemon.name = poke.name;
      this.pokemon.attack = poke.attack;
      this.pokemon.defense = poke.defense;
      // this.pokemon.type = 
      this.pokemon.image = poke.image;
      this.pokemon.idAuthor = this.pokemon.id_author;
      this._pokemonService.edit(this.pokemon, this.pokemon.id).subscribe({
        next: () => {
          this.cancel();
        }
      })

    }  else {
      const toSave = new Pokemon(poke.name, poke.image, poke.attack, poke.defense, "prueba");
      this._pokemonService.save(toSave).subscribe({
        next: () => {
          this.cancel();
        }
      });

    }   


  }

}
