// @ts-expect-error Vitest runs in Node; the app intentionally has no @types/node dependency.
import {readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';
import {exercises as seedExercises} from './data';
import generatedImages from './exercise-images.json';

const publicImages=import.meta.glob('/public/images/exercises/*.webp');
const existsInPublic=(url:string)=>`/public${url}` in publicImages;
const readPublicImage=(url:string)=>readFileSync(new URL(`../public${url}`,import.meta.url)) as Uint8Array;
const ascii=(bytes:Uint8Array,start:number,length:number)=>String.fromCharCode(...bytes.slice(start,start+length));
const uint24le=(bytes:Uint8Array,offset:number)=>bytes[offset]|(bytes[offset+1]<<8)|(bytes[offset+2]<<16);
const webpSize=(bytes:Uint8Array)=>{
 expect(ascii(bytes,0,4)).toBe('RIFF');
 expect(ascii(bytes,8,4)).toBe('WEBP');
 const chunk=ascii(bytes,12,4);
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(chunk==='VP8 '){
  expect([...bytes.slice(23,26)]).toEqual([0x9d,0x01,0x2a]);
  return{width:view.getUint16(26,true)&0x3fff,height:view.getUint16(28,true)&0x3fff};
 }
 if(chunk==='VP8L'){
  expect(bytes[20]).toBe(0x2f);
  const bits=view.getUint32(21,true);
  return{width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};
 }
 if(chunk==='VP8X')return{width:uint24le(bytes,24)+1,height:uint24le(bytes,27)+1};
 throw new Error(`Nieobsługiwany wariant WebP: ${chunk}`);
};
const fingerprint=(bytes:Uint8Array)=>{
 let hash=14695981039346656037n;
 for(const byte of bytes)hash=BigInt.asUintN(64,(hash^BigInt(byte))*1099511628211n);
 return`${bytes.byteLength}:${hash.toString(16)}`;
};

describe('grafiki ćwiczeń',()=>{
 it('każda przypisana pełna grafika istnieje',()=>{
  const missing=seedExercises.map(e=>e.imageUrl).filter((url):url is string=>Boolean(url)).filter(url=>!existsInPublic(url));
  expect(missing).toEqual([]);
 });
 it('każda przypisana miniatura istnieje',()=>{
  const missing=seedExercises.map(e=>e.thumbnailUrl).filter((url):url is string=>Boolean(url)).filter(url=>!existsInPublic(url));
  expect(missing).toEqual([]);
 });
 it('mapa zawiera dokładnie wszystkie ćwiczenia, bez powielonych identyfikatorów',()=>{
  const mappedIds=generatedImages.map(item=>item.exerciseId);
  expect(new Set(mappedIds).size).toBe(mappedIds.length);
  expect([...mappedIds].sort()).toEqual(seedExercises.map(exercise=>exercise.id).sort());
  for(const item of generatedImages){
   const exercise=seedExercises.find(e=>e.id===item.exerciseId);
   expect(exercise?.imageUrl).toBe(item.imageUrl);
   expect(exercise?.thumbnailUrl).toBe(item.thumbnailUrl);
  }
 });
 it('nie współdzieli URL-i poza jawnie dozwoloną parą',()=>{
  const owners=new Map<string,string[]>();
  for(const item of generatedImages){
   for(const url of [item.imageUrl,item.thumbnailUrl])owners.set(url,[...(owners.get(url)||[]),item.exerciseId]);
  }
  for(const ids of owners.values()){
   if(ids.length===1)continue;
   expect([...ids].sort()).toEqual(['incline-db','incline-dumbbell-press']);
  }
 });
 it('ma wyłącznie oczekiwany duplikat zawartości incline-db',()=>{
  const groups=new Map<string,{exerciseId:string,kind:'full'|'thumb'}[]>();
  for(const item of generatedImages){
   for(const [kind,url] of [['full',item.imageUrl],['thumb',item.thumbnailUrl]] as const){
    const key=fingerprint(readPublicImage(url));
    groups.set(key,[...(groups.get(key)||[]),{exerciseId:item.exerciseId,kind}]);
   }
  }
  const duplicates=[...groups.values()].filter(group=>group.length>1);
  expect(duplicates).toHaveLength(2);
  for(const group of duplicates){
   expect(group.map(item=>item.exerciseId).sort()).toEqual(['incline-db','incline-dumbbell-press']);
   expect(new Set(group.map(item=>item.kind)).size).toBe(1);
  }
 });
 it('każdy plik jest poprawnym WebP o oczekiwanych wymiarach',()=>{
  for(const item of generatedImages){
   expect(webpSize(readPublicImage(item.imageUrl))).toEqual({width:1536,height:1024});
   expect(webpSize(readPublicImage(item.thumbnailUrl))).toEqual({width:512,height:341});
  }
 });
});
