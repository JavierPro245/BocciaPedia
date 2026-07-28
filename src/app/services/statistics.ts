import { Injectable } from '@angular/core';
import { Evaluation } from '../models/evaluation.model';

export interface GeneralStatistics {

  totalEvaluations:number;

  totalThrows:number;

  excellent:number;

  good:number;

  regular:number;

  bad:number;

  total:number;

  excellentPercent:number;

  goodPercent:number;

  regularPercent:number;

  badPercent:number;

  finishedEvaluations:number;

}

export interface MonthlyStatistics {

  month: string;

  total: number;

}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() {}

  getGeneralStatistics(
    evaluations: Evaluation[]
  ): GeneralStatistics {

    let excellent = 0;
    let good = 0;
    let regular = 0;
    let bad = 0;

    let totalThrows = 0;

    for (const evaluation of evaluations) {

      const throws = evaluation.throwList ?? [];

      totalThrows += throws.length;

      for (const ball of throws) {

        switch (ball.result) {

          case 'excellent':
            excellent++;
            break;

          case 'good':
            good++;
            break;

          case 'regular':
            regular++;
            break;

          case 'bad':
            bad++;
            break;

        }

      }

    }

    const total =
      excellent +
      good +
      regular +
      bad;

    return {

  totalEvaluations: evaluations.length,

  totalThrows,

  excellent,

  good,

  regular,

  bad,

  total,

  excellentPercent:
    total ? excellent * 100 / total : 0,

  goodPercent:
    total ? good * 100 / total : 0,

  regularPercent:
    total ? regular * 100 / total : 0,

  badPercent:
    total ? bad * 100 / total : 0,

  finishedEvaluations:

    evaluations.filter(

      e => e.status === 'finished'

    ).length

};

  }

  getAthleteStatistics(
  evaluations: Evaluation[]
) {

  const athletes = new Map<string, any>();

  for (const evaluation of evaluations) {

    const athleteId = evaluation.athleteId;

    if (!athletes.has(athleteId)) {

      athletes.set(athleteId, {

        athleteId,

        athleteName: evaluation.athleteName,

        evaluations: 0,

        throws: 0,

        excellent: 0,

        total: 0

      });

    }

    const athlete = athletes.get(athleteId);

    athlete.evaluations++;

    const throws = evaluation.throwList ?? [];

    athlete.throws += throws.length;

    for (const ball of throws) {

      athlete.total++;

      if (ball.result === 'excellent') {

        athlete.excellent++;

      }

    }

  }

  return Array.from(athletes.values()).map(a => ({

    ...a,

    excellentPercent:

      a.total

        ? (a.excellent * 100) / a.total

        : 0

  }));

}

getMonthlyStatistics(
  evaluations: Evaluation[]
): MonthlyStatistics[] {

  const months = [

    'Ene',

    'Feb',

    'Mar',

    'Abr',

    'May',

    'Jun',

    'Jul',

    'Ago',

    'Sep',

    'Oct',

    'Nov',

    'Dic'

  ];

  const totals = new Array(12).fill(0);

  for (const evaluation of evaluations) {

    if (!evaluation.date) {
      continue;
    }

    const date = new Date(evaluation.date);

    totals[date.getMonth()]++;

  }

  return months.map((month, index) => ({

    month,

    total: totals[index]

  }));

}

}