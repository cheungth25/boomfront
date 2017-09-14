import React from 'react';
import bombSprite from '../assests/bomb_sprite.png'
import {Image} from 'react-konva'
import { connect } from 'react-redux'
import { addEntity, removeEntity } from '../actions/entities'
import { killPlayer } from '../actions/character'
import { bindActionCreators } from 'redux'

class Bomb extends React.Component {
  constructor(props){
    super(props)
    this.id = this.props.id
    this.explode_timeout = null
    this.exploded = false;
    this.triggered = false;
    this.tickCount = 0;
    this.ticksPerFrame = 9;
    //this.steps = [1,5,5,5];
    this.currentStep = 0;
    this.lastStep = 1;
    this.crop = {x:0, y:0, width:20, height:20}

    this.state = {
      image: null,
      // crop: {
      //   x: 0,
      //   y: 0,
      //   width: 20,
      //   height: 20}
    }
  }
  componentDidMount() {
    const image = new window.Image();
    image.src = bombSprite;
    image.onload = () => {
      this.setState({
        image: image
      });
    }
    //character should pass some props in:
    // strength of explosion,
    // send explosion to back end, only trigger explode when explosion overlaps
    // this.explode_timeout = setTimeout(()=>{this.explode()}, 4000)
  }

  explode = () => {
    this.exploded = true;
    this.tickCount = 0;
    this.ticksPerFrame = 10;
    this.currentStep = 0;
    this.lastStep = 5;
    setTimeout(()=>{this.explosion()}, 1200)
  }

  explosion = () => {
    // console.log('exploded')
    // debugger
    //this.props.killPlayer();
    // this.props.removeEntity(this.id);
  }

  // calculateBlast = () => {
  //   let xIndex = this.props.x/this.props.width
  //   let yIndex = this.props.y/this.props.height
  //   this.props.entities.forEach((entity)=>{
  //     switch (entity.type) {
  //       case 1:
  //
  //         break;
  //       case 2:
  //
  //         break;
  //       case 3:
  //
  //         break;
  //       default:
  //
  //     }
  //   })
  // }

  animate(){
    if(this.tickCount === this.ticksPerFrame){
      if(this.currentStep === this.lastStep){
        this.currentStep = 0;
      } else {
        this.currentStep ++;
      }
      // this.setState({...this.state, crop : {...this.state.crop, x:this.currentStep*20 }})
      this.crop = {...this.crop, x:this.currentStep*20 }
      this.tickCount = 0;
    }else{
      this.tickCount ++;
    }
  }

  // displayBomb = () => {
  //   let bomb = []
  //   if(this.exploded){
  //     bomb.push(<Image
  //         image={this.state.image}
  //         crop={{
  //             x: this.state.crop.x,
  //             y: 20,
  //             width: 20,
  //             height: 20}}
  //         x={this.props.x}
  //         y={this.props.y}
  //         width={this.props.width}
  //         height={this.props.height}
  //         rotation={0}
  //       />)
  //   }else{
  //     bomb.push(<Image
  //       image={this.state.image}
  //       crop={this.state.crop}
  //       x={this.props.x}
  //       y={this.props.y}
  //       width={this.props.width}
  //       height={this.props.height}
  //       rotation={0}
  //     />)
  //   }
  //   return (bomb)
  // }

  render() {
      return (
        <Image
          image={this.state.image}
          crop={this.crop}
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          rotation={0}
        />
        // <Layer>
        //   {this.displayBomb()}
        // </Layer>
      );
  }
}

function mapStateToProps(state){
  return {

    entities: state.entities.entities,
    charStats: state.character.charStats,
    charID: state.character.charID,
    charPos: {...state.character.charPos},
    speedX: state.character.speedX,
    speedY: state.character.speedY,
    playerAlive: state.character.playerAlive
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({addEntity: addEntity, removeEntity: removeEntity, killPlayer: killPlayer,
                              }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Bomb)
