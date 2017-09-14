import React from 'react'
import {Image} from 'react-konva'

export class Sprite extends React.Component {
  constructor(props){
    super(props)

    this.currentStep = 0;
    this.lastStep = props.steps[props.charState];
    this.tickCount = 0;
    this.crop = {
            x: 0,
            y: 0,
            width: props.cropWidth,
            height: props.cropHeight}
    this.state = {
      image: null
    }
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

  componentWillReceiveProps(nextProps){
    if (nextProps.triggerSprite){
      if (nextProps.charState !== this.props.charState){
        this.tickCount = 0;
        this.currentStep = 0;
        this.lastStep = nextProps.steps[nextProps.charState];
        this.crop = {...this.crop, y:nextProps.charState*nextProps.cropHeight}
      }
      this.animate(nextProps)
    } else {
      this.currentStep = 0;
      this.tickCount = 0;
      this.crop = {...this.crop, x:0}
    }
  }

  animate(props){
    if (this.tickCount === props.ticksPerFrame) {
      if(this.currentStep === this.lastStep){
        this.currentStep = 0;
      } else {
        this.currentStep ++;
      }
      this.crop = {...this.crop, x:this.currentStep*props.cropWidth}
      this.tickCount = 0;
    }else {
      this.tickCount ++;
    }
  }

  render() {
    return (
      <Image
        image={this.state.image}
        crop={this.crop}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

export default Sprite
