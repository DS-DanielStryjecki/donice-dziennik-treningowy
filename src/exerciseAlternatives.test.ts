import{describe,expect,it}from'vitest';
import{exercises}from'./data';
import{
 alternativeExerciseId,
 applyCuratedExerciseModel,
 curatedAlternativesForExercise,
 normalizeExerciseAlternative
}from'./exerciseAlternatives';
import type{Exercise}from'./types';

const byId=(id:string)=>{
 const exercise=exercises.find(item=>item.id===id);
 expect(exercise,id).toBeDefined();
 return exercise!;
};

describe('zgodny wstecznie model zamienników',()=>{
 it('normalizuje stare identyfikatory i nowe obiekty bez utraty metadanych',()=>{
  expect(normalizeExerciseAlternative('bench')).toEqual({
   exerciseId:'bench',
   recommended:false,
   source:'system'
  });
  expect(normalizeExerciseAlternative({
   exerciseId:'standing-cable-chest-press',
   recommended:true,
   note:'  Polecany wariant.  ',
   source:'curated'
  })).toEqual({
   exerciseId:'standing-cable-chest-press',
   recommended:true,
   note:'Polecany wariant.',
   source:'curated'
  });
 });

 it('zachowuje istniejące alternatywy podczas wzbogacania ćwiczenia',()=>{
  const legacy:Exercise={
   id:'custom',
   namePl:'Własne',
   nameEn:'Custom',
   muscles:['Klatka'],
   equipment:'Hantle',
   steps:[],
   errors:[],
   alternatives:['bench',{exerciseId:'flat-db',source:'user'}]
  };
  const migrated=applyCuratedExerciseModel(legacy);
  expect(migrated.alternatives?.slice(0,2)).toEqual(legacy.alternatives);
 });
});

describe('kuratorowane rodziny zamienników',()=>{
 it('każde wbudowane ćwiczenie ma listę poprawnych zamienników',()=>{
  const ids=new Set(exercises.map(exercise=>exercise.id));
  expect(ids.size).toBe(exercises.length);
  for(const exercise of exercises){
   expect(Array.isArray(exercise.alternatives),exercise.id).toBe(true);
   expect(exercise.alternatives?.length,exercise.id).toBeGreaterThan(0);
   const alternativeIds=exercise.alternatives!.map(alternativeExerciseId);
   expect(alternativeIds,exercise.id).not.toContain(exercise.id);
   for(const alternativeId of alternativeIds)expect(ids.has(alternativeId),`${exercise.id} -> ${alternativeId}`).toBe(true);
  }
 });

 it('odwzorowuje warianty cable na istniejące ID i oznacza polecane gwiazdką',()=>{
  const recommended=(exerciseId:string)=>curatedAlternativesForExercise(exerciseId)
   .filter(item=>item.recommended)
   .map(item=>item.exerciseId);
  expect(recommended('bench')).toContain('standing-cable-chest-press');
  expect(recommended('incline-db')).toContain('incline-cable-press');
  expect(recommended('weighted-dips')).toEqual(expect.arrayContaining([
   'decline-cable-press',
   'standing-cable-dip-press'
  ]));
 });
});

describe('warianty wyciskania na bramie',()=>{
 it('zachowuje istniejące ID i dodaje dwa nowe warianty',()=>{
  expect(byId('incline-cable-press')).toMatchObject({
   namePl:'Wyciskanie na linkach z dołu (góra klatki)',
   nameEn:'Incline Cable Chest Press'
  });
  expect(byId('decline-cable-press')).toMatchObject({
   namePl:'Wyciskanie na linkach z góry (dół klatki)',
   nameEn:'Decline Cable Chest Press'
  });
  expect(byId('standing-cable-chest-press')).toMatchObject({
   namePl:'Wyciskanie na linkach – klatka pozioma',
   nameEn:'Standing Cable Chest Press',
   category:'Compound',
   primaryMuscles:['klatka piersiowa'],
   secondaryMuscles:['przedni akton barków','triceps'],
   sets:3,
   repRange:{min:10,max:15},
   targetRir:'1–2',
   restSeconds:90,
   tempo:'3-0-1-1'
  });
  expect(byId('standing-cable-dip-press')).toMatchObject({
   namePl:'Wyciskanie na linkach stojąc – styl dipów',
   nameEn:'Standing Cable Dip Press',
   category:'Compound',
   primaryMuscles:['dolna część klatki piersiowej'],
   secondaryMuscles:['triceps'],
   sets:3,
   repRange:{min:10,max:15},
   targetRir:'1–2',
   restSeconds:90,
   tempo:'3-0-1-1'
  });
 });

 it('oznacza flat, incline i decline cable press jako możliwe finishery',()=>{
  expect(byId('standing-cable-chest-press').recommendedAsFinisher).toBe(true);
  expect(byId('incline-cable-press').recommendedAsFinisher).toBe(true);
  expect(byId('decline-cable-press').recommendedAsFinisher).toBe(true);
  expect(byId('standing-cable-dip-press').recommendedAsFinisher).not.toBe(true);
 });

 it('przechowuje przygotowane metadata wariantu',()=>{
  for(const id of[
   'standing-cable-chest-press',
   'incline-cable-press',
   'decline-cable-press',
   'standing-cable-dip-press'
  ]){
   expect(byId(id).variantMetadata,id).toMatchObject({
    familyId:'cable-chest-press'
   });
   expect(byId(id).variantMetadata?.cableHeight?.length,id).toBeGreaterThan(3);
   expect(byId(id).variantMetadata?.handle?.length,id).toBeGreaterThan(3);
   expect(byId(id).variantMetadata?.movementPath?.length,id).toBeGreaterThan(10);
  }
 });
});
