import type{Exercise,GymProfile}from'./types';

export type EquipmentCategory='Wolne ciężary'|'Ławki i stanowiska'|'Wyciągi i uchwyty'|'Maszyny'|'Akcesoria'|'Inne';
export interface EquipmentOption{label:string;category:EquipmentCategory;exerciseIds:string[]}
export interface EquipmentRequirementGroup{alternatives:string[];optional:boolean}

// Zachowujemy pozycje ze starszych profili, a katalog widoczny w aplikacji
// rozszerzamy automatycznie o każdy sprzęt wpisany przy ćwiczeniach.
export const equipmentCatalog=[
 'Hantle','Sztanga','Talerz',
 'Ławka','Ławka pozioma','Ławka regulowana','Ławka pozioma ze stojakami','Ławka rzymska','Poręcze do dipów',
 'Brama','Wyciąg','Wyciąg górny','Wyciąg dolny',
 'Uchwyt pojedynczy','Para uchwytów pojedynczych','Uchwyt neutralny','Uchwyt do wiosłowania','Uchwyty do pompek',
 'Lina','Drążek prosty','Drążek szeroki','Gryf prosty','Gryf łamany',
 'Maszyna (dowolna)','Maszyna chest press','Maszyna shoulder press','Maszyna lateral raise','Maszyna pec deck','Maszyna reverse pec deck','Maszyna Hammer Strength','Maszyna Hammer Strength Row','Maszyna converging press',
 'Pas z obciążeniem','Guma','Mata','Stabilne podwyższenie'
]as const;

const categoryOrder:EquipmentCategory[]=['Wolne ciężary','Ławki i stanowiska','Wyciągi i uchwyty','Maszyny','Akcesoria','Inne'];
const norm=(value:string)=>value.toLocaleLowerCase('pl').normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('ł','l').replace(/\s+/g,' ').trim();
const title=(value:string)=>value.trim().replace(/^./,character=>character.toLocaleUpperCase('pl'));
const noEquipment=(value:string)=>['bez sprzetu','masa ciala','brak sprzetu'].includes(norm(value));

export const canonicalEquipmentLabel=(raw:string):string|undefined=>{
 const original=raw.trim().replace(/\s*\(opcjonalnie\)\s*/gi,'').replace(/\s+opcjonalnie\s*/gi,'').trim();
 const value=norm(original).replace(/^(dwa|2)\s+/,'');
 if(!value||noEquipment(value))return undefined;
 if(value==='hantel'||value==='hantle'||value==='hantle stabilne')return'Hantle';
 if(value==='sztanga')return'Sztanga';
 if(value==='talerz'||value==='talerze')return'Talerz';
 if(value==='lawka')return'Ławka';
 if(value==='lawka pozioma')return'Ławka pozioma';
 if(value.includes('lawka pozioma')&&value.includes('stojak'))return'Ławka pozioma ze stojakami';
 if(value.includes('lawka regulowana')||value.includes('lawka z oparciem'))return'Ławka regulowana';
 if(value.includes('lawka rzymska'))return'Ławka rzymska';
 if(value==='porecze'||value.includes('porecze do dip'))return'Poręcze do dipów';
 if(value==='brama')return'Brama';
 if(value==='wyciag')return'Wyciąg';
 if(value.includes('wyciag gorny'))return'Wyciąg górny';
 if(value.includes('wyciag dolny'))return'Wyciąg dolny';
 if(value.includes('para uchwytow pojedynczych')||value==='uchwyty pojedyncze'||value==='uchwyty pojedyncze para')return'Para uchwytów pojedynczych';
 if(value==='uchwyt pojedynczy')return'Uchwyt pojedynczy';
 if(value.includes('uchwyt neutralny')||value.includes('drazek neutralny'))return'Uchwyt neutralny';
 if(value.includes('uchwyt do wioslowania'))return'Uchwyt do wiosłowania';
 if(value==='uchwyty'||value.includes('uchwyty do pompek'))return'Uchwyty do pompek';
 if(value==='lina')return'Lina';
 if(value.includes('drazek szeroki'))return'Drążek szeroki';
 if(value==='drazek'||value.includes('drazek prosty'))return'Drążek prosty';
 if(value.includes('gryf prosty'))return'Gryf prosty';
 if(value.includes('gryf lamany'))return'Gryf łamany';
 if(value==='maszyna'||value==='maszyny')return'Maszyna (dowolna)';
 if(value==='pec deck'||value.includes('maszyna pec deck'))return'Maszyna pec deck';
 if(value.includes('reverse pec deck'))return'Maszyna reverse pec deck';
 if(value.includes('machine chest press')||value.includes('maszyna chest press'))return'Maszyna chest press';
 if(value.includes('maszyna shoulder press'))return'Maszyna shoulder press';
 if(value.includes('maszyna lateral raise'))return'Maszyna lateral raise';
 if(value.includes('hammer strength row'))return'Maszyna Hammer Strength Row';
 if(value==='hammer strength'||value==='maszyna hammer strength')return'Maszyna Hammer Strength';
 if(value.includes('converging press'))return'Maszyna converging press';
 if(value.includes('pas z obciazeniem'))return'Pas z obciążeniem';
 if(value==='guma'||value==='gumy')return'Guma';
 if(value==='mata')return'Mata';
 if(value==='podwyzszenie'||value.includes('stabilne podwyzszenie'))return'Stabilne podwyższenie';
 return title(original);
};

export const parseEquipmentRequirements=(description:string):EquipmentRequirementGroup[]=>{
 const noEquipmentAllowed=norm(description).includes('brak sprzetu');
 return description.split(',').map(group=>{
  const optional=noEquipmentAllowed||norm(group).includes('opcjonalnie');
  const alternatives=group.split(/\s+lub\s+|\s*\/\s*/i)
   .map(canonicalEquipmentLabel)
   .filter((item):item is string=>Boolean(item));
  return{alternatives:[...new Set(alternatives)],optional};
 }).filter(group=>group.alternatives.length>0);
};

export const normalizeEquipmentSelection=(items:string[])=>[
 ...new Set(items.flatMap(item=>{
  const parsed=parseEquipmentRequirements(item).flatMap(group=>group.alternatives);
  return parsed.length?parsed:[item.trim()].filter(Boolean);
 }))
];

export const equipmentCategory=(label:string):EquipmentCategory=>{
 const value=norm(label);
 if(['hantle','sztanga','talerz'].includes(value))return'Wolne ciężary';
 if(value.includes('lawka')||value.includes('porecze'))return'Ławki i stanowiska';
 if(value.includes('wyciag')||value==='brama'||value.includes('uchwyt')||value.includes('lina')||value.includes('drazek')||value.includes('gryf'))return'Wyciągi i uchwyty';
 if(value.includes('maszyna')||value.includes('pec deck')||value.includes('hammer strength'))return'Maszyny';
 if(value.includes('pas z obciazeniem')||value==='guma'||value==='mata'||value.includes('podwyzszenie'))return'Akcesoria';
 return'Inne';
};

export const equipmentOptionsForExercises=(exercises:Exercise[],persisted:string[]=[]):EquipmentOption[]=>{
 const usage=new Map<string,Set<string>>();
 for(const exercise of exercises){
  for(const group of parseEquipmentRequirements(exercise.equipment)){
   for(const label of group.alternatives){
    if(!usage.has(label))usage.set(label,new Set());
    usage.get(label)!.add(exercise.id);
   }
  }
 }
 const labels=[...new Set([
  ...equipmentCatalog,
  ...usage.keys(),
  ...normalizeEquipmentSelection(persisted)
 ])];
 const baseIndex=new Map<string,number>(equipmentCatalog.map((label,index)=>[label,index]));
 return labels.map(label=>({label,category:equipmentCategory(label),exerciseIds:[...(usage.get(label)||[])]}))
  .sort((a,b)=>{
   const category=categoryOrder.indexOf(a.category)-categoryOrder.indexOf(b.category);
   if(category)return category;
   const aIndex=baseIndex.get(a.label)??Number.MAX_SAFE_INTEGER;
   const bIndex=baseIndex.get(b.label)??Number.MAX_SAFE_INTEGER;
   return aIndex-bIndex||a.label.localeCompare(b.label,'pl');
  });
};

const satisfies=(available:string[],required:string)=>{
 const selected=normalizeEquipmentSelection(available);
 const requiredNorm=norm(required);
 if(selected.some(item=>norm(item)===requiredNorm))return true;
 if(requiredNorm.startsWith('maszyna ')){
  if(selected.some(item=>norm(item)==='maszyna (dowolna)'||norm(item)==='maszyny'))return true;
 }
 if(requiredNorm==='maszyna (dowolna)')return selected.some(item=>equipmentCategory(item)==='Maszyny');
 if(requiredNorm==='wyciag'||requiredNorm==='wyciag gorny'||requiredNorm==='wyciag dolny'){
  if(selected.some(item=>['brama','wyciag'].includes(norm(item))))return true;
 }
 if(requiredNorm==='lawka'||requiredNorm.startsWith('lawka ')){
  if(selected.some(item=>norm(item)==='lawka'))return true;
  if(requiredNorm==='lawka'&&selected.some(item=>norm(item).startsWith('lawka ')))return true;
 }
 if(requiredNorm==='uchwyt pojedynczy'&&selected.some(item=>norm(item)==='para uchwytow pojedynczych'))return true;
 return false;
};

export const isExerciseAvailable=(exercise:Exercise,profile?:GymProfile)=>{
 if(!profile)return true;
 const groups=parseEquipmentRequirements(exercise.equipment);
 if(groups.length===0)return true;
 return groups.every(group=>group.optional||group.alternatives.some(required=>satisfies(profile.equipment,required)));
};

export const equipmentCoverage=(exercises:Exercise[],profile?:GymProfile)=>{
 const available=exercises.filter(exercise=>isExerciseAvailable(exercise,profile)).length;
 return{available,total:exercises.length,missing:exercises.length-available};
};
