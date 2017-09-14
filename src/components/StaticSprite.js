import React from 'react'
import {Image} from 'react-konva'

export default class StaticSprite extends React.Component {

  state = {
    image:null
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

  render(){
    return(
      <Image
        image={this.state.image}
        crop={this.props.crop}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}
