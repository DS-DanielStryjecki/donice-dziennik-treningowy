import{describe,expect,it}from'vitest';
import{alternativesForExercise,exercisesForFocus,recommendedAlternativesForExercise}from'./exerciseSelection';
import type{Exercise}from'./types';

const exercise=(id:string,muscles:Exercise['muscles']):Exercise=>({id,namePl:id,nameEn:'',muscles,equipment:'Hantle',steps:[],errors:[]});
const exercises=[exercise('barki',['Barki']),exercise('plecy',['Plecy']),exercise('oba',['Barki','Plecy'])];

describe('lista wyboru ćwiczeń',()=>{
 it('domyślnie pokazuje wyłącznie ćwiczenia aktualnej partii',()=>expect(exercisesForFocus(exercises,'Barki').map(item=>item.id).sort()).toEqual(['barki','oba']));
 it('po przełączeniu pokazuje wszystkie partie',()=>expect(exercisesForFocus(exercises,'Barki',true)).toHaveLength(3));
});

describe('zamienniki ćwiczenia',()=>{
 it('obsługuje starszą listę identyfikatorów i pomija brakujące ćwiczenia',()=>{
  const current={...exercise('aktualne',['Barki']),alternatives:['barki','brak','oba']};
  expect(alternativesForExercise(current,exercises).map(match=>match.exercise.id)).toEqual(['barki','oba']);
 });
 it('przenosi metadane i pokazuje rekomendowane zamienniki jako pierwsze',()=>{
  const current={...exercise('aktualne',['Barki']),alternatives:[
   'barki',
   {exerciseId:'oba',recommended:true,note:'Lepszy wybór przy tej siłowni.',source:'user'}
  ]} as Exercise;
  const matches=alternativesForExercise(current,exercises);
  expect(matches.map(match=>match.exercise.id)).toEqual(['oba','barki']);
  expect(matches[0]).toMatchObject({recommended:true,note:'Lepszy wybór przy tej siłowni.',source:'user'});
  expect(recommendedAlternativesForExercise(current,exercises).map(match=>match.exercise.id)).toEqual(['oba']);
 });
 it('scala powtórzone definicje, nie pokazuje bieżącego ćwiczenia i ignoruje nieznane ID',()=>{
  const current={...exercise('barki',['Barki']),alternatives:[
   'oba',
   {exerciseId:'oba',recommended:true,note:'Polecany.',source:'system'},
   {exerciseId:'barki',recommended:true},
   {exerciseId:'nie-istnieje',recommended:true}
  ]} as Exercise;
  expect(alternativesForExercise(current,exercises)).toEqual([{
   exercise:exercises[2],
   recommended:true,
   note:'Polecany.',
   source:'system'
  }]);
 });
});
