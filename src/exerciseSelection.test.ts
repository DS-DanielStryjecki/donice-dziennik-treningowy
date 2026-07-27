import{describe,expect,it}from'vitest';
import{exercisesForFocus}from'./exerciseSelection';
import type{Exercise}from'./types';

const exercise=(id:string,muscles:Exercise['muscles']):Exercise=>({id,namePl:id,nameEn:'',muscles,equipment:'Hantle',steps:[],errors:[]});
const exercises=[exercise('barki',['Barki']),exercise('plecy',['Plecy']),exercise('oba',['Barki','Plecy'])];

describe('lista wyboru ćwiczeń',()=>{
 it('domyślnie pokazuje wyłącznie ćwiczenia aktualnej partii',()=>expect(exercisesForFocus(exercises,'Barki').map(item=>item.id).sort()).toEqual(['barki','oba']));
 it('po przełączeniu pokazuje wszystkie partie',()=>expect(exercisesForFocus(exercises,'Barki',true)).toHaveLength(3));
});

