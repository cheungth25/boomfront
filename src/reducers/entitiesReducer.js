function entitiesReducer(state={
  entities:[]
  }, action){
  switch (action.type) {
    case 'ADD_ENTITY':
      // console.log('in add_entity', action.entity)
      return { ...state, entities: [...state.entities, action.entity] }
    case 'ADD_ENTITIES':
    // console.log('in add entities', state.entities ,action)
      return { ...state, entities: action.entities}
    case 'REMOVE_ENTITY':
      // console.log('in remove_entity', action.id)
      return { ...state, entities: state.entities.filter((entity)=>{return entity.id !== action.id})}
    default:
      return state;
  }

}

export default entitiesReducer
