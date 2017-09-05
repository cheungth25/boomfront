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

export default { setCharPos, updateCharSpeed, updateCharXY }
