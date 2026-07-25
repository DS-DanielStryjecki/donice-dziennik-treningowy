import type{GymProfile}from'./types';

export const saveGymProfile=(gyms:GymProfile[],profile:GymProfile):GymProfile[]=>{
 const saved={...profile,name:profile.name.trim(),country:profile.country.trim()||'Nie podano',equipment:[...new Set(profile.equipment.map(item=>item.trim()).filter(Boolean))],active:true};
 return[...gyms.filter(gym=>gym.id!==saved.id).map(gym=>({...gym,active:false})),saved];
};

export const activateGymProfile=(gyms:GymProfile[],id:string):GymProfile[]=>gyms.map(gym=>({...gym,active:gym.id===id}));
