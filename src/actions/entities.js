export function addEntity(entity) {
  return {
    type: "ADD_ENTITY",
    entity
  }
}

export function addEntities(entities) {
  return {
    type: "ADD_ENTITIES",
    entities
  }
}

export function removeEntity(id) {
  return {
    type: "REMOVE_ENTITY",
    id
  }
}

export default { addEntity, addEntities, removeEntity }

// id: entity.id,
// type: entity.entity_type,
// x: entity.x,
// y: entity.y,
// game_id: entity.game_id
// }
