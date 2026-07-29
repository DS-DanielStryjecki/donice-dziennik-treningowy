import{normalizeExerciseAlternative}from'./exerciseAlternatives';
import type{Exercise,ExerciseAlternativeReference,Muscle}from'./types';

export type AlternativeDefinition=ExerciseAlternativeReference;
export type AlternativeMatch={exercise:Exercise;recommended:boolean;note?:string;source:string};

export const exercisesForFocus=(exercises:Exercise[],focus:Muscle,all=false,query='')=>{
 const normalized=query.trim().toLocaleLowerCase('pl');
 return exercises
  .filter(exercise=>all||exercise.muscles.includes(focus))
  .filter(exercise=>!normalized||(exercise.namePl+' '+exercise.nameEn+' '+exercise.equipment).toLocaleLowerCase('pl').includes(normalized))
  .sort((a,b)=>a.namePl.localeCompare(b.namePl,'pl'));
};

export const alternativesForExercise=(currentExercise:Exercise|undefined,exercises:Exercise[]):AlternativeMatch[]=>{
 if(!currentExercise)return[];
 const definitions=currentExercise.alternatives||[];
 const matches=new Map<string,AlternativeMatch>();
 const order:string[]=[];
 for(const definition of definitions){
  const normalized=normalizeExerciseAlternative(definition);
  if(normalized.exerciseId===currentExercise.id)continue;
  const exercise=exercises.find(item=>item.id===normalized.exerciseId);
  if(!exercise)continue;
  const previous=matches.get(exercise.id);
  if(!previous)order.push(exercise.id);
  matches.set(exercise.id,{
   exercise,
   recommended:Boolean(previous?.recommended||normalized.recommended),
   note:normalized.note||previous?.note,
   source:normalized.source==='user'||previous?.source==='user'?'user':normalized.source||previous?.source||'system'
  });
 }
 return order
  .map(id=>matches.get(id)!)
  .sort((a,b)=>Number(b.recommended)-Number(a.recommended));
};

export const recommendedAlternativesForExercise=(currentExercise:Exercise|undefined,exercises:Exercise[])=>
 alternativesForExercise(currentExercise,exercises).filter(match=>match.recommended);
