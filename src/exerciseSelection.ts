import type{Exercise,Muscle}from'./types';

export const exercisesForFocus=(exercises:Exercise[],focus:Muscle,all=false,query='')=>{
 const normalized=query.trim().toLocaleLowerCase('pl');
 return exercises
  .filter(exercise=>all||exercise.muscles.includes(focus))
  .filter(exercise=>!normalized||(exercise.namePl+' '+exercise.nameEn+' '+exercise.equipment).toLocaleLowerCase('pl').includes(normalized))
  .sort((a,b)=>a.namePl.localeCompare(b.namePl,'pl'));
};

