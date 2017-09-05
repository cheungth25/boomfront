let id = 0;
function entitiesReducer(state={
  entities:[]
  }, action){
  switch (action.type) {
    case 'ADD_ENTITY':
      id++;
      return { entities: [...state.entities, {...action.entity, id:id}] }
    case 'REMOVE_ENTITY':
      return { entities: state.entities.filter((entity)=>{return entity.id !== action.id})}
    default:
      return state;
  }

}

export default entitiesReducer
