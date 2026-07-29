import{describe,expect,it}from'vitest';
import{exercises}from'./data';
import{
 equipmentCatalog,
 equipmentOptionsForExercises,
 isExerciseAvailable,
 normalizeEquipmentSelection,
 parseEquipmentRequirements
}from'./equipment';
import type{Exercise,GymProfile}from'./types';

const exercise=(equipment:string)=>({id:'x',namePl:'X',nameEn:'X',muscles:['Klatka'],equipment,steps:[],errors:[]}as Exercise);
const gym=(equipment:string[])=>({id:'g',name:'Gym',country:'PL',active:true,equipment}as GymProfile);

describe('pełny katalog sprzętu',()=>{
 it('zawiera każdą pozycję wynikającą z wymagań wszystkich ćwiczeń',()=>{
  const options=equipmentOptionsForExercises(exercises);
  const labels=new Set(options.map(option=>option.label));
  for(const item of exercises){
   for(const group of parseEquipmentRequirements(item.equipment)){
    for(const requirement of group.alternatives)expect(labels.has(requirement),`${item.id}: ${requirement}`).toBe(true);
   }
  }
  expect([...labels]).toEqual(expect.arrayContaining([
   'Ławka pozioma ze stojakami',
   'Ławka regulowana',
   'Maszyna chest press',
   'Maszyna shoulder press',
   'Maszyna lateral raise',
   'Maszyna pec deck',
   'Maszyna reverse pec deck',
   'Maszyna Hammer Strength Row',
   'Maszyna converging press',
   'Para uchwytów pojedynczych',
   'Uchwyt neutralny',
   'Uchwyt do wiosłowania',
   'Drążek szeroki',
   'Stabilne podwyższenie'
  ]));
 });

 it('normalizuje starsze wpisy profilu bez ich semantycznej utraty',()=>{
  expect(normalizeEquipmentSelection(['Maszyny','Pec deck','Uchwyty pojedyncze','Gumy','Hantel'])).toEqual([
   'Maszyna (dowolna)',
   'Maszyna pec deck',
   'Para uchwytów pojedynczych',
   'Guma',
   'Hantle'
  ]);
 });

 it('pełny katalog wystarcza do każdego ćwiczenia wymagającego sprzętu',()=>{
  const profile=gym([...equipmentCatalog]);
  for(const item of exercises)expect(isExerciseAvailable(item,profile),item.id).toBe(true);
 });

 it('akcja „Zaznacz wszystko” daje pełne 100% dostępności',()=>{
  const selected=equipmentOptionsForExercises(exercises).map(option=>option.label);
  const unavailable=exercises.filter(item=>!isExerciseAvailable(item,gym(selected)));
  expect(unavailable.map(item=>item.id)).toEqual([]);
 });
});

describe('dokładne sprawdzanie wyposażenia',()=>{
 it('wymaga całego zestawu po przecinku',()=>{
  const cablePress=exercise('Brama, para uchwytów pojedynczych');
  expect(isExerciseAvailable(cablePress,gym(['Brama']))).toBe(false);
  expect(isExerciseAvailable(cablePress,gym(['Brama','Para uchwytów pojedynczych']))).toBe(true);
 });

 it('akceptuje jeden wariant zapisany przez „lub”',()=>{
  expect(isExerciseAvailable(exercise('Hantle lub sztanga'),gym(['Sztanga']))).toBe(true);
  expect(isExerciseAvailable(exercise('Maszyna Hammer Strength lub maszyna converging press'),gym(['Maszyna converging press']))).toBe(true);
 });

 it('rozumie sprzęt ogólny ze starszych profili',()=>{
  expect(isExerciseAvailable(exercise('Maszyna chest press'),gym(['Maszyny']))).toBe(true);
  expect(isExerciseAvailable(exercise('Wyciąg górny'),gym(['Brama']))).toBe(true);
  expect(isExerciseAvailable(exercise('Ławka regulowana'),gym(['Ławka']))).toBe(true);
 });

 it('nie wymaga sprzętu opcjonalnego ani ćwiczeń z masą ciała',()=>{
  expect(isExerciseAvailable(exercise('Guma opcjonalnie'),gym([]))).toBe(true);
  expect(isExerciseAvailable(exercise('Masa ciała'),gym([]))).toBe(true);
  expect(isExerciseAvailable(exercise('Talerz lub hantel lub brak sprzętu'),gym([]))).toBe(true);
 });

 it('pusty profil nie udaje pełnej siłowni',()=>{
  expect(isExerciseAvailable(exercise('Hantle'),gym([]))).toBe(false);
  expect(isExerciseAvailable(exercise('Masa ciała, uchwyty do pompek lub hantle lub stabilne podwyższenie'),gym([]))).toBe(false);
  expect(isExerciseAvailable(exercise('Masa ciała, uchwyty do pompek lub hantle lub stabilne podwyższenie'),gym(['Hantle']))).toBe(true);
 });
});
