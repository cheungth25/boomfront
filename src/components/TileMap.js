import React from 'react';
import { connect } from 'react-redux'
import {Layer} from 'react-konva'
import WallTile from './WallTile'

class TileMap extends React.Component {


  shouldComponentUpdate(nextProps, nextState){
    if (nextProps.entities.filter((entity)=>{return (entity.type === this.props.type)}).length
          !== this.props.entities.filter((entity)=>{return (entity.type === this.props.type)}).length){
      // console.log('in component should update', nextProps, this.props)
      return true
    }else {
      return false
    }
  }

  displayEntities = () => {
    // console.log('in tilemap display entities', this.state.entities)
    let entities = this.props.entities.filter((entity)=>{
      return (entity.type === this.props.type)
    }).map((entity, index)=>{
      return(
        <WallTile
          key={index}
          src={this.props.src}
          x={entity.x}
          y={entity.y}
          width={this.props.width}
          height={this.props.height}
        />
      )
    })
    return entities
  }

  render(){
    return(
      <Layer>
        {this.displayEntities()}
      </Layer>
    )
  }
}

function mapStateToProps(state){
  return {
    entities: state.entities.entities
  }
}

export default connect(mapStateToProps)(TileMap)
