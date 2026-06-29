import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../service/estadisticas.service';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-estadisticas',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticas {

  desde: string | null = null;
  hasta: string | null = null;

  // charts (para evitar duplicados)
  chartComentariosPorPublicacion: Chart | null = null;
  chartComentariosPorFecha: Chart | null = null;
  chartUsuarios: Chart | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  // =========================
  // UTILIDAD FECHAS
  // =========================
  getDesdeHastaValidos() {
  if (!this.desde || !this.hasta) return null;

  return {
    desde: new Date(this.desde).toISOString(),
    hasta: new Date(this.hasta).toISOString()
  };
}

  // =========================
  // BOTÓN BUSCAR (ENTRYPOINT)
  // =========================
  buscarEstadisticas() {

    const fechas = this.getDesdeHastaValidos();

    if (!fechas) {
      this.mostrarError();
      return;
    }

    this.cargarComentariosPorPublicacion();
    this.cargarComentariosPorFecha();
    this.cargarPublicacionesPorUsuario();
  }

  mostrarError() {
    alert('Debes seleccionar fecha desde y hasta');
  }

  // =========================
  // 1. COMENTARIOS POR PUBLICACIÓN
  // =========================
  cargarComentariosPorPublicacion() {

    const fechas = this.getDesdeHastaValidos();
    if (!fechas) return;

    this.estadisticasService
      .comentariosPorPublicacion(fechas.desde, fechas.hasta)
      .subscribe(data => {

        if (this.chartComentariosPorPublicacion) {
          this.chartComentariosPorPublicacion.destroy();
        }

        this.chartComentariosPorPublicacion = new Chart('chartComentPorPublicaciones', {
          type: 'bar',
          data: {
            labels: data.map(x =>
              x.publicacion.length > 10
                ? x.publicacion.slice(0, 10) + '...'
                : x.publicacion
            ),
            datasets: [{
              label: 'Comentarios por publicación',
              data: data.map(x => x.cantidad),
              backgroundColor: '#933bdb',
              borderColor: '#4c1d95',
              borderWidth: 2
            }]
          }
        });

      });
  }

  // =========================
  // 2. COMENTARIOS POR FECHA
  // =========================
  cargarComentariosPorFecha() {

    const fechas = this.getDesdeHastaValidos();
    if (!fechas) return;

    this.estadisticasService
      .comentariosPorFecha(fechas.desde, fechas.hasta)
      .subscribe(data => {

        if (this.chartComentariosPorFecha) {
          this.chartComentariosPorFecha.destroy();
        }

        this.chartComentariosPorFecha = new Chart('chartPorFechas', {
          type: 'line',
          data: {
            labels: data.map(x => x.fecha),
            datasets: [{
              label: 'Comentarios por día',
              data: data.map(x => x.cantidad),
              backgroundColor: '#7c3aed',
              borderColor: '#933bdb',
            }]
          }
        });

      });
  }

  // =========================
  // 3. PUBLICACIONES POR USUARIO
  // =========================
  cargarPublicacionesPorUsuario() {

    const fechas = this.getDesdeHastaValidos();
    if (!fechas) return;

    this.estadisticasService
      .publicacionesPorUsuario(fechas.desde, fechas.hasta)
      .subscribe(data => {

        if (this.chartUsuarios) {
          this.chartUsuarios.destroy();
        }

        this.chartUsuarios = new Chart('chartPublicacionesPorUsuarios', {
          type: 'bar',
          data: {
            labels: data.map(x => x.usuario),
            datasets: [{
              label: 'Publicaciones por usuario',
              data: data.map(x => x.cantidad),
              backgroundColor: '#933bdb',
              borderColor: '#4c1d95',
              borderWidth: 2
            }]
          }
        });

      });
  }
}