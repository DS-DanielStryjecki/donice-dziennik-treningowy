export type Muscle='Klatka'|'Barki'|'Plecy'|'Nogi'|'Ramiona'|'Core'|'Regeneracja';
export type SessionStatus='full'|'light'|'incomplete';
export type SetKind='warmup'|'working';
export interface Exercise {id:string;namePl:string;nameEn:string;muscles:Muscle[];equipment:string;steps:string[];errors:string[];tip?:string;coachCues?:string[];custom?:boolean;alternatives?:string[];illustrationStart?:string;illustrationEnd?:string;imageUrl?:string;sets?:number;repRange?:{min:number;max:number};repUnit?:string;targetRir?:string;restSeconds?:number;tempo?:string;category?:string;primaryMuscles?:string[];secondaryMuscles?:string[]}
export interface TrainingTemplate {id:string;name:string;nameEn?:string;focus:Muscle;variant?:'A'|'B'|'C'|'D';description:string;exerciseIds:string[];optionalIds?:string[];goal?:string;notes?:string[];estimatedDurationMin?:number;sourceSchemaVersion?:string}
export interface TrainingSet {id:string;kind:SetKind;weight:number|null;reps:number|null;rir:number|null;done:boolean}
export interface ExerciseLog {exerciseId:string;sets:TrainingSet[];notes:string;skipped?:boolean;originalExerciseId?:string;repRange?:{min:number;max:number};repUnit?:string;targetRir?:string;restSeconds?:number;tempo?:string}
export interface TrainingSession {id:string;templateId:string;name:string;focus:Muscle;variant?:string;startedAt:string;completedAt?:string;status?:SessionStatus;exercises:ExerciseLog[];fullRestDay?:boolean}
export interface Recovery {id:string;createdAt:string;sleep:number;energy:number;chestSoreness:number;shoulderSoreness:number;backSoreness:number;jointPain:number;note:string}
export interface GymProfile {id:string;name:string;country:string;equipment:string[];active:boolean}
export interface PlanExercise {id:string;exerciseId:string;sets:number;repMin:number;repMax:number;targetWeight:number|null;rir:number;targetRir?:string;restSeconds?:number;tempo?:string;note:string}
export interface CustomPlan {id:string;name:string;focus:Muscle;description:string;exercises:PlanExercise[];favorite:boolean;hidden:boolean;createdAt:string;updatedAt:string}
