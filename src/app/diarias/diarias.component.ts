import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';
import { EmentasService } from '../ementas.service';
import { Diaria } from '../models';

@Component({
  selector: 'app-diarias',
  templateUrl: './diarias.component.html',
  styleUrls: ['./diarias.component.css']
})
export class DiariasComponent implements OnInit {
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  diarias: Diaria[];
  loading: boolean;
  currentId: number;
  atual: Diaria;

  constructor(
    private ementasService: EmentasService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public snackBar: MatSnackBar
  ) {
    this.matIconRegistry.addSvgIcon(
      'peixe',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.assetsPath + 'icons/peixe.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'sopa',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.assetsPath + 'icons/sopa.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'carne',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.assetsPath + 'icons/carne.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'vegetariano',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.assetsPath + 'icons/vegetariano.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'dieta',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.assetsPath + 'icons/dieta.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'info',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        environment.assetsPath + 'icons/info.svg'
      )
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.ementasService.getEmentas().subscribe((diarias: Diaria[]) => {
      this.diarias = diarias;
      for (let i in this.diarias) {
        if (this.diarias[i].isToday()) {
          this.currentId = this.diarias[i].id;
          this.atual = this.diarias[i];
        }
      }
      this.loading = false;
    });
  }

  showAllergens(allergens) {
    const string = 'Alérgenos: ' + allergens.join(', ');
    this.snackBar.open(string, null, {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  updateDiaria(event) {
    this.atual = this.diarias.find(diaria => diaria.isSameDay(event.value));
    this.currentId = this.atual.id;
  }

  goToToday() {
    this.atual = this.diarias.find(diaria => diaria.isToday());
    this.currentId = this.atual.id;
  }

  swipeRight() {
    const isLast = this.currentId === this.diarias.length - 1;
    this.currentId = isLast ? 0 : this.currentId + 1;
    this.atual = this.diarias[this.currentId];
  }

  swipeLeft() {
    const isFirst = this.currentId === 0;
    this.currentId = isFirst ? this.diarias.length - 1 : this.currentId - 1;
    this.atual = this.diarias[this.currentId];
  }

  swipe(currentIndex: number, action: string = this.SWIPE_ACTION.RIGHT) {
    if (currentIndex > this.diarias.length || currentIndex < 0) return;

    // next
    if (action === this.SWIPE_ACTION.LEFT) {
      const isLast = currentIndex === this.diarias.length - 1;
      this.currentId = isLast ? 0 : currentIndex + 1;
    }

    // previous
    if (action === this.SWIPE_ACTION.RIGHT) {
      const isFirst = currentIndex === 0;
      this.currentId = isFirst ? this.diarias.length - 1 : currentIndex - 1;
    }
    this.atual = this.diarias[this.currentId];
  }
}
