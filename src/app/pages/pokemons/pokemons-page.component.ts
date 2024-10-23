import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { SimplePokemon } from '../../pokemons/interfaces';
import { PokemonsService } from '../../pokemons/services/pokemon.service';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';


@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [
    PokemonListComponent,
    PokemonListSkeletonComponent,
    RouterLink
  ],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent {

  private pokemonsService = inject(PokemonsService);
  public pokemons = signal<SimplePokemon[]>([]);

  private activatedRoute = inject(ActivatedRoute);
  //private router = inject(Router);
  private title = inject(Title);

  public currentPage = toSignal<number>(
    this.activatedRoute.params.pipe(
      map(params => params['page'] ?? '1'),
      map(page => isNaN(+page)? 1 : +page),
      map(page => Math.max(1, page)),
    )
  );

  public loadOnPageChanged = effect(() => {
    this.loadPokemons(this.currentPage());
  }, {
    allowSignalWrites: true
  });

  // public currentPage = toSignal<number>(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map(params => params.get('page') ?? '1'),
  //     map(page => isNaN(+page)? 1 : +page),
  //     map(page => Math.max(1, page)),
  //   )
  // );



  // ngOnInit(): void {
  //   this.loadPokemons();
  // }

  public loadPokemons(page = 1) {

    //const pageToLoad = this.currentPage()!;
    // this.isLoading.set(true);

    this.pokemonsService.loadPage(page)
      .pipe(
        // tap(() => this.router.navigate([], {queryParams: {page: pageToLoad}})),
        tap(() => this.title.setTitle(`Pokemon SSR - Page ${page}`)),
      ).subscribe(pokemons =>this.pokemons.set(pokemons));

  }
 }
