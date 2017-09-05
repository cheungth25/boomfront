import React from 'react';
import { connect } from 'react-redux'
import { addEntity } from '../actions/entities'
import {Layer} from 'react-konva'
import WallTile from './WallTile'

class TileMap extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    //should only update if the scale changes
    return false
  }

  findXPos(index, columns, width){
    return ((index % columns) * width)
  }

  findYPos(index, columns, height){
    return (Math.trunc(index/columns) * height)
  }

  formatGrid = () => {
    let entities = []
      this.props.grid.forEach((tileID, index)=>{
        let xPos = this.findXPos(index, this.props.columns, this.props.width)
        let yPos = this.findYPos(index, this.props.columns, this.props.height)
        let entity = {type:tileID , x:xPos, y:yPos, width:this.props.width, height:this.props.height}
        if (this.props.src[tileID]) {
          this.props.addEntity(entity)
          entities.push(
            <WallTile
              key={index}
              src={this.props.src[tileID]}
              x={xPos}
              y={yPos}
              width={this.props.width}
              height={this.props.height}
            />
          )
        }
      })
    return (entities)
  }

  render(){
    return(
      <Layer>
        {this.formatGrid()}
      </Layer>
    )
  }
}

function mapStateToProps(state){
  return {
    entities: state.entities.entities
  }
}

function mapDispatchToProps(dispatch){
  // dispatch(showBook())
  return {
    addEntity: (entity) => {
      dispatch(addEntity(entity))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TileMap)
