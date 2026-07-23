import {openDB} from 'idb';
import type {CustomPlan,Exercise,GymProfile,Recovery,TrainingSession} from './types';
const dbp=openDB('donice-training',5,{upgrade(db,oldVersion,_newVersion,tx){if(!db.objectStoreNames.contains('sessions'))db.createObjectStore('sessions',{keyPath:'id'});if(!db.objectStoreNames.contains('recovery'))db.createObjectStore('recovery',{keyPath:'id'});if(!db.objectStoreNames.contains('exercises'))db.createObjectStore('exercises',{keyPath:'id'});if(!db.objectStoreNames.contains('draft'))db.createObjectStore('draft');if(!db.objectStoreNames.contains('settings'))db.createObjectStore('settings');if(!db.objectStoreNames.contains('plans'))db.createObjectStore('plans',{keyPath:'id'});if(!db.objectStoreNames.contains('sessionBackup'))db.createObjectStore('sessionBackup',{keyPath:'id'});if(oldVersion>0&&oldVersion<4&&db.objectStoreNames.contains('plans')){const store=tx.objectStore('plans');store.openCursor().then(function migrate(cursor):Promise<void>|void{if(!cursor)return;const plan=cursor.value as CustomPlan;plan.exercises=plan.exercises.map(e=>({...e,targetRir:e.targetRir??String(e.rir??2),restSeconds:e.restSeconds??90,tempo:e.tempo??'3-0-1-0'}));cursor.update(plan);return cursor.continue().then(migrate)})}if(oldVersion>0&&oldVersion<5){const sessions=tx.objectStore('sessions');const backup=tx.objectStore('sessionBackup');sessions.openCursor().then(function copy(cursor):Promise<void>|void{if(!cursor)return;backup.put(cursor.value);return cursor.continue().then(copy)})}}});
export const db={
 sessions:async()=>{const d=await dbp;const [main,backup]=await Promise.all([d.getAll('sessions'),d.getAll('sessionBackup')]) as [TrainingSession[],TrainingSession[]];const merged=[...main];for(const saved of backup)if(!merged.some(s=>s.id===saved.id)){merged.push(saved);await d.put('sessions',saved)}return merged},
 saveSession:async(s:TrainingSession)=>{const d=await dbp;const tx=d.transaction(['sessions','sessionBackup'],'readwrite');await Promise.all([tx.objectStore('sessions').put(s),tx.objectStore('sessionBackup').put(s),tx.done])},
 deleteSession:async(id:string)=>{const d=await dbp;const tx=d.transaction(['sessions','sessionBackup'],'readwrite');await Promise.all([tx.objectStore('sessions').delete(id),tx.objectStore('sessionBackup').delete(id),tx.done])},
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
 importAll:async(data:{sessions?:TrainingSession[],recoveries?:Recovery[],exercises?:Exercise[]})=>{if(!Array.isArray(data.sessions)&&!Array.isArray(data.recoveries)&&!Array.isArray(data.exercises))throw new Error('Nieprawidłowy plik kopii');for(const s of data.sessions||[])await db.saveSession(s);for(const r of data.recoveries||[])await db.saveRecovery(r);for(const e of data.exercises||[])await db.saveExercise(e)}
};
