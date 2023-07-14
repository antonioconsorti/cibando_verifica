import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
  @Input() pag: string;
  @Output() messaggio = new EventEmitter();

  percorsoDifficolta = "../../../../assets/images/difficolta-";
  cliccato = false;
  ricette: Recipe[] = [];
  page = 1;
  ricettePerPagina = 4;

  //PARTE VERIFICA////////////////////

  @ViewChild('myModal') myModal: any;
  @ViewChild('myModal2') myModal2: any;
  ruolo: any;
  isIconToggled = false;

  image_: String;
  title_: String;
  recipeData = {
    _id: null,
    title: '',
    description: '',
    image: '',
    difficulty: null
  };

  editor = ClassicEditor;

   editorConfig = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'codeBlock',
            'undo',
            'redo',
        ]
    },
    image: {
        toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageTextAlternative'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    height: 300,
};
  ricet: any;
  id_: any;
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl(''),
    difficulty: new FormControl(0),
  })

  //PARTE VERIFICA////////////////////

  //rowsPerPageOptions: number;
  //pagingNumber = 0;
  //first: number = 0;

  ricette$: Observable<Recipe[]>;
  totRicette: Recipe[] = [];
  totale: number;

  constructor(
    private recipeService: RecipeService,
    public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private modalService: NgbModal,
    private messageService: MessageService,
    ) {
      this.userService.ruoloUtente.subscribe(res => this.ruolo = res);
    }

  ngOnInit(): void {
    // if(this.pag == 'home') {
    //   this.ricette$ = this.recipeService.getRecipes().pipe(
    //      map(res => res.filter(ricetteFiltrate => ricetteFiltrate.difficulty < 6 )),
    //      map(res => res.slice(0,4 )),
    //      map(res => this.totRicette = res)
    //   )
    // } else {
    //   this.ricette$ = this.recipeService.getRecipes().pipe(
    //     map(res => res.filter(ricetteFiltrate => ricetteFiltrate.difficulty < 6 )),
    //     map(res => this.totRicette = res )
    //   )
    // }

      this.recipeService.getRecipes().subscribe({
        next: (res) => {
          this.ricette = res;
          if (this.ruolo !== 'admin') {
            this.ricette = this.ricette.filter(ricetta => ricetta.published);
            this.totRicette = this.totRicette.filter(ricetta => ricetta.published);
          }
          if(this.pag == 'home'){
            this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse().slice(0,4);
            this.totRicette = this.ricette;
          } else {
            this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse();
            this.totRicette = this.ricette;
          }


        },
        error: (e) => {
          console.error(e)
        }
      })
         //this.pagine();
  }
get(){
  this.recipeService.getRecipes().subscribe({
    next: (res) => {
      this.ricette = res;
      if(this.pag == 'home'){
        this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse().slice(0,4);
        this.totRicette = this.ricette;
      } else {
        this.ricette = this.ricette.sort((a,b) => b._id - a._id).reverse();
        this.totRicette = this.ricette;
      }
      if (this.ruolo !== 'admin') {
        this.ricette = this.ricette.filter(ricetta => ricetta.published);
        this.totRicette = this.totRicette.filter(ricetta => ricetta.published);
      }

    },
    error: (e) => {
      console.error(e)
    }
  })}

  inviaTitolo(titolo: string){
    if(!this.cliccato){
      this.messaggio.emit(titolo);
      this.cliccato = true;
    } else {
      this.messaggio.emit('');
      this.cliccato = false;
    }
    // oppure con ternario
   // this.cliccato ? (this.messaggio.emit(''), this.cliccato = false) : (this.messaggio.emit(titolo), this.cliccato = true);
  }

    // pagine(){
    //   let tot;
    //   if(this.ricette){
    //     tot = this.ricette.length
    //   }

    //   this.page = 1;
    //   this.pagingNumber = 0;
    //   this.pagingNumber = Math.ceil(this.ricette.length / this.ricettePerPagina / 4);
    // }

    paginate(event) {
       event.page =event.page + 1;
      this.page = event.page;
  }

  //PARTE VERIFICA////////////////////

  openModal(ricetta: Recipe): void {
    this.ricet = ricetta;
    this.id_ = ricetta._id;
    this.form.patchValue({
      title: ricetta.title,
      description: ricetta.description,
      image: ricetta.image,
      difficulty: ricetta.difficulty
    });

    this.modalService.open(this.myModal, { ariaLabelledBy: 'modal-title' });
  }
  openModal2(ricetta: Recipe): void {
    this.ricet = ricetta;
    this.image_ = ricetta.image;
    this.title_ = ricetta.title;

    this.modalService.open(this.myModal2, { ariaLabelledBy: 'modal-body' });
  }

  toggleIcon() {
    this.isIconToggled = !this.isIconToggled;
  }

  deleteRecipe(): void {
    this.recipeService.deleteRecipe(this.ricet)
      .subscribe(
        () => {
          console.log('Ricetta eliminata con successo');
          this.messageService.add({severity:'success', summary:'Successo', detail:'ricetta cancellata con successo', life: 3000});
        },
        error => {
          console.log('Errore', error);
          this.messageService.add({severity:'error', summary:'Errore', detail:'ricetta non cancellata'});
        }
      );
        this.get();
  }

  onSubmit(){
    this.updateRecipe(this.form.getRawValue(),this.ricet)
  }
  updateRecipe(ricetta: Recipe, ricettaCompleta: Recipe): void {
    ricettaCompleta.title = ricetta.title;
    ricettaCompleta.image = ricetta.image;
    ricettaCompleta.description = ricetta.description;
    ricettaCompleta.difficulty = ricetta.difficulty;

    this.recipeService.updateRecipe(ricettaCompleta._id, ricettaCompleta).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({severity:'success', summary:'Successo', detail:'ricetta modificata con successo', life: 3000});
      },
      error: (err) => {
         console.log(err);
         this.messageService.add({severity:'error', summary:'Errore', detail:'ricetta non modificata'});
      }
    })
      this.get();
  }

  modificaVisuale(ricetta: Recipe){
    ricetta.published = !ricetta.published;
    this.recipeService.updateRecipe(ricetta._id, ricetta).subscribe({
      next: (res) => {
        console.log(res)
        this.messageService.add({severity:'success', summary:'Successo', detail:'visibilità modificata con successo', life: 3000});
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({severity:'error', summary:'Errore', detail:'visibilità non modificata'});
     }
    })
      this.get();
  }
  //PARTE VERIFICA////////////////////

}
