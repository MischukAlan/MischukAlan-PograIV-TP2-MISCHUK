import { authGuard } from './guards/auth-guard';
import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Perfil } from './componentes/perfil/perfil';
import { Muro } from './componentes/muro/muro';
import { Registro } from './componentes/registro/registro';

export const routes: Routes = [

    { path: 'login', component: Login },

    {path: 'registro', component: Registro},   
    
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    
    {path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]        

    },

    {path: 'muro',
    component: Muro,
    canActivate: [authGuard]
    },
    
    {path: '**', component: Error},    

];
