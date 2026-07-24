import type {Exercise,TrainingTemplate} from './types';
import chestBSource from './klatka_b_plan.json';
import chestCSource from './klatka_c_plan.json';
import generatedImages from './exercise-images.json';
const imageFor=(id:string)=>generatedImages.find(item=>item.exerciseId===id);
const ex=(id:string,namePl:string,nameEn:string,muscles:Exercise['muscles'],equipment:string,tip?:string,alternatives:string[]=[],imageUrl?:string):Exercise=>({id,namePl,nameEn,muscles,equipment,tip:tip||'Kontroluj fazę opuszczania i dobierz ciężar pozwalający utrzymać pełny, bezbolesny zakres.',alternatives,imageUrl:imageUrl||imageFor(id)?.imageUrl,thumbnailUrl:imageFor(id)?.thumbnailUrl,illustrationStart:`/exercise-art/${id}-start.webp`,illustrationEnd:`/exercise-art/${id}-end.webp`,steps:['Ustaw stabilną pozycję i napnij brzuch.','Rozpocznij ruch z kontrolowanym napięciem mięśni docelowych.','Wykonaj pełny, bezbolesny zakres bez szarpania.','Wróć wolniej do pozycji początkowej i zachowaj napięcie.'],errors:['Zbyt duży ciężar i skrócony zakres ruchu','Szarpanie ciężarem lub utrata stabilnej pozycji','Ignorowanie bólu stawowego']});
const chestBExercises:Exercise[]=chestBSource.plan.exercises.map(item=>({id:item.id,namePl:item.namePl,nameEn:item.nameEn,muscles:['Klatka'],equipment:item.equipment.join(', '),steps:item.instructions,errors:item.commonMistakes,tip:item.coachCues[0],coachCues:item.coachCues,imageUrl:imageFor(item.id)?.imageUrl||item.imageUrl,thumbnailUrl:imageFor(item.id)?.thumbnailUrl,sets:item.sets,repRange:item.repRange,targetRir:item.targetRir,restSeconds:item.restSeconds,tempo:item.tempo,category:item.category,primaryMuscles:item.primaryMuscles,secondaryMuscles:item.secondaryMuscles}));
const chestCExercises:Exercise[]=chestCSource.plan.exercises.map(item=>({id:item.id,namePl:item.namePl,nameEn:item.nameEn,muscles:['Klatka'],equipment:item.equipment.join(', '),steps:item.instructions,errors:item.commonMistakes,tip:item.coachCues[0],coachCues:item.coachCues,imageUrl:imageFor(item.id)?.imageUrl||item.imageUrl,thumbnailUrl:imageFor(item.id)?.thumbnailUrl,sets:item.sets,repRange:item.repRange,repUnit:'repUnit'in item?item.repUnit:undefined,targetRir:item.targetRir,restSeconds:item.restSeconds,tempo:item.tempo,category:item.category,primaryMuscles:item.primaryMuscles,secondaryMuscles:item.secondaryMuscles}));
export const exercises:Exercise[]=[
 ex('bench','Wyciskanie sztangi leżąc','Barbell Bench Press',['Klatka','Ramiona'],'Sztanga, ławka'),
 ex('incline-db','Wyciskanie hantli na skosie','Incline Dumbbell Press',['Klatka','Barki'],'Hantle, ławka'),
 ex('flat-db','Wyciskanie hantli na ławce poziomej','Flat Dumbbell Press',['Klatka','Ramiona'],'Hantle, ławka'),
 ex('weighted-dips','Dipy z obciążeniem','Weighted Dips',['Klatka','Ramiona'],'Poręcze, pas z obciążeniem'),
 ex('cable-fly','Rozpiętki na bramie','Cable Fly',['Klatka'],'Brama',undefined,[],'/images/exercises/cable-fly.webp'),
 ex('chest-press','Wyciskanie na maszynie','Machine Chest Press',['Klatka','Ramiona'],'Maszyna'),
 ex('low-high','Rozpiętki z dołu','Low-to-High Cable Fly',['Klatka'],'Brama'),
 ex('pec-deck','Butterfly','Pec Deck Fly',['Klatka'],'Maszyna'),
 ex('pushup','Pompki','Push-Up',['Klatka','Ramiona'],'Masa ciała'),
 ex('arnold','Wyciskanie Arnolda','Arnold Press',['Barki'],'Hantle'),
 ex('seated-lateral','Wznosy bokiem siedząc','Seated Dumbbell Lateral Raise',['Barki'],'Hantle'),
 ex('rear-delt','Jednorącz odwodzenie na tył barku','One-Arm Cable Rear Delt Fly',['Barki'],'Brama'),
 ex('front-raise','Jednorącz wznos linki przodem','Single-Arm Cable Front Raise',['Barki'],'Brama','Prowadź rękę lekko po skosie na zewnątrz, aby lepiej poczuć przedni akton barku'),
 ex('machine-lateral','Wznosy bokiem na maszynie','Machine Lateral Raise',['Barki'],'Maszyna'),
 ex('lateral-finisher','Finisher wznosów bokiem','Lateral Raise Finisher',['Barki'],'Hantle'),
 ex('db-shoulder-press','Wyciskanie hantli siedząc','Seated Dumbbell Shoulder Press',['Barki','Ramiona'],'Hantle, ławka'),
 ex('machine-shoulder-press','Wyciskanie barkowe na maszynie','Machine Shoulder Press',['Barki','Ramiona'],'Maszyna'),
 ex('db-lateral','Wznosy hantli bokiem','Dumbbell Lateral Raise',['Barki'],'Hantle',undefined,['cable-lateral','machine-lateral']),
 ex('reverse-pec','Odwrotne rozpiętki na maszynie','Reverse Pec Deck',['Barki','Plecy'],'Maszyna',undefined,['rear-delt']),
 ex('cable-lateral','Wznosy bokiem na wyciągu','Cable Lateral Raise',['Barki'],'Brama',undefined,['machine-lateral','db-lateral']),
 ex('neutral-pulldown','Ściąganie drążka chwytem neutralnym','Neutral-Grip Lat Pulldown',['Plecy'],'Wyciąg górny'),
 ex('onearm-pulldown','Ściąganie wyciągu jednorącz','One-Arm Lat Pulldown',['Plecy'],'Wyciąg górny'),
 ex('seated-row','Wiosłowanie siedząc na wyciągu','Seated Cable Row',['Plecy','Ramiona'],'Wyciąg dolny'),
 ex('straightarm','Ściąganie prostych ramion','Straight-Arm Pulldown',['Plecy'],'Brama'),
 ex('face-pull','Przyciąganie liny do twarzy','Face Pull',['Plecy','Barki'],'Brama',undefined,['rear-delt']),
 ex('hammer-row','Wiosłowanie Hammer Strength jednorącz','One-Arm Hammer Strength Row',['Plecy','Ramiona'],'Maszyna Hammer Strength'),
 ex('wide-pulldown','Ściąganie drążka szerokim chwytem','Wide-Grip Pulldown',['Plecy'],'Wyciąg górny'),
 ex('shrugs','Szrugsy','Shrugs',['Plecy'],'Hantle lub sztanga'),
 ex('back-extension','Prostowanie grzbietu','Back Extension',['Plecy','Nogi'],'Ławka rzymska'),
 ex('incline-curl','Uginanie hantli na ławce skośnej','Incline Dumbbell Curl',['Ramiona'],'Hantle, ławka'),
 ex('cable-curl','Uginanie ramion na wyciągu','Cable Curl',['Ramiona'],'Wyciąg'),
 ex('hammer-curl','Uginanie młotkowe','Hammer Curl',['Ramiona'],'Hantle'),
 ex('rope-pushdown','Prostowanie ramion z liną','Rope Pushdown',['Ramiona'],'Wyciąg',undefined,[],'/images/exercises/rope-pushdown.webp'),
 ex('overhead-triceps','Wyprost tricepsa nad głową','Overhead Cable Triceps Extension',['Ramiona'],'Wyciąg'),
 ex('arm-finisher','Finisher ramion','Arm Finisher',['Ramiona'],'Hantle lub wyciąg'),
 ex('walk','Spacer','Walk',['Regeneracja'],'Bez sprzętu'),
 ex('shoulder-mobility','Lekka mobilizacja obręczy barkowej','Light Shoulder-Girdle Mobility',['Regeneracja','Barki'],'Guma opcjonalnie'),
 ex('stretching','Łagodne rozciąganie','Gentle Stretching',['Regeneracja'],'Mata'),
 ex('sleep-hydration','Sen i nawodnienie','Sleep and Hydration',['Regeneracja'],'Bez sprzętu'),
 ...chestBExercises,
 ...chestCExercises
];
export const templates:TrainingTemplate[]=[
 {id:'chest-a',name:'KLATKA A – SIŁA + GĘSTOŚĆ',focus:'Klatka',variant:'A',description:'Maksymalna hipertrofia · siła · grubość mięśni',exerciseIds:['incline-db','flat-db','weighted-dips','incline-hammer-strength-press','chest-squeeze-isometric'],prescriptions:{'incline-db':{sets:4,repRange:{min:6,max:10},targetRir:'1–2',restSeconds:150},'flat-db':{sets:3,repRange:{min:6,max:10},targetRir:'1–2',restSeconds:150},'weighted-dips':{sets:3,repRange:{min:6,max:10},targetRir:'1–2',restSeconds:150},'incline-hammer-strength-press':{sets:3,repRange:{min:8,max:12},targetRir:'1–2',restSeconds:135},'chest-squeeze-isometric':{sets:3,repRange:{min:30,max:60},repUnit:'sekundy',targetRir:'1–2',restSeconds:60}}},
 {id:chestBSource.plan.id,name:chestBSource.plan.name,nameEn:chestBSource.plan.nameEn,focus:'Klatka',variant:'B',description:chestBSource.plan.goal,goal:chestBSource.plan.goal,notes:chestBSource.plan.notes,estimatedDurationMin:chestBSource.plan.estimatedDurationMin,sourceSchemaVersion:chestBSource.schemaVersion,exerciseIds:chestBSource.plan.exercises.sort((a,b)=>a.order-b.order).map(item=>item.id)},
 {id:chestCSource.plan.id,name:chestCSource.plan.name,nameEn:chestCSource.plan.nameEn,focus:'Klatka',variant:'C',description:chestCSource.plan.goal,goal:chestCSource.plan.goal,notes:chestCSource.plan.notes,estimatedDurationMin:chestCSource.plan.estimatedDurationMin,sourceSchemaVersion:chestCSource.schemaVersion,exerciseIds:[...chestCSource.plan.exercises].sort((a,b)=>a.order-b.order).map(item=>item.id)},
 {id:'chest-d',name:'KLATKA D',focus:'Klatka',variant:'D',description:'Pompa · dopalenie · intensyfikacja',exerciseIds:['chest-press','pec-deck','pushup']},
 {id:'shoulders-a',name:'BARKI A',focus:'Barki',variant:'A',description:'Ciężar i masa',exerciseIds:['db-shoulder-press','machine-shoulder-press','db-lateral','reverse-pec','cable-lateral'],optionalIds:['lateral-finisher']},
 {id:'shoulders-b',name:'BARKI B',focus:'Barki',variant:'B',description:'Objętość i kompletna praca wszystkich aktonów',exerciseIds:['arnold','seated-lateral','rear-delt','front-raise','machine-lateral','lateral-finisher']},
 {id:'back-a',name:'PLECY A',focus:'Plecy',variant:'A',description:'Szerokość grzbietu',exerciseIds:['neutral-pulldown','onearm-pulldown','seated-row','straightarm','face-pull']},
 {id:'back-b',name:'PLECY B',focus:'Plecy',variant:'B',description:'Grubość grzbietu bez nacisku na klatkę',exerciseIds:['hammer-row','seated-row','wide-pulldown','straightarm','shrugs'],optionalIds:['back-extension']},
 {id:'arms-a',name:'RAMIONA A',focus:'Ramiona',variant:'A',description:'Biceps i triceps',exerciseIds:['incline-curl','cable-curl','hammer-curl','rope-pushdown','overhead-triceps'],optionalIds:['arm-finisher']},
 {id:'recovery',name:'REGENERACJA',focus:'Regeneracja',description:'Ruch lekki, mobilizacja, sen i nawodnienie',exerciseIds:['walk','shoulder-mobility','stretching','sleep-hydration']}
];
