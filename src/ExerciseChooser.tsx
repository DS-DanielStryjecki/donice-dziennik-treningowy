import{useMemo,useState}from'react';
import{Plus,Search,X}from'lucide-react';
import{exercisesForFocus}from'./exerciseSelection';
import{isExerciseAvailable}from'./equipment';
import type{Exercise,GymProfile,Muscle}from'./types';

const focuses:Muscle[]=['Klatka','Barki','Plecy','Ramiona','Nogi','Core','Regeneracja'];

export function ExerciseChooser({focus,exercises,gym,onClose,onSelect,onCreate}:{focus:Muscle;exercises:Exercise[];gym?:GymProfile;onClose:()=>void;onSelect:(exercise:Exercise)=>void;onCreate:()=>void}){
 const[all,setAll]=useState(false);const[query,setQuery]=useState('');
 const list=useMemo(()=>exercisesForFocus(exercises,focus,all,query),[exercises,focus,all,query]);
 return <div className="modal-bg"><div className="modal exercise-chooser"><button className="modal-close" onClick={onClose}><X/></button><small>ZMIANA ĆWICZENIA</small><h2>Wybierz ćwiczenie</h2><div className="chooser-scope"><button className={!all?'active':''} onClick={()=>setAll(false)}>Tylko: {focus}</button><button className={all?'active':''} onClick={()=>setAll(true)}>Wszystkie partie</button></div><label className="chooser-search"><Search/><input autoFocus placeholder="Szukaj po nazwie lub sprzęcie…" value={query} onChange={event=>setQuery(event.target.value)}/></label><button className="create-exercise" onClick={onCreate}><Plus/> Utwórz własne ćwiczenie</button><div className="chooser-list">{list.map(exercise=>{const available=isExerciseAvailable(exercise,gym);return <button key={exercise.id} onClick={()=>onSelect(exercise)}><b>{exercise.namePl}</b><small>{exercise.nameEn||'Bez nazwy angielskiej'}</small><span>{exercise.muscles.join(' · ')} · {exercise.equipment}</span><em>{available?'Dostępne na tej siłowni':'Brak sprzętu na tej siłowni'}</em></button>})}</div></div></div>;
}

export function CustomExerciseModal({initialFocus,onClose,onSave}:{initialFocus:Muscle;onClose:()=>void;onSave:(exercise:Exercise)=>void}){
 const[namePl,setNamePl]=useState('');const[nameEn,setNameEn]=useState('');const[focus,setFocus]=useState<Muscle>(initialFocus);const[equipment,setEquipment]=useState('');const[description,setDescription]=useState('');const[cues,setCues]=useState('');const[errors,setErrors]=useState('');
 const lines=(value:string)=>value.split('\n').map(line=>line.trim()).filter(Boolean);
 const save=()=>{if(!namePl.trim()||!equipment.trim()||!description.trim())return;const coachCues=lines(cues);onSave({id:crypto.randomUUID(),namePl:namePl.trim(),nameEn:nameEn.trim(),muscles:[focus],equipment:equipment.trim(),description:description.trim(),steps:lines(description),errors:lines(errors).length?lines(errors):['Brak zapisanych błędów — uzupełnij po pierwszym treningu.'],coachCues,tip:coachCues[0],custom:true})};
 return <div className="modal-bg"><div className="modal custom-exercise-modal"><button className="modal-close" onClick={onClose}><X/></button><small>WŁASNE ĆWICZENIE</small><h2>Opisz swoje ćwiczenie</h2><label>Nazwa polska *<input autoFocus value={namePl} onChange={event=>setNamePl(event.target.value)}/></label><label>Nazwa angielska<input value={nameEn} onChange={event=>setNameEn(event.target.value)}/></label><label>Partia *<select value={focus} onChange={event=>setFocus(event.target.value as Muscle)}>{focuses.map(item=><option key={item}>{item}</option>)}</select></label><label>Sprzęt *<input placeholder="np. Hantle, ławka" value={equipment} onChange={event=>setEquipment(event.target.value)}/></label><label>Opis wykonania *<textarea placeholder="Każdy krok możesz wpisać w nowej linii" value={description} onChange={event=>setDescription(event.target.value)}/></label><label>Wskazówki techniczne<textarea placeholder="Jedna wskazówka w każdym wierszu" value={cues} onChange={event=>setCues(event.target.value)}/></label><label>Najczęstsze błędy<textarea placeholder="Jeden błąd w każdym wierszu" value={errors} onChange={event=>setErrors(event.target.value)}/></label><button className="primary" disabled={!namePl.trim()||!equipment.trim()||!description.trim()} onClick={save}><Plus/> Zapisz własne ćwiczenie</button></div></div>;
}

