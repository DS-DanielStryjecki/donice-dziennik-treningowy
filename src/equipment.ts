import type{Exercise,GymProfile}from'./types';
export const equipmentCatalog=['Hantle','Sztanga','Ławka','Brama','Wyciąg górny','Wyciąg dolny','Maszyny','Pec deck','Hammer Strength','Drążek','Lina','Uchwyty pojedyncze','Gryf prosty','Gryf łamany','Gumy','Mata','Ławka rzymska'] as const;
const norm=(value:string)=>value.toLocaleLowerCase('pl').normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('ł','l');
const has=(available:string[],needle:string)=>available.some(item=>norm(item).includes(norm(needle))||norm(needle).includes(norm(item)));
export const isExerciseAvailable=(exercise:Exercise,profile?:GymProfile)=>{
 if(!profile||profile.equipment.length===0)return true;
 const required=norm(exercise.equipment);
 if(required.includes('bez sprzetu')||required.includes('masa ciala')||required.includes('opcjonalnie'))return true;
 if(required.includes('lub'))return required.split('lub').some(part=>has(profile.equipment,part.trim()));
 return required.split(',').every(part=>{const item=part.trim();if(item==='maszyna')return has(profile.equipment,'Maszyny')||profile.equipment.some(x=>norm(x).includes('maszyn'));if(item==='wyciag')return has(profile.equipment,'Brama')||profile.equipment.some(x=>norm(x).includes('wyciag'));return has(profile.equipment,item)});
};
export const equipmentCoverage=(exercises:Exercise[],profile?:GymProfile)=>{const available=exercises.filter(e=>isExerciseAvailable(e,profile)).length;return{available,total:exercises.length,missing:exercises.length-available}};
