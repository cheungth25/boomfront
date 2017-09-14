function characterReducer(state={
  charID: null,
  charStats: {
    bombStrength:1,
    bombNum:1
  },
  charPos: { x: 48, y: 48 },
  speedX: 0,
  speedY: 0,
  playerAlive: true,
  characters: []

  }, action){
  switch (action.type) {
    case 'SET_CHAR_ID':
      return {...state, charID: action.id}
    case "SET_CHAR_STATS":
      return {...state, charStats: action.stats}
    case 'SET_CHAR_POS':
      return { ...state, charPos: action.charPos }
    case 'UPDATE_SPEED':
      return { ...state, speedX: action.speedX, speedY: action.speedY }
    case 'UPDATE_XY':
      return {...state, charPos: {
                x: state.charPos.x + state.speedX,
                y: state.charPos.y + state.speedY
              }}
    case 'ADD_CHARACTERS':
      return {...state, characters: action.characters}
    case 'UPDATE_CHARACTERS':
      return {...state, characters: [...state.characters.filter((character)=>{return character.id !== action.character.id}), {...action.character, alive:true}]}
    case 'REMOVE_CHARACTERS':
      return {...state, characters: state.characters.filter((char)=>{return action.id !== char.id })}
    case 'KILL_PLAYER':
      return {...state, playerAlive: false}
    default:
      return state;
  }

}

export default characterReducer
