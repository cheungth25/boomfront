import React from 'react';
import '../css/GameBoard.css';
import charImg from '../assests/bomberman_01.png'
import bombImg from '../assests/bomb_01.png'
import wallImg from '../assests/wall_01.png'
import spriteImg from '../assests/bomberman_sprite_moving.png'
import { Layer, Stage, Image } from 'react-konva'
import { KeyListener } from '../utils/KeyListener.js'
import TileMap from './TileMap'
import Character from './Character'
import { connect } from 'react-redux'
import { addEntity, removeEntity } from '../actions/entities'
import { setCharPos, updateCharXY } from '../actions/character'
import { bindActionCreators } from 'redux'

class GameBoard extends React.Component {

  constructor(props) {
    super(props)
    this.keyListener = new KeyListener();
    this.loopID = null;
    this.subscribers = [];

    //character speed
    this.speedX = 0;
    this.speedY = 0;

    this.state = {
      // board dimensions is 15 x 13 (x48)
      // width and height for tileSize should be the same ex: 48x48
      xDim: props.xDim,
      yDim: props.yDim,
      tileSize: props.xDim/15,
      charPos: {
        x: 48,
        y: 48
      }
    }

  }

  componentDidMount(){
    /* args: array of key events
      UP: 38
      DOWN: 40
      LEFT: 37
      RIGHT: 39
      SPACE: 32
      ESC: 27
    */
    this.keyListener.subscribe([38, 40, 37, 39, 32]);
    this.gameStart()
  }

  componentWillUnmount(){
    this.keyListener.unsubscribe();
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if (this.state.bombs !== nextState.bombs) {
  //     console.log("in bomb should update?", this.state.bombs, nextState.bombs)
  //   }
  // }

  displayBombs = () => {
    let bombs = []
    this.props.entities.forEach((entity, index)=>{
      if (entity.type === 3){
        bombs.push(
          <Bomb
            key={index}
            src={bombImg}
            x={entity.x}
            y={entity.y}
            width={entity.width}
            height={entity.height}
          />
        )
      }
    })
    return (bombs)
  }

  // ##############
  gameLoop = () => {
    // calling child's (character) playerAction method
    this.refs.character.getWrappedInstance().playerAction()
    this.props.updateCharXY()
    this.loopID = window.requestAnimationFrame(this.gameLoop);
  }

  gameStart() {
    //spawn starting game objects
    if (!this.loopID) {
      this.gameLoop();
    }
  }

  gameStop() {
    window.cancelAnimationFrame(this.loopID)
  }

  subscribe(callback){

  }

  unsubscribe(id) {

  }


  // ##############

  render(){
    let imageSrc = {1:wallImg}
    return(
      <div id='game-canvas' >
        <Stage width={this.state.xDim} height={this.state.yDim} >
          <TileMap
            src={{...imageSrc}}
            rows={13}
            columns={15}
            width={(this.state.xDim/15)}
            height={(this.state.yDim/13)}
            grid={[
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                  ]}
          />
          <Layer>

            <Character
              ref='character'
              src={spriteImg}
              x={this.props.charPos.x}
              y={this.props.charPos.y}
              width={(this.state.xDim/15)}
              height={(this.state.yDim/13)}
              keyListener={this.keyListener}
              xDim={this.state.xDim}
              yDim={this.state.yDim}
              tileSize={this.state.tileSize}
            />

            <Bomb
              src={bombImg}
              x={48}
              y={48}
              width={(this.state.xDim/15)}
              height={(this.state.yDim/13)}
            />

            {/* <SpriteTest
              src={spriteImg}
              x={this.state.charPos.x}
              y={this.state.charPos.y}
              width={(this.state.xDim/15)}
              height={(this.state.yDim/13)}
            /> */}


          </Layer>

          <Layer>
              {this.displayBombs()}
          </Layer>
        </Stage>
      </div>
    )
  }

}

//bomb
export class Bomb extends React.Component {
  state = {
    image: null
  }
  componentDidMount() {
    const image = new window.Image();
    image.src = this.props.src;
    image.onload = () => {
      this.setState({
        image: image
      });
    }
  }

  render() {
      return (
          <Image
            image={this.state.image}
            x={this.props.x}
            y={this.props.y}
            width={this.props.width}
            height={this.props.height}
          />
      );
  }
}

//######################################
function mapStateToProps(state){
  return {
    entities: state.entities.entities,
    charPos: {...state.character.charPos},
    speedX: state.character.speedX,
    speedY: state.character.speedY
  }
}

function mapDispatchToProps(dispatch){
  // dispatch(showBook())
  // return {
  //   addEntity: (entity) => {
  //     dispatch(addEntity(entity))
  //   }
  // }
  return bindActionCreators({addEntity: addEntity, removeEntity: removeEntity,
                              setCharPos: setCharPos, updateCharXY: updateCharXY
                              }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard)
