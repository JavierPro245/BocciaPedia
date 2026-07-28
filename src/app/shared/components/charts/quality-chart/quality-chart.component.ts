import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexDataLabels,
  ApexPlotOptions
} from 'ng-apexcharts';

export type ChartOptions = {

  series: ApexNonAxisChartSeries;

  chart: ApexChart;

  labels: string[];

  legend: ApexLegend;

  responsive: ApexResponsive[];

  dataLabels: ApexDataLabels;

  plotOptions: ApexPlotOptions;

  colors: string[];

};

@Component({
  selector: 'app-quality-chart',
  templateUrl: './quality-chart.component.html',
  styleUrls: ['./quality-chart.component.scss'],
  standalone:false
})
export class QualityChartComponent
implements OnChanges {

  @Input() excellent=0;

  @Input() good=0;

  @Input() regular=0;

  @Input() bad=0;

  chartOptions!:ChartOptions;

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    this.createChart();

  }

  private createChart(){

    this.chartOptions={

      series:[

        this.excellent,

        this.good,

        this.regular,

        this.bad

      ],

      chart:{

        type:'donut',

        height:340

      },

      labels:[

        'Excelente',

        'Bueno',

        'Regular',

        'Malo'

      ],

      colors:[

        '#2dd36f',

        '#3880ff',

        '#ffc409',

        '#eb445a'

      ],

      legend:{

        position:'bottom'

      },

      dataLabels:{

        enabled:true

      },

      plotOptions:{

        pie:{

          donut:{

            size:'65%'

          }

        }

      },

      responsive:[

        {

          breakpoint:480,

          options:{

            chart:{

              height:280

            }

          }

        }

      ]

    };

  }

}