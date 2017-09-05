import React from 'react';
import {Image} from 'react-konva'
import { connect } from 'react-redux'
import { addEntity, removeEntity } from '../actions/entities'
import { updateCharSpeed, updateCharXY } from '../actions/character'
import { bindActionCreators } from 'redux'

class Character extends React.Component {
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

  playerAction = () => {
    this.clearMove();
    if ( this.props.keyListener.isPressed(32) ) { //SPACE
      this.dropBomb();
    }else if ( this.props.keyListener.isPressed(38) ) { //UP
      this.moveUp();
    }else if ( this.props.keyListener.isPressed(40) ) { //DOWN
      this.moveDown();
    }else if ( this.props.keyListener.isPressed(37) ) { //LEFT
      this.moveLeft();
    }else if ( this.props.keyListener.isPressed(39) ) { //RIGHT
      this.moveRight();
    }
  }
  // character actions
  dropBomb = () => {
    //need to calculate nearest grid box for bomb
    let nearestX = this.props.charPos.x;
    let nearestY = this.props.charPos.y;
    let bomb = {
      type:3,
      x: nearestX,
      y: nearestY,
      width: this.props.xDim/15,
      height: this.props.yDim/13
    }
    this.props.addEntity(bomb)
    //debugger
    //fix this later (bomb should destroy itself after creation)
    // this.props.entities[this.props.entities.length-1]
    setTimeout(()=>{
      this.props.removeEntity(this.props.entities[this.props.entities.length-1].id)
    },3000)
  }
  moveUp = () => {
    let charPos = {
      xMin: -(this.props.charPos.y + this.props.tileSize),
      xMax: -(this.props.charPos.y),
      xMid: -(this.props.charPos.y + this.props.tileSize/2),
      yMin: this.props.charPos.x,
      yMax: this.props.charPos.x + this.props.tileSize,
      yMid: this.props.charPos.x + this.props.tileSize/2,
    }
    this.props.updateCharSpeed(this.checkCollision('up', 0, -1, charPos))
  }
  moveDown = () => {
    let charPos = {
      xMin: this.props.charPos.y,
      xMax: this.props.charPos.y + this.props.tileSize,
      xMid: this.props.charPos.y + this.props.tileSize/2,
      yMin: -(this.props.charPos.x + this.props.tileSize),
      yMax: -(this.props.charPos.x),
      yMid: -(this.props.charPos.x + this.props.tileSize/2)
    }
    this.props.updateCharSpeed(this.checkCollision('down', 0, 1, charPos))
  }
  moveLeft = () => {
    let charPos = {
      xMin: -(this.props.charPos.x + this.props.tileSize),
      xMax: -(this.props.charPos.x),
      xMid: -(this.props.charPos.x + this.props.tileSize/2),
      yMin: -(this.props.charPos.y + this.props.tileSize),
      yMax: -(this.props.charPos.y),
      yMid: -(this.props.charPos.y + this.props.tileSize/2)
    }
    this.props.updateCharSpeed(this.checkCollision('left', -1, 0, charPos))
  }
  moveRight = () => {
    let charPos = {
      xMin: this.props.charPos.x,
      xMax: this.props.charPos.x + this.props.tileSize,
      xMid: this.props.charPos.x + this.props.tileSize/2,
      yMin: this.props.charPos.y,
      yMax: this.props.charPos.y + this.props.tileSize,
      yMid: this.props.charPos.y + this.props.tileSize/2,
    }
    this.props.updateCharSpeed(this.checkCollision('right', 1, 0, charPos))
  }
  clearMove = () => {
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
      switch (direction) {
        case 'up':
          entityPos = {
            xMin: -(entity.y + entity.width),
            xMax: -(entity.y),
            xMid: -(entity.y + entity.width/2),
            yMin: entity.x,
            yMax: entity.x + entity.height,
            yMid: entity.x + entity.height/2,
          }
          break;
        case 'down':
          entityPos = {
            xMin: entity.y,
            xMax: entity.y + entity.height,
            xMid: entity.y + entity.height/2,
            yMin: -(entity.x + entity.width),
            yMax: -(entity.x),
            yMid: -(entity.x + entity.width/2),
          }
          break;
        case 'left':
          entityPos = {
            xMin: -(entity.x + entity.width),
            xMax: -(entity.x),
            xMid: -(entity.x + entity.width/2),
            yMin: -(entity.y + entity.width),
            yMax: -(entity.y),
            yMid: -(entity.y + entity.width/2),
          }
          break;
        case 'right':
          entityPos = {
            xMin: entity.x,
            xMax: entity.x + entity.width,
            xMid: entity.x + entity.width/2,
            yMin: entity.y,
            yMax: entity.y + entity.height,
            yMid: entity.y + entity.height/2,
          }
          break;
        default:
          break
      }
      // @#$ need to check if character is in the middle of an entity some how
      //check if character reached an entity on the x-axis
      if ((charPos.xMax === entityPos.xMin) && !collisionDetected) {
        //collision detected if character and entity has conflicting mid-point ranges
        if (charPos.yMid >= entityPos.yMin && charPos.yMid <= entityPos.yMax) {
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
      <Image
        image={this.state.image}
        crop={{
          x: 0,
          y: 0,
          width: 32,
          height: 32
        }}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
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
                              updateCharSpeed: updateCharSpeed, updateCharXY: updateCharXY
                              }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps,null, { withRef: true })(Character)
