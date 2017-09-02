import React from 'react';
import '../css/GameBoard.css';
import charImg from '../assests/bomberman_01.png'
import bombImg from '../assests/bomb_01.png'
import wallImg from '../assests/wall_01.png'
import { Layer, Stage, Image } from 'react-konva'
import { KeyListener, WallTile, TileMap } from '../notes.js'

export default class GameBoard extends React.Component {

  constructor(props) {
    super(props)
    this.keyListener = new KeyListener();
    this.loopID = null;
    this.subscribers = [];

    //character speed
    this.speedX = 0;
    this.speedY = 0;


    this.state = {
      // board dimensions is 15 x 10 (x48)
      xDim: 720,
      yDim: 624,
      charPos: {
        x: 48,
        y: 48
      }
    }

  }

  componentDidMount(){
    /*
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


  // #######################################
  playerAction = () => {
    this.clearMove();
    if ( this.keyListener.isPressed(32) ) { //SPACE
      this.dropBomb();
    }else if ( this.keyListener.isPressed(38) ) { //UP
      this.moveUp();
    }else if ( this.keyListener.isPressed(40) ) { //DOWN
      this.moveDown();
    }else if ( this.keyListener.isPressed(37) ) { //LEFT
      this.moveLeft();
    }else if ( this.keyListener.isPressed(39) ) { //RIGHT
      this.moveRight();
    }
  }
  // character actions
    dropBomb = () => {

    }
    moveUp = () => {
      this.speedY = -1;
    }
    moveDown = () => {
      this.speedY = 1;
    }
    moveLeft = () => {
      this.speedX = -1;
    }
    moveRight = () => {
      this.speedX = 1;
    }
    clearMove = () => {
      this.speedX = 0;
      this.speedY = 0;
    }

  // #######################################
  // collision


  // ##############
  gameLoop = () => {
    this.playerAction()
    this.setState({
      charPos: {
        x: this.state.charPos.x + this.speedX,
        y: this.state.charPos.y + this.speedY
      }
    })
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
              src={charImg}
              x={this.state.charPos.x}
              y={this.state.charPos.y}
              width={(this.state.xDim/15)}
              height={(this.state.yDim/13)}
            />

            <Bomb
              src={bombImg}
              x={50}
              y={50}
              width={(this.state.xDim/15)}
              height={(this.state.yDim/13)}
            />

            <WallTile
              src={wallImg}
              x={0}
              y={50}
              width={(this.state.xDim/15)}
              height={(this.state.yDim/13)}
            />

          </Layer>
        </Stage>
      </div>
    )
  }

}






//#################################

//character
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

//bomb
class Bomb extends React.Component {
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
