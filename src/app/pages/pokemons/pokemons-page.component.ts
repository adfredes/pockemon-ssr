import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
    PokemonListSkeletonComponent
  ],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit{

  private pokemonsService = inject(PokemonsService);
  public pokemons = signal<SimplePokemon[]>([]);

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  public currentPage = toSignal<number>(
    this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('page') ?? '1'),
      map(page => isNaN(+page)? 1 : +page),
      map(page => Math.max(1, page)),
    )
);

  // public isLoading = signal(false);

  // private appRef = inject(ApplicationRef);

  // private $appState = this.appRef.isStable
  // .pipe(takeUntilDestroyed())
  // .subscribe(isStable => {

  // });

  ngOnInit(): void {
    this.loadPokemons();
    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 5000);
  }

  public loadPokemons(page = 0) {

    const pageToLoad = this.currentPage()! + page;
    // this.isLoading.set(true);

    this.pokemonsService.loadPage(pageToLoad)
      .pipe(
        tap(() => this.router.navigate([], {queryParams: {page: pageToLoad}})),
        tap(() => this.title.setTitle(`Pokemon SSR - Page ${pageToLoad}`)),
        // tap(() => this.isLoading.set(false))
      ).subscribe(pokemons =>this.pokemons.set(pokemons));

  }
 }
