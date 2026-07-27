import{describe,expect,it}from'vitest';
import{templates}from'./data';

const shouldersA=templates.find(template=>template.id==='shoulders-a')!;
const shouldersB=templates.find(template=>template.id==='shoulders-b')!;

describe('rozróżnienie treningów barków',()=>{
 it('A jest ciężkim treningiem z wyciskaniem',()=>{
  expect(shouldersA.exerciseIds).toContain('db-shoulder-press');
  expect(shouldersA.exerciseIds).toContain('machine-shoulder-press');
  expect(shouldersA.prescriptions?.['db-shoulder-press'].restSeconds).toBeGreaterThanOrEqual(120);
 });

 it('B nie zawiera wyciskania ani wznosów przodem',()=>{
  expect(shouldersB.exerciseIds).not.toContain('arnold');
  expect(shouldersB.exerciseIds).not.toContain('db-shoulder-press');
  expect(shouldersB.exerciseIds).not.toContain('machine-shoulder-press');
  expect(shouldersB.exerciseIds).not.toContain('front-raise');
 });

 it('B koncentruje się na objętości bocznego i tylnego aktonu',()=>{
  expect(shouldersB.exerciseIds).toEqual(['cable-lateral','seated-lateral','rear-delt','reverse-pec','face-pull','lateral-finisher']);
  for(const id of shouldersB.exerciseIds){
   const prescription=shouldersB.prescriptions?.[id];
   expect(prescription).toBeDefined();
   expect(prescription?.repRange?.min).toBeGreaterThanOrEqual(12);
   expect(prescription?.restSeconds).toBeLessThanOrEqual(75);
  }
 });

 it('wszystkie ćwiczenia obu planów mają konkretne zalecenia',()=>{
  for(const template of[shouldersA,shouldersB]){
   expect(Object.keys(template.prescriptions||{}).sort()).toEqual([...template.exerciseIds].sort());
  }
 });
});
