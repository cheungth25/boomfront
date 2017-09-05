import React from 'react';
import {Layer, Image} from 'react-konva'

// Key Listener

export class KeyListener {
  constructor() {
    this.keys = {};
  }

  down = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault();
      console.log('pressed', event.key, event.keyCode)
      this.keys[event.keyCode] = true;
    }
  }

  up = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault();
      console.log('unpressed', event.key, event.keyCode)
      this.keys[event.keyCode] = false;
    }
  }

  isPressed = (keyCode) => {
    return this.keys[keyCode] || false;
  }

  subscribe = (keys) => {
    window.addEventListener('keydown', this.down);
    window.addEventListener('keyup', this.up);

    keys.forEach((key) => {
      this.keys[key] = false;
    });
  }

  unsubscribe = () => {
    window.removeEventListener('keydown', this.down);
    window.removeEventListener('keyup', this.up);
    this.keys = {};
  }

}

// // #####################################
//
// //wall tile
// //props: src, x, y, width, height
// export class WallTile extends React.Component {
//   state = {
//     image: null
//   }
//   componentDidMount() {
//     const image = new window.Image();
//     image.src = this.props.src;
//     image.onload = () => {
//       this.setState({
//         image: image
//       });
//     }
//   }
//
//   render() {
//       return (
//           <Image
//             image={this.state.image}
//             x={this.props.x}
//             y={this.props.y}
//             width={this.props.width}
//             height={this.props.height}
//             shadowBlur={10}
//           />
//       );
//   }
// }
//
// //props: style, src, rows, columns, width, height, grid
// export class TileMap extends React.Component {
//
//   shouldComponentUpdate(nextProps, nextState){
//     return false
//   }
//
//   // grid: [
//   //       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//   //       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//   //       1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
//   //       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//   //       1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
//   //       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//   //       1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
//   //       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//   //       1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
//   //       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//   //       1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
//   //       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//   //       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
//   //       ]
//
//   findXPos(index, columns, width){
//     return ((index % columns) * width)
//   }
//
//   findYPos(index, columns, height){
//     return (Math.trunc(index/columns) * height)
//   }
//
//   formatGrid = () => {
//     //map through tilemap grid
//     //if grid tile value = 0 return null otherwise return Image component
//     //filter out all the null returns
//     return (this.props.grid.map((tileID, index)=>{
//     //  if (tileID !== 0){
//       if (this.props.src[tileID]) {
//         return(<WallTile
//           key={index}
//           src={this.props.src[tileID]}
//           x={this.findXPos(index, this.props.columns, this.props.width)}
//           y={this.findYPos(index, this.props.columns, this.props.height)}
//           width={this.props.width}
//           height={this.props.height}
//           />)
//       }else {return null}
//     }).filter((formatedTile)=>{return formatedTile})
//     )
//   }//formatGrid()
//
//   render(){
//     return(
//       <Layer>
//         {this.formatGrid()}
//       </Layer>
//     )
//   }
// }
