export function setPlayer(player_info) {
  return {
    type: "SET_PLAYER",
    player_info
  }
}

export function removePlayer() {
  return {
    type: "REMOVE_PLAYER"
  }
}

export function addSpectator(spectator) {
  return {
    type: "ADD_SPEC",
    spectator
  }
}

export function updatePlayers(player) {
  return {
    type: "UPDATE_PLAYERS",
    player
  }
}

export function updateUsers(users) {
  return {
    type: "UPDATE_USERS",
    users
  }
}

export function removeUser(id) {
  return {
    type: "REMOVE_USER",
    id
  }
}

export function exit() {
  return {
    type: "EXIT"
  }
}

export default { setPlayer, removePlayer, addSpectator, updatePlayers, updateUsers, removeUser, exit }
