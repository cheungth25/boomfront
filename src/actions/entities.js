export function addEntity(entity) {
  return {
    type: "ADD_ENTITY",
    entity
  }
}

export function removeEntity(id) {
  return {
    type: "REMOVE_ENTITY",
    id
  }
}

export default { addEntity, removeEntity }
