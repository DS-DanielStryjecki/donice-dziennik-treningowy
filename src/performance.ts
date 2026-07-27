import type{TrainingSession,TrainingSet}from'./types';

export interface ExercisePerformance{
 sessionId:string;
 sessionName:string;
 performedAt:string;
 sets:TrainingSet[];
}

export const previousExercisePerformance=(sessions:TrainingSession[],exerciseId:string,excludeSessionId?:string):ExercisePerformance|undefined=>{
 const sorted=[...sessions].filter(session=>session.id!==excludeSessionId).sort((a,b)=>b.startedAt.localeCompare(a.startedAt));
 for(const session of sorted){
  const sets=session.exercises
   .filter(log=>log.exerciseId===exerciseId)
   .flatMap(log=>log.sets)
   .filter(set=>set.done&&set.kind==='working'&&(set.weight!==null||set.reps!==null));
  if(sets.length)return{sessionId:session.id,sessionName:session.name,performedAt:session.completedAt||session.startedAt,sets};
 }
 return undefined;
};

const parsedRir=(targetRir?:string)=>{
 const parsed=Number.parseInt(targetRir||'2',10);
 return Number.isFinite(parsed)?parsed:2;
};

const nextWeight=(weight:number)=>weight<20?weight+1:weight<60?weight+2:weight+2.5;

export const suggestedSetValues=(count:number,performance?:ExercisePerformance,repRange?:{min:number;max:number},targetRir?:string)=>{
 const minimum=repRange?.min??8;
 const maximum=repRange?.max??12;
 const rir=parsedRir(targetRir);
 return Array.from({length:Math.max(1,count)},(_,index)=>{
  const previous=performance?.sets[index]||performance?.sets.at(-1);
  if(!previous)return{weight:null,reps:minimum,rir};
  const previousReps=previous.reps??minimum;
  const effortTooHigh=previous.rir!==null&&previous.rir<rir;
  const reachedTop=previousReps>=maximum&&!effortTooHigh;
  return{
   weight:reachedTop&&previous.weight!==null?nextWeight(previous.weight):previous.weight,
   reps:reachedTop?minimum:effortTooHigh?Math.min(maximum,Math.max(minimum,previousReps)):Math.min(maximum,previousReps+1),
   rir
  };
 });
};

export const suggestedTrainingSets=(count:number,performance?:ExercisePerformance,repRange?:{min:number;max:number},targetRir?:string):TrainingSet[]=>
 suggestedSetValues(count,performance,repRange,targetRir).map(values=>({id:crypto.randomUUID(),kind:'working',done:false,...values}));
