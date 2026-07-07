import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, HostListener, Output } from '@angular/core';


@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private elemento: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elemento.nativeElement.focus();
    }, 0);
  }

}


@Directive({
  selector: '[scrollInfinito]',
  standalone: true
})
export class ScrollInfinitoDirective {

  @Output() cargarMas = new EventEmitter<void>();

  @HostListener('window:scroll')
  onScroll() {

    const scrollActual = window.innerHeight + window.scrollY;
    const alturaPagina = document.documentElement.scrollHeight;

    if (scrollActual >= alturaPagina - 200) {
      this.cargarMas.emit();
    }

  }

}


@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {

  @Input() appTooltip = 'Visitar perfil';

  private tooltip!: HTMLDivElement;

  constructor(private elemento: ElementRef) {}
@HostListener('mouseenter')
mostrar() {

  this.tooltip = document.createElement('div');

  this.tooltip.innerText = this.appTooltip;

  this.tooltip.style.position = 'fixed';
  this.tooltip.style.background = '#c084fc';
  this.tooltip.style.color = 'white';
  this.tooltip.style.padding = '6px 12px';
  this.tooltip.style.borderRadius = '50px';
  this.tooltip.style.fontSize = '12px';
  this.tooltip.style.zIndex = '9999';
  this.tooltip.style.whiteSpace = 'nowrap';

  document.body.appendChild(this.tooltip);


  const posicion = this.elemento.nativeElement.getBoundingClientRect();

  const anchoTooltip = this.tooltip.offsetWidth;
  const altoTooltip = this.tooltip.offsetHeight;

  this.tooltip.style.left = `${posicion.left + (posicion.width / 2) - (anchoTooltip / 2)}px`;

  this.tooltip.style.top = `${posicion.top - altoTooltip - 10}px`;

}


  @HostListener('mouseleave')
  ocultar() {

    if (this.tooltip) {
      this.tooltip.remove();
    }

  }

}