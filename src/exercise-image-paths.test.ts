import {describe,expect,it} from 'vitest';
import {exercises} from './data';
import generatedImages from './exercise-images.json';

const publicImages=import.meta.glob('/public/images/exercises/*.webp');
const existsInPublic=(url:string)=>`/public${url}` in publicImages;

describe('grafiki ćwiczeń',()=>{
 it('każda przypisana pełna grafika istnieje',()=>{
  const missing=exercises.map(e=>e.imageUrl).filter((url):url is string=>Boolean(url)).filter(url=>!existsInPublic(url));
  expect(missing).toEqual([]);
 });
 it('każda przypisana miniatura istnieje',()=>{
  const missing=exercises.map(e=>e.thumbnailUrl).filter((url):url is string=>Boolean(url)).filter(url=>!existsInPublic(url));
  expect(missing).toEqual([]);
 });
 it('podłącza cały otrzymany pakiet 42 ilustracji',()=>{
  expect(generatedImages).toHaveLength(42);
  for(const item of generatedImages){
   const exercise=exercises.find(e=>e.id===item.exerciseId);
   expect(exercise?.imageUrl).toBe(item.imageUrl);
   expect(exercise?.thumbnailUrl).toBe(item.thumbnailUrl);
  }
 });
});
