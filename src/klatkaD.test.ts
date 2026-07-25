import{describe,expect,it}from'vitest';
import{exercises,templates}from'./data';

describe('KLATKA D – FINAL (Kodex v2)',()=>{
 const plan=templates.find(template=>template.id==='chest-d')!;
 it('ma sześć ćwiczeń w docelowej kolejności',()=>expect(plan.exerciseIds).toEqual(['high-to-low-cable-crossover','single-arm-standing-cable-press','chest-press','low-to-high-cable-fly','pushup','chest-squeeze-isometric']));
 it('zachowuje serie, RIR i przerwy',()=>{
  expect(plan.exerciseIds.map(id=>plan.prescriptions?.[id].sets)).toEqual([4,3,4,3,3,3]);
  expect(plan.exerciseIds.map(id=>plan.prescriptions?.[id].targetRir)).toEqual(['1–2','1','0–1','0–1','0','0–1']);
  expect(plan.exerciseIds.map(id=>plan.prescriptions?.[id].restSeconds)).toEqual([60,75,90,60,60,30]);
 });
 it('zapisuje drop set, tempo pompek i izometrię',()=>{
  expect(plan.prescriptions?.['chest-press'].note).toContain('40–50%');
  expect(plan.prescriptions?.pushup).toMatchObject({sets:3,repUnit:'do upadku',tempo:'3-0-1-0'});
  expect(plan.prescriptions?.['chest-squeeze-isometric']).toMatchObject({repRange:{min:30,max:40},repUnit:'sekundy'});
 });
 it('każde ćwiczenie ma opis i ilustrację',()=>{for(const id of plan.exerciseIds){const exercise=exercises.find(item=>item.id===id);expect(exercise?.tip).toBeTruthy();expect(exercise?.imageUrl).toBeTruthy();expect(exercise?.thumbnailUrl).toBeTruthy()}});
});
