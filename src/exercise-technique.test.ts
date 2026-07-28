import{describe,expect,it}from'vitest';
import{exercises}from'./data';
import{exerciseTechnique}from'./exercise-technique';

const genericPhrases=['Ustaw stabilną pozycję i napnij brzuch.','Rozpocznij ruch z kontrolowanym napięciem mięśni docelowych.','Wykonaj pełny, bezbolesny zakres bez szarpania.','Kontroluj fazę opuszczania i dobierz ciężar pozwalający utrzymać pełny, bezbolesny zakres.'];

describe('indywidualne instrukcje techniczne',()=>{
 it('każde ćwiczenie w całej bibliotece ma kompletną, własną technikę',()=>{
  expect(Object.keys(exerciseTechnique)).toHaveLength(52);
  for(const exercise of exercises){
   expect(exerciseTechnique[exercise.id],exercise.id).toBeDefined();
   expect(exercise.description?.trim().length??0,exercise.id).toBeGreaterThan(60);
   expect(exercise.steps.length,exercise.id).toBeGreaterThanOrEqual(3);
   expect(exercise.errors.length,exercise.id).toBeGreaterThanOrEqual(3);
   expect(exercise.coachCues?.length,exercise.id).toBeGreaterThanOrEqual(2);
   expect(exercise.tip?.length,exercise.id).toBeGreaterThan(70);
  }
 });
 it('nie używa dawnych ogólników',()=>{
  for(const exercise of exercises)expect([exercise.tip,...exercise.steps]).not.toEqual(expect.arrayContaining(genericPhrases));
 });
 it('nie powiela wskazówek między ćwiczeniami',()=>{
  const tips=exercises.map(exercise=>exercise.tip);
  expect(new Set(tips).size).toBe(tips.length);
 });
 it('nie powiela opisów między ćwiczeniami',()=>{
  const descriptions=exercises.map(exercise=>exercise.description?.trim());
  expect(descriptions.every(Boolean)).toBe(true);
  expect(new Set(descriptions).size).toBe(descriptions.length);
 });
});
