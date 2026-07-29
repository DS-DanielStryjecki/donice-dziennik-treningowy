import{describe,it,expect}from'vitest';import{exercises,templates}from'./data';
describe('import KLATKA B',()=>{
 const plan=templates.find(x=>x.variant==='B'&&x.focus==='Klatka')!;
 it('zachowuje identyfikator planu',()=>expect(plan.id).toBe('chest-b-hypertrophy-cables'));
 it('zachowuje identyfikatory i zalecenia ćwiczeń',()=>{const e=exercises.find(x=>x.id==='incline-dumbbell-press');expect(e?.namePl).toBe('Wyciskanie hantli na ławce dodatniej');expect(e?.sets).toBe(4);expect(e?.repRange).toEqual({min:8,max:12});expect(e?.targetRir).toBe('1–2');expect(e?.restSeconds).toBe(150);expect(e?.tempo).toBe('3-0-1-0')});
 it('kończy plan poziomym wyciskaniem na linkach zamiast pompek',()=>{expect(plan.exerciseIds.at(-1)).toBe('standing-cable-chest-press');expect(plan.exerciseIds).not.toContain('push-up-finisher');expect(plan.prescriptions?.['standing-cable-chest-press']).toMatchObject({sets:2,repRange:{min:15,max:20},targetRir:'0–1 w ostatniej serii',restSeconds:45,tempo:'2-0-1-2'});expect(plan.prescriptions?.['standing-cable-chest-press'].note).toContain('25–30%')});
 it('zachowuje instrukcje błędy i wskazówki',()=>{const e=exercises.find(x=>x.id==='pec-deck-fly');expect(e?.steps.length).toBeGreaterThan(2);expect(e?.errors.length).toBeGreaterThan(2);expect(e?.coachCues?.length).toBeGreaterThan(1)});
 it('przypisuje zweryfikowane grafiki do istniejących ćwiczeń',()=>{expect(exercises.find(x=>x.id==='incline-dumbbell-press')?.imageUrl).toBe('/images/exercises/incline-dumbbell-press.webp');expect(exercises.find(x=>x.id==='cable-fly')?.imageUrl).toBe('/images/exercises/cable-fly.webp');expect(exercises.find(x=>x.id==='rope-pushdown')?.imageUrl).toBe('/images/exercises/rope-pushdown.webp')});
});
