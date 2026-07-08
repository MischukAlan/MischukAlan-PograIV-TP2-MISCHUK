import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../service/estadisticas.service';
import { Chart } from 'chart.js/auto';
import { AlertService } from '../../service/alert';
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

  chartComentariosPorPublicacion: Chart | null = null;
  chartComentariosPorFecha: Chart | null = null;
  chartUsuarios: Chart | null = null;
  chartIngresos: Chart | null = null;
  chartVisitas: Chart | null = null;
  chartLikesDia: Chart | null = null;

  constructor(private estadisticasService: EstadisticasService, private alert : AlertService) {
    this.configurarEstilosGlobalesChart();
  }

  private configurarEstilosGlobalesChart() {
    Chart.defaults.color = '#FFD3D5';
    Chart.defaults.font.family = "'Plus Jakarta Sans', 'Inter', sans-serif";
    Chart.defaults.font.weight = 'bold';
    Chart.defaults.scale.grid.color = 'rgba(228, 155, 166, 0.15)'; 
    Chart.defaults.scale.ticks.color = '#FFD3D5'; 
  }

  getDesdeHastaValidos() {
    if (!this.desde || !this.hasta) return null;

    return {
      desde: new Date(this.desde).toISOString(),
      hasta: new Date(this.hasta).toISOString()
    };
  }

  buscarEstadisticas() {
    const fechas = this.getDesdeHastaValidos();

    if (!fechas) {
      this.mostrarError();
      return;
    }
    this.cargarLikesPorDia();
    this.cargarVisitas();
    this.cargarIngresos();
    this.cargarComentariosPorPublicacion();
    this.cargarComentariosPorFecha();
    this.cargarPublicacionesPorUsuario();
  }

  mostrarError() {
    this.alert.error('Debes seleccionar fecha desde y hasta');
  }

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
              backgroundColor: '#FFD3D5',
              borderColor: '#E49BA6',
              borderWidth: 2,
              borderRadius: 8
            }]
          }
        });

      });
  }

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
              backgroundColor: 'rgba(228, 155, 166, 0.2)',
              borderColor: '#FFD3D5',
              tension: 0.3,
              fill: true
            }]
          }
        });

      });
  }

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
              backgroundColor: '#E49BA6',
              borderColor: '#FFD3D5',
              borderWidth: 2,
              borderRadius: 8
            }]
          }
        });

      });
  }

  cargarIngresos() {
    this.estadisticasService
      .loginPorUsuario()
      .subscribe(data => {
        if (this.chartIngresos) { this.chartIngresos.destroy(); }

        this.chartIngresos = new Chart('chartIngresosUsuarios', {
          type: 'bar',
          data: {
            labels: data.map(x => x.usuario),
            datasets: [
              {
                label: 'Cantidad de ingresos',
                data: data.map(x => x.cantidad),
                backgroundColor: '#FFD3D5',
                borderColor: '#E49BA6',
                borderWidth: 2,
                borderRadius: 8
              }
            ]
          }
        });
        console.log('Chart creado:', this.chartIngresos);
      });
  }

  cargarVisitas() {
    this.estadisticasService
      .visitasPorPerfil()
      .subscribe(data => {

        if (this.chartVisitas) {
          this.chartVisitas.destroy();
        }

        this.chartVisitas = new Chart('chartVisitasPerfil', {
          type: 'bar',
          data: {
            labels: data.map(x => x.usuario),
            datasets: [
              {
                label: 'Visitas al perfil',
                data: data.map(x => x.cantidad),
                backgroundColor: '#E49BA6',
                borderColor: '#FFD3D5',
                borderWidth: 1,
                borderRadius: 8
              }
            ]
          }
        });

      });
  }

  cargarLikesPorDia() {
    this.estadisticasService
      .likesPorDia()
      .subscribe(data => {

        if (this.chartLikesDia) {
          this.chartLikesDia.destroy();
        }

        this.chartLikesDia = new Chart('chartLikesDia', {
          type: 'line',
          data: {
            labels: data.map(x => x.fecha),
            datasets: [
              {
                label: 'Me gusta otorgados por día',
                data: data.map(x => x.cantidad),
                borderColor: '#FFD3D5',
                backgroundColor: 'rgba(255, 211, 213, 0.15)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
              }
            ]
          }
        });

      });
  }
}