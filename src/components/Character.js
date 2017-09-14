import React from 'react';
import charSprite1 from '../assests/bomberman_sprite_02.png'
import Sprite from './Sprite'
import { connect } from 'react-redux'
import { addEntity, removeEntity } from '../actions/entities'
import { updateCharSpeed } from '../actions/character'
import { bindActionCreators } from 'redux'

class Character extends React.Component {
  constructor(props){
    super(props)

    this.charMoving = false;
    this.charState = 0;
    this.ticksPerFrame = 8;
  }

  moveUp = () => {
    this.charMoving = true;
    let charPos = {
      xMin: -(this.props.charPos.y + this.props.tileSize),
      xMax: -(this.props.charPos.y),
      xMid: -(this.props.charPos.y + this.props.tileSize/2),
      yMin: this.props.charPos.x,
      yMax: this.props.charPos.x + this.props.tileSize,
      yMid: this.props.charPos.x + this.props.tileSize/2,
    }
    this.charState = 3;
    this.props.updateCharSpeed(this.checkCollision('up', 0, -3, charPos))
  }
  moveDown = () => {
    this.charMoving = true;
    let charPos = {
      xMin: this.props.charPos.y,
      xMax: this.props.charPos.y + this.props.tileSize,
      xMid: this.props.charPos.y + this.props.tileSize/2,
      yMin: -(this.props.charPos.x + this.props.tileSize),
      yMax: -(this.props.charPos.x),
      yMid: -(this.props.charPos.x + this.props.tileSize/2)
    }
    this.charState = 0;
    this.props.updateCharSpeed(this.checkCollision('down', 0, 3, charPos))
  }
  moveLeft = () => {
    this.charMoving = true;
    let charPos = {
      xMin: -(this.props.charPos.x + this.props.tileSize),
      xMax: -(this.props.charPos.x),
      xMid: -(this.props.charPos.x + this.props.tileSize/2),
      yMin: -(this.props.charPos.y + this.props.tileSize),
      yMax: -(this.props.charPos.y),
      yMid: -(this.props.charPos.y + this.props.tileSize/2)
    }
    this.charState = 1;
    this.props.updateCharSpeed(this.checkCollision('left', -3, 0, charPos))
  }
  moveRight = () => {
    this.charMoving = true;
    let charPos = {
      xMin: this.props.charPos.x,
      xMax: this.props.charPos.x + this.props.tileSize,
      xMid: this.props.charPos.x + this.props.tileSize/2,
      yMin: this.props.charPos.y,
      yMax: this.props.charPos.y + this.props.tileSize,
      yMid: this.props.charPos.y + this.props.tileSize/2,
    }
    this.charState = 2;
    this.props.updateCharSpeed(this.checkCollision('right', 3, 0, charPos))
  }
  clearMove = () => {
    // this.charMoving = false;
    this.props.updateCharSpeed({x:0, y:0})
  }

  // collision
  checkCollision = (direction, initSpeedX, initSpeedY, charPos) => {
    // collision logic changes based on direction
    // Characters and all Entities have x & y dimensions
    //  /-> xMin
    //  |   |-> xMid              direction:
    //  |   |   /-> xMax            right
    //  --------- -> yMin         ---------
    //  |       |                 |        |
    //  | Char. | -> yMid   -->   | Entity |
    //  |       |                 |        |
    //  --------- -> yMax         ---------
    let speedX = initSpeedX;
    let speedY = initSpeedY;
    let collisionDetected = false;
    let entityPos = {}

    this.props.entities.forEach((entity)=>{
      let midOffsetTop = this.props.tileSize/3;
      let midOffsetBot = -this.props.tileSize/3;
      switch (direction) {
        case 'up':
          entityPos = {
            xMin: -(entity.y + this.props.tileSize),
            xMax: -(entity.y),
            xMid: -(entity.y + this.props.tileSize/2),
            yMin: entity.x,
            yMax: entity.x + this.props.tileSize,
            yMid: entity.x + this.props.tileSize/2,
          }
          break;
        case 'down':
          entityPos = {
            xMin: entity.y,
            xMax: entity.y + this.props.tileSize,
            xMid: entity.y + this.props.tileSize/2,
            yMin: -(entity.x + this.props.tileSize),
            yMax: -(entity.x),
            yMid: -(entity.x + this.props.tileSize/2),
          }
          break;
        case 'left':
          entityPos = {
            xMin: -(entity.x + this.props.tileSize),
            xMax: -(entity.x),
            xMid: -(entity.x + this.props.tileSize/2),
            yMin: -(entity.y + this.props.tileSize),
            yMax: -(entity.y),
            yMid: -(entity.y + this.props.tileSize/2),
          }
          break;
        case 'right':
          entityPos = {
            xMin: entity.x,
            xMax: entity.x + this.props.tileSize,
            xMid: entity.x + this.props.tileSize/2,
            yMin: entity.y,
            yMax: entity.y + this.props.tileSize,
            yMid: entity.y + this.props.tileSize/2,
          }
          break;
        default:
          break
      }
      // @#$ need to check if character is in the middle of an entity some how

      //check if character reached an entity on the x-axis
      if ((charPos.xMax === entityPos.xMin) && !collisionDetected) {
        //collision detected if character and entity has conflicting mid-point ranges
        if (charPos.yMid+midOffsetTop >= entityPos.yMin && charPos.yMid+midOffsetBot <= entityPos.yMax) {
          //debugger
          collisionDetected = true;
          speedX = 0;
          speedY = 0;
        }
      }

    })//entities.forEach
    return {x:speedX, y:speedY}
  }

  render(){
    return(

      <Sprite
        ref='sprite'
        src={charSprite1}
        x={this.props.charPos.x}
        y={this.props.charPos.y}
        width={this.props.xDim/15}
        height={this.props.yDim/13}
        cropWidth={32}
        cropHeight={32}
        steps={[3,3,3,3,6]}
        charState={this.charState}
        triggerSprite={this.charMoving}
        ticksPerFrame={this.ticksPerFrame}
      />
    )
  }

}

function mapStateToProps(state){
  return {
    entities: state.entities.entities,
    charPos: {...state.character.charPos},
    speedX: state.character.speedX,
    speedY: state.character.speedY
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({addEntity: addEntity, removeEntity: removeEntity,
                              updateCharSpeed: updateCharSpeed
                              }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Character)
