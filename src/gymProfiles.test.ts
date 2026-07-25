import{describe,expect,it}from'vitest';
import{activateGymProfile,saveGymProfile}from'./gymProfiles';
import type{GymProfile}from'./types';

const croatia:GymProfile={id:'croatia',name:'Siłownia w Chorwacji',country:'Chorwacja',equipment:['Hantle'],active:true};

describe('profile siłowni',()=>{
 it('dodaje Hiszpanię bez kasowania wcześniejszej siłowni',()=>{
  const result=saveGymProfile([croatia],{id:'spain',name:'Hotelowa',country:'Hiszpania',equipment:['Hantle',' Brama ','Brama'],active:true});
  expect(result).toHaveLength(2);
  expect(result.find(gym=>gym.id==='croatia')?.active).toBe(false);
  expect(result.find(gym=>gym.id==='spain')).toMatchObject({name:'Hotelowa',country:'Hiszpania',equipment:['Hantle','Brama'],active:true});
 });
 it('przełącza aktywną siłownię i pozostawia dokładnie jedną aktywną',()=>{
  const gyms=saveGymProfile([croatia],{id:'spain',name:'Hiszpania',country:'Hiszpania',equipment:[],active:true});
  const result=activateGymProfile(gyms,'croatia');
  expect(result.filter(gym=>gym.active)).toEqual([expect.objectContaining({id:'croatia'})]);
 });
});
