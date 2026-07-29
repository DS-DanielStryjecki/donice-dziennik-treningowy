import type{
 Exercise,
 ExerciseAlternative,
 ExerciseAlternativeReference,
 ExerciseVariantMetadata
}from'./types';

export interface CuratedAlternativeFamily{
 id:string;
 exerciseIds:readonly string[];
}

export const curatedAlternativeFamilies:readonly CuratedAlternativeFamily[]=[
 {id:'chest-horizontal-press',exerciseIds:['bench','flat-db','chest-press','flat-machine-chest-press','standing-cable-chest-press','single-arm-standing-cable-press']},
 {id:'chest-incline-press',exerciseIds:['incline-db','incline-dumbbell-press','incline-hammer-strength-press','incline-cable-press','machine-chest-press-upper-focus']},
 {id:'chest-decline-press',exerciseIds:['weighted-dips','decline-cable-press','standing-cable-dip-press']},
 {id:'chest-mid-fly',exerciseIds:['cable-fly','pec-deck','pec-deck-fly']},
 {id:'chest-upper-fly',exerciseIds:['low-high','low-to-high-cable-fly','cable-fly']},
 {id:'chest-lower-fly',exerciseIds:['high-to-low-cable-crossover','cable-fly','pec-deck-fly']},
 {id:'chest-finisher',exerciseIds:['pushup','push-up-finisher','stretch-push-up','chest-squeeze-isometric']},
 {id:'shoulder-press',exerciseIds:['arnold','db-shoulder-press','machine-shoulder-press','front-raise']},
 {id:'shoulder-lateral',exerciseIds:['seated-lateral','machine-lateral','lateral-finisher','db-lateral','cable-lateral']},
 {id:'shoulder-rear',exerciseIds:['rear-delt','reverse-pec','face-pull']},
 {id:'back-vertical-pull',exerciseIds:['neutral-pulldown','onearm-pulldown','wide-pulldown','straightarm']},
 {id:'back-row',exerciseIds:['seated-row','hammer-row','back-extension']},
 {id:'upper-back-accessory',exerciseIds:['face-pull','shrugs','reverse-pec']},
 {id:'biceps',exerciseIds:['incline-curl','cable-curl','hammer-curl','arm-finisher']},
 {id:'triceps',exerciseIds:['rope-pushdown','overhead-triceps','arm-finisher']},
 {id:'recovery',exerciseIds:['walk','shoulder-mobility','stretching','sleep-hydration']}
];

const recommendedCableIds=new Set([
 'standing-cable-chest-press',
 'standing-cable-dip-press',
 'incline-cable-press',
 'decline-cable-press'
]);

const recommendedCableNotes:Record<string,string>={
 'standing-cable-chest-press':'Polecany wariant ze stałym napięciem na środkową część klatki.',
 'standing-cable-dip-press':'Polecany wariant ze stałym napięciem i torem zbliżonym do dipów.',
 'incline-cable-press':'Polecany wariant ze stałym napięciem na górną część klatki.',
 'decline-cable-press':'Polecany wariant ze stałym napięciem na dolną część klatki.'
};

export const exerciseVariantMetadata:Readonly<Record<string,ExerciseVariantMetadata>>={
 'standing-cable-chest-press':{
  familyId:'cable-chest-press',
  cableHeight:'środek klatki',
  handle:'dwa uchwyty pojedyncze',
  movementPath:'poziomo i zbieżnie przed środek klatki'
 },
 'single-arm-standing-cable-press':{
  familyId:'cable-chest-press',
  cableHeight:'środek klatki',
  handle:'jeden uchwyt pojedynczy',
  movementPath:'poziomo i lekko przez linię środka ciała'
 },
 'incline-cable-press':{
  familyId:'cable-chest-press',
  cableHeight:'dolne bloczki',
  handle:'dwa uchwyty pojedyncze',
  movementPath:'w górę i zbieżnie nad górną część klatki'
 },
 'decline-cable-press':{
  familyId:'cable-chest-press',
  cableHeight:'górne bloczki',
  handle:'dwa uchwyty pojedyncze',
  movementPath:'w dół i zbieżnie przed dolną część klatki'
 },
 'standing-cable-dip-press':{
  familyId:'cable-chest-press',
  cableHeight:'górne bloczki',
  handle:'dwa uchwyty pojedyncze',
  movementPath:'w dół blisko tułowia, jak w podporze na poręczach'
 }
};

export const alternativeExerciseId=(alternative:ExerciseAlternativeReference)=>
 typeof alternative==='string'?alternative:alternative.exerciseId;

export const normalizeExerciseAlternative=(alternative:ExerciseAlternativeReference):ExerciseAlternative=>
 typeof alternative==='string'
  ?{exerciseId:alternative,recommended:false,source:'system'}
  :{
   exerciseId:alternative.exerciseId,
   recommended:Boolean(alternative.recommended),
   note:alternative.note?.trim()||undefined,
   source:alternative.source?.trim()||'system'
  };

export const curatedAlternativesForExercise=(exerciseId:string):ExerciseAlternative[]=>{
 const alternativeIds:string[]=[];
 const seen=new Set<string>();
 for(const family of curatedAlternativeFamilies){
  if(!family.exerciseIds.includes(exerciseId))continue;
  for(const candidateId of family.exerciseIds){
   if(candidateId===exerciseId||seen.has(candidateId))continue;
   seen.add(candidateId);
   alternativeIds.push(candidateId);
  }
 }
 return alternativeIds.map(candidateId=>({
  exerciseId:candidateId,
  recommended:recommendedCableIds.has(candidateId)||undefined,
  note:recommendedCableNotes[candidateId],
  source:'curated'
 }));
};

const mergeAlternatives=(
 existing:ExerciseAlternativeReference[],
 curated:ExerciseAlternative[]
):ExerciseAlternativeReference[]=>{
 const result=[...existing];
 for(const candidate of curated){
  const matchingObjects=result.filter((item):item is ExerciseAlternative=>
   typeof item!=='string'&&item.exerciseId===candidate.exerciseId
  );
  if(matchingObjects.length){
   const firstIndex=result.indexOf(matchingObjects[0]);
   result[firstIndex]={
    ...matchingObjects[0],
    recommended:Boolean(matchingObjects[0].recommended||candidate.recommended)||undefined,
    note:matchingObjects[0].note||candidate.note,
    source:matchingObjects[0].source||candidate.source
   };
   continue;
  }
  const hasLegacy=result.some(item=>typeof item==='string'&&item===candidate.exerciseId);
  if(!hasLegacy||candidate.recommended||candidate.note)result.push(candidate);
 }
 return result;
};

const finisherCableIds=new Set([
 'standing-cable-chest-press',
 'incline-cable-press',
 'decline-cable-press'
]);

export const applyCuratedExerciseModel=(exercise:Exercise):Exercise=>({
 ...exercise,
 alternatives:mergeAlternatives(
  exercise.alternatives||[],
  curatedAlternativesForExercise(exercise.id)
 ),
 recommendedAsFinisher:exercise.recommendedAsFinisher??(finisherCableIds.has(exercise.id)||undefined),
 variantMetadata:exercise.variantMetadata||exerciseVariantMetadata[exercise.id]
});
