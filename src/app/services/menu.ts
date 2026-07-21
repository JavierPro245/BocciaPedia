import { Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private readonly menu: Menu[] = [

    {
      title: 'Inicio',
      icon: 'home-outline',
      url: '/main/home'
    },

    {
      title: 'Gestión',
      icon: 'people-circle-outline',

      children: [

        {
          title: 'Deportistas',
          icon: 'people-outline',
          url: '/main/athlete-list'
        },

        {
          title: 'Entrenadores',
          icon: 'fitness-outline',
          url: '/main/trainer-list'
        },

        {
          title: 'Usuarios',
          icon: 'person-add-outline',
          url: '/administration/users'
        }

      ]
    },

    {
      title: 'Competencia',
      icon: 'trophy-outline',

      children: [

        {
          title: 'Evaluaciones',
          icon: 'clipboard-outline',
          url: '/evaluations/evaluations-list'
        },

        {
          title: 'Partidos',
          icon: 'football-outline',
          url: '/matches/match-create'
        }

      ]
    },

    {
      title: 'Análisis',
      icon: 'analytics-outline',

      children: [

        {
          title: 'Dashboard',
          icon: 'speedometer-outline',
          url: '/statistics/dashboard'
        },

        {
          title: 'Estadísticas',
          icon: 'bar-chart-outline',
          url: '/statistics'
        },

        {
          title: 'Heatmap',
          icon: 'grid-outline',
          url: '/evaluations/heatmap'
        },

        {
          title: 'Reportes',
          icon: 'document-text-outline',
          url: '/statistics/reports'
        }

      ]
    },

    {
      title: 'Multimedia',
      icon: 'images-outline',

      children: [

        {
          title: 'Fotos',
          icon: 'image-outline',
          url: '/media/photos'
        },

        {
          title: 'Videos',
          icon: 'videocam-outline',
          url: '/media/videos'
        }

      ]
    },

    {
      title: 'Configuración',
      icon: 'settings-outline',
      url: '/main/settings'
    },

    {
      title: 'Perfil',
      icon: 'person-circle-outline',
      url: '/main/profile'
    },

    {
      title: 'Cerrar sesión',
      icon: 'log-out-outline',
      url: ''
    }

  ];

  constructor() {}

  getMenu(): Menu[] {
    return this.menu;
  }

}