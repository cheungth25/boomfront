export function setCharID(id) {
  return {
    type: "SET_CHAR_ID",
    id
  }
}

export function setCharStats(stats) {
  return {
    type: "SET_CHAR_STATS",
    stats
  }
}

export function setCharPos(charPos) {
  return {
    type: "SET_CHAR_POS",
    charPos
  }
}

export function updateCharSpeed(character) {
  return {
    type: "UPDATE_SPEED",
    speedX: character.x,
    speedY: character.y
  }
}

export function updateCharXY() {
  return {
    type: "UPDATE_XY"
  }
}

export function addCharacters(characters) {
  return {
    type: "ADD_CHARACTERS",
    characters
  }
}

export function updateCharacters(character) {
  return {
    type: "UPDATE_CHARACTERS",
    character
  }
}

export function removeCharacters(id) {
  return {
    type: "REMOVE_CHARACTERS",
    id
  }
}

export function killPlayer() {
  return {
    type: "KILL_PLAYER"
  }
}

export default { setCharID, setCharStats, setCharPos, updateCharSpeed, updateCharXY, addCharacters, updateCharacters, removeCharacters, killPlayer }
