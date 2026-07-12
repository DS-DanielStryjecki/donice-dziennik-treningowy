import{describe,it,expect}from'vitest';
import{exercises,templates}from'./data';

describe('import KLATKA C',()=>{
 it('zastępuje stary szablon bez zmiany rotacji',()=>{const plan=templates.find(x=>x.variant==='C'&&x.focus==='Klatka');expect(plan?.id).toBe('chest-c-upper-chest-isolation');expect(plan?.exerciseIds).toHaveLength(6)});
 it('zachowuje identyfikatory i pełne zalecenia',()=>{const e=exercises.find(x=>x.id==='incline-hammer-strength-press');expect(e?.namePl).toBe('Wyciskanie na Hammer Strength skos dodatni');expect(e?.sets).toBe(4);expect(e?.repRange).toEqual({min:8,max:12});expect(e?.targetRir).toBe('1–2');expect(e?.restSeconds).toBe(135);expect(e?.tempo).toBe('3-0-1-1')});
 it('obsługuje serie mierzone w sekundach',()=>{const e=exercises.find(x=>x.id==='chest-squeeze-isometric');expect(e?.repUnit).toBe('sekundy');expect(e?.repRange).toEqual({min:20,max:40})});
 it('zachowuje instrukcje błędy wskazówki i ścieżkę obrazu',()=>{const e=exercises.find(x=>x.id==='low-to-high-cable-fly');expect(e?.steps.length).toBeGreaterThan(2);expect(e?.errors.length).toBeGreaterThan(2);expect(e?.coachCues?.length).toBeGreaterThan(1);expect(e?.imageUrl).toBe('/images/exercises/low-to-high-cable-fly.webp')});
});
