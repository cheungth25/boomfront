function characterReducer(state={
  charPos: { x: 48, y: 48 },
  speedX: 0,
  speedY: 0,

  }, action){
  switch (action.type) {
    case 'SET_CHAR_POS':
      return { ...state, charPos: action.charPos }
    case 'UPDATE_SPEED':
      return { ...state, speedX: action.speedX, speedY: action.speedY }
    case 'UPDATE_XY':
      return {...state, charPos: {
                x: state.charPos.x + state.speedX,
                y: state.charPos.y + state.speedY
              }}
    default:
      return state;
  }

}

export default characterReducer
