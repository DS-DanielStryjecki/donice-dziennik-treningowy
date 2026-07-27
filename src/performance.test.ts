import{describe,expect,it}from'vitest';
import{previousExercisePerformance,suggestedSetValues}from'./performance';
import type{TrainingSession}from'./types';

const session=(id:string,date:string,done:boolean,weight:number,reps:number,rir=2):TrainingSession=>({id,templateId:'x',name:'Trening',focus:'Barki',startedAt:date,exercises:[{exerciseId:'raise',notes:'',sets:[{id:id+'-set',kind:'working',weight,reps,rir,done}]}]});

describe('pamięć wyników ćwiczenia',()=>{
 it('pomija aktywny wpis bez wykonanych serii i znajduje poprzedni wynik',()=>{const result=previousExercisePerformance([session('old','2026-07-20T10:00:00Z',true,12,12),session('active','2026-07-21T10:00:00Z',false,0,0)],'raise','active');expect(result?.sets[0]).toMatchObject({weight:12,reps:12})});
 it('proponuje większy ciężar po osiągnięciu górnej granicy',()=>{const performance=previousExercisePerformance([session('old','2026-07-20T10:00:00Z',true,20,12)],'raise');expect(suggestedSetValues(1,performance,{min:8,max:12},'2')[0]).toEqual({weight:22,reps:8,rir:2})});
 it('proponuje dodatkowe powtórzenie wewnątrz zakresu',()=>{const performance=previousExercisePerformance([session('old','2026-07-20T10:00:00Z',true,20,9)],'raise');expect(suggestedSetValues(1,performance,{min:8,max:12},'2')[0]).toEqual({weight:20,reps:10,rir:2})});
 it('nie wymusza progresji, gdy poprzednia seria była cięższa niż cel RIR',()=>{const performance=previousExercisePerformance([session('old','2026-07-20T10:00:00Z',true,20,10,0)],'raise');expect(suggestedSetValues(1,performance,{min:8,max:12},'2')[0]).toEqual({weight:20,reps:10,rir:2})});
 it('zachowuje docelowe RIR zero zamiast zamieniać je na dwa',()=>expect(suggestedSetValues(1,undefined,{min:10,max:12},'0–1')[0]).toEqual({weight:null,reps:10,rir:0}));
});
