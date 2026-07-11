import {openDB} from 'idb';
import type {CustomPlan,Exercise,GymProfile,Recovery,TrainingSession} from './types';
const dbp=openDB('donice-training',3,{upgrade(db){if(!db.objectStoreNames.contains('sessions'))db.createObjectStore('sessions',{keyPath:'id'});if(!db.objectStoreNames.contains('recovery'))db.createObjectStore('recovery',{keyPath:'id'});if(!db.objectStoreNames.contains('exercises'))db.createObjectStore('exercises',{keyPath:'id'});if(!db.objectStoreNames.contains('draft'))db.createObjectStore('draft');if(!db.objectStoreNames.contains('settings'))db.createObjectStore('settings');if(!db.objectStoreNames.contains('plans'))db.createObjectStore('plans',{keyPath:'id'});}});
export const db={
 sessions:async()=>await (await dbp).getAll('sessions') as TrainingSession[],
 saveSession:async(s:TrainingSession)=>await (await dbp).put('sessions',s),
 deleteSession:async(id:string)=>await (await dbp).delete('sessions',id),
 saveDraft:async(s:TrainingSession|null)=>s?await (await dbp).put('draft',s,'active'):await (await dbp).delete('draft','active'),
 draft:async()=>await (await dbp).get('draft','active') as TrainingSession|undefined,
 recoveries:async()=>((await (await dbp).getAll('recovery')) as Recovery[]).map(r=>({...r,backSoreness:r.backSoreness??0})),
 saveRecovery:async(r:Recovery)=>await (await dbp).put('recovery',r),
 customExercises:async()=>await (await dbp).getAll('exercises') as Exercise[],
 saveExercise:async(e:Exercise)=>await (await dbp).put('exercises',e),
 plans:async()=>await (await dbp).getAll('plans') as CustomPlan[],
 savePlan:async(p:CustomPlan)=>await (await dbp).put('plans',p),
 deletePlan:async(id:string)=>await (await dbp).delete('plans',id),
 gyms:async()=>await (await dbp).get('settings','gyms') as GymProfile[]|undefined,
 saveGyms:async(g:GymProfile[])=>await (await dbp).put('settings',g,'gyms'),
 clear:async()=>{const d=await dbp; await Promise.all(['sessions','recovery','exercises','draft','settings','plans'].map(x=>d.clear(x)))},
 importAll:async(data:{sessions?:TrainingSession[],recoveries?:Recovery[],exercises?:Exercise[]})=>{await db.clear();for(const s of data.sessions||[])await db.saveSession(s);for(const r of data.recoveries||[])await db.saveRecovery(r);for(const e of data.exercises||[])await db.saveExercise(e)}
};
