import { Injectable } from '@angular/core';

import { Menu } from '../models/menu.model';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private permissionService: PermissionService
  ) {}

  private readonly menu: Menu[] = [

    {
      title: 'Inicio',
      icon: 'home-outline',
      url: '/main/home',
      order: 1
    },

    {
      title: 'Gestión',
      icon: 'people-circle-outline',
      order: 2,

      children: [

        {
          title: 'Deportistas',
          icon: 'people-outline',
          url: '/main/athlete-list',
          roles: ['admin', 'trainer']
        },

        {
          title: 'Entrenadores',
          icon: 'fitness-outline',
          url: '/main/trainer-list',
          roles: ['admin']
        },

        {
          title: 'Usuarios',
          icon: 'person-add-outline',
          url: '/main/users',
          roles: ['admin']
        }

      ]
    },

    {
      title: 'Competencia',
      icon: 'trophy-outline',
      order: 3,

      children: [

        {
          title: 'Evaluaciones',
          icon: 'clipboard-outline',
          url: '/evaluations/evaluations-list',
          roles: ['admin', 'trainer', 'athlete']
        },

        {
          title: 'Partidos',
          icon: 'football-outline',
          url: '/matches/match-create',
          roles: ['admin', 'trainer', 'referee', 'athlete']
        }

      ]
    },

    {
      title: 'Análisis',
      icon: 'analytics-outline',
      order: 4,

      children: [

        {
          title: 'Dashboard',
          icon: 'speedometer-outline',
          url: '/statistics/dashboard',
          roles: ['admin', 'trainer']
        },

        {
          title: 'Estadísticas',
          icon: 'bar-chart-outline',
          url: '/statistics',
          roles: ['admin']
        },

        {
          title: 'Heatmap',
          icon: 'grid-outline',
          url: '/evaluations/heatmap'
        },

        {
          title: 'Reportes',
          icon: 'document-text-outline',
          url: '/statistics/reports',
          roles: ['admin', 'trainer','athlete']
        }

      ]
    },

    {
      title: 'Multimedia',
      icon: 'images-outline',
      order: 5,

      children: [

        {
          title: 'Fotos',
          icon: 'image-outline',
          url: '/media/photos',
          roles: ['admin']
        },

        {
          title: 'Videos',
          icon: 'videocam-outline',
          url: '/media/videos',
          roles: ['admin']
        }

      ]
    },

    {
      title: 'Configuración',
      icon: 'settings-outline',
      url: '/main/settings',
      order: 98
    },

    {
      title: 'Perfil',
      icon: 'person-circle-outline',
      url: '/main/profile',
      order: 99
    },

    {
      title: 'Cerrar sesión',
      icon: 'log-out-outline',
      order: 100
    }

  ];

  getMenu(): Menu[] {

    return this.filterMenu(this.menu)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  }

  private filterMenu(items: Menu[]): Menu[] {

    return items
      .filter(item => this.isVisible(item))
      .map(item => {

        const clone: Menu = {
          ...item
        };

        if (clone.children) {

          clone.children = this.filterMenu(clone.children);

        }

        return clone;

      })
      .filter(item => {

        if (item.children) {

          return item.children.length > 0;

        }

        return true;

      });

  }

  private isVisible(item: Menu): boolean {

    if (item.visible === false) {

      return false;

    }

    if (!item.roles || item.roles.length === 0) {

      return true;

    }

    return this.permissionService.hasAnyRole(item.roles);

  }

}