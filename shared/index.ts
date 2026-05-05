export type StudentPlan = 'BASE' | 'PREMIUM';

export type LogStatus = 'FEITO' | 'NAO_FEITO' | 'SUBSTITUIDO' | 'PARCIAL';

export type SkipReason = 'DOR' | 'TEMPO' | 'APARELHO_OCUPADO' | 'FALTA_APARELHO' | 'CANSACO' | 'OUTRO';

export interface ExerciseLog {
    id?: string;
    studentId: string;
    publicationId: string;
    date: string;
    exerciseId: string;
    status: LogStatus;
    skipReason?: SkipReason;
    painLevel?: number;
    substitutionExerciseId?: string;
    note?: string;
}

export interface ProgressEntry {
    id?: string;
    studentId: string;
    date: string;
    weight?: number;
    measures?: Record<string, number>;
    energy: number;
    sleepQuality: number;
    rpe: number;
    notes?: string;
    photos?: string[];
}
