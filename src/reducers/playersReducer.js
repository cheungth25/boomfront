function playersReducer(state={
  player_info: {},
  players: [],
  spectators: []
  }, action){
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player_info: {...state.player_info, ...action.player_info} }
    case 'REMOVE_PLAYER':
      return { ...state, player_info: {} }
    case 'ADD_SPEC':
      return { ...state, spectators: [...state.spectators, action.spectator]}
    case 'UPDATE_PLAYERS':
      return { ...state, players: [...state.players.filter((player)=>{return player.id !== action.player.id}), action.player]}
    case 'UPDATE_USERS':
      return { ...state, players: action.users.filter((user)=>{return !user.spectator}),
                spectators: action.users.filter((user)=>{return user.spectator})
              }
    case 'REMOVE_USER':
      return { ...state, players: state.players.filter((user)=>{return user.id !== action.id}),
                spectators: state.spectators.filter((user)=>{return user.id !== action.id})
              }
    default:
      return state;
  }

}

export default playersReducer
