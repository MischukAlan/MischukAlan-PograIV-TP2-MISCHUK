import { authGuard } from './guards/auth-guard';
import { rolGuard } from './guards/rol-guard';
import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Perfil } from './componentes/perfil/perfil';
import { Muro } from './componentes/muro/muro';
import { Registro } from './componentes/registro/registro';
import { PublicacionDetalle } from './componentes/publicacion-detalle/publicacion-detalle';
import { DashboardUsuarios } from './componentes/dashboard-usuarios/dashboard-usuarios';
import { DashboardEstadisticas } from './componentes/dashboard-estadisticas/dashboard-estadisticas';


export const routes: Routes = [

    { path: 'login', component: Login },

    {path: 'registro', component: Registro},   
    
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    
    {path: 'perfil', 
        component: Perfil,
        canActivate: [authGuard]        
    },

    {path: 'dashboard-usuarios', 
        component: DashboardUsuarios,
        canActivate: [rolGuard],
        data: { expectedRole: 'administrador' }         
    },

    {path: 'dashboard-estadisticas', 
        component: DashboardEstadisticas,
        canActivate: [rolGuard],
        data: { expectedRole: 'administrador' }      
    },
    
    {path: 'muro',
        component: Muro,
        canActivate: [authGuard]
    },
    
    {path: 'publicacion-detalle/:id', component: PublicacionDetalle, canActivate: [authGuard]},   
    
    {path: '**', component: Error},    

];
