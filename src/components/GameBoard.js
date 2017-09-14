import React from 'react';
import '../css/GameBoard.css';
import { Grid, Button, List } from 'semantic-ui-react'
import wallImg from '../assests/wall_01.png'
import brickImg from '../assests/brick_01.png'
import charSprite2 from '../assests/bomberman_sprite_03.png'
import bombSprite from '../assests/bomb_sprite.png'
import { Layer, Stage } from 'react-konva'
import { KeyListener } from '../utils/KeyListener.js'
import TileMap from './TileMap'
import WallTile from './WallTile'
import Character from './Character'
import StaticSprite from './StaticSprite'
import Bomb from './Bomb'
import { connect } from 'react-redux'
import { addEntity, addEntities, removeEntity } from '../actions/entities'
import { setCharID, setCharStats, setCharPos, updateCharXY, addCharacters, updateCharacters, removeCharacters, killPlayer } from '../actions/character'
import { setPlayer, removePlayer, addSpectator, updatePlayers, updateUsers, removeUser, exit} from '../actions/players'
import { bindActionCreators } from 'redux'
import {ActionCable} from 'react-actioncable-provider'

class GameBoard extends React.Component {

  constructor(props) {
    super(props)
    this.keyListener = new KeyListener();
    this.loopID = null;
    this.gameStarted = false;
    this.animateObjects = [];
    this.destroyList = []
    this.state = {
      // board dimensions is 15 x 13 (x48)
      // width and height for tileSize should be the same ex: 48x48
      xDim: props.xDim,
      yDim: props.yDim,
      tileSize: props.xDim/15
    }
  }

  componentWillUnmount(){
    this.keyListener.unsubscribe();
    window.removeEventListener('click', this.toggleKeyListener)
  }

  toggleKeyListener = (event)=>{
    if(event.target.tagName==='CANVAS'){
      console.log('hi')
      this.keyListener.subscribe([38, 40, 37, 39, 32]);
    }else{
      console.log('bye')
      this.keyListener.unsubscribe();
    }
  }

  // ##############
  gameLoop = () => {
    setTimeout(()=>{
      if (this.props.playerAlive){
        this.playerAction()
      }


      this.destroyList.forEach((id)=>{
        this.props.removeEntity(id)
      })
      this.destroyList = []
      this.animateObjects = this.animateObjects.filter((obj)=>{
        let currTime = Date.parse(new Date())
        return (currTime>=(obj.created_at+1200))
      })

      this.props.entities.forEach((entity)=>{
        if (entity.type === 3){
          if(entity.char_id === this.props.charID){
            let currTime = Date.parse(new Date())
            let bombTime = Date.parse(entity.created_at)
            // console.log('in check bomb', this.refs[`bomb${entity.id}`].getWrappedInstance())
            if (currTime >= (bombTime+3500) && (!this.refs[`bomb${entity.id}`].getWrappedInstance().exploded) && (!this.refs[`bomb${entity.id}`].getWrappedInstance().triggered)){
              this.bombTriggered(entity)
              this.refs[`bomb${entity.id}`].getWrappedInstance().triggered = true;
            }
          }
          this.refs[`bomb${entity.id}`].getWrappedInstance().animate()
        }
      })
    this.loopID = window.requestAnimationFrame(this.gameLoop)
  }, 1000/30)
  }

  gameStart() {
    console.log('in game start')
    //spawn starting game objects
    this.keyListener.subscribe([38, 40, 37, 39, 32]);
    window.addEventListener('click', this.toggleKeyListener)
    if (!this.loopID) {
      this.gameLoop();
    }
  }

  gameStop() {
    window.cancelAnimationFrame(this.loopID)
  }

  playerAction = () => {
    this.refs.character.getWrappedInstance().clearMove();
    if ( this.keyListener.isPressed(32) ) { //SPACE
      this.refs.character.getWrappedInstance().charMoving = false;
      // let nearestX = ((this.props.charPos.x % this.state.tileSize) <= (this.state.tileSize/2)) ? (Math.trunc(this.props.charPos.x/this.state.tileSize)*this.state.tileSize) : ((Math.trunc(this.props.charPos.x/this.state.tileSize)+1)*this.state.tileSize);
      // let nearestY = ((this.props.charPos.y % this.state.tileSize) <= (this.state.tileSize/2)) ? (Math.trunc(this.props.charPos.y/this.state.tileSize)*this.state.tileSize) : ((Math.trunc(this.props.charPos.y/this.state.tileSize)+1)*this.state.tileSize);
      let nearestX = ((this.props.charPos.x % this.state.tileSize) <= (this.state.tileSize/2)) ? Math.trunc(this.props.charPos.x/this.state.tileSize) : (Math.trunc(this.props.charPos.x/this.state.tileSize)+1);
      let nearestY = ((this.props.charPos.y % this.state.tileSize) <= (this.state.tileSize/2)) ? Math.trunc(this.props.charPos.y/this.state.tileSize) : (Math.trunc(this.props.charPos.y/this.state.tileSize)+1);
      let currentBombs = this.props.entities.filter((entity)=>{return entity.type===3})
      let myBombs = currentBombs.filter((bomb)=>{return bomb.char_id===this.props.charID})
      if(myBombs.length < this.props.charStats.bombNum){
        this.sendPlayerAction({action_type:'bomb', x:nearestX, y:nearestY, bombNum:this.props.charStats.bombNum, bombStrength:this.props.charStats.bombStrength})
      }
    }else if ( this.keyListener.isPressed(38) ) { //UP
      this.refs.character.getWrappedInstance().moveUp();
      this.props.updateCharXY()
      this.sendPlayerAction({action_type:'up', x:this.props.charPos.x, y:this.props.charPos.y, crop:this.refs.character.getWrappedInstance().refs.sprite.crop})
    }else if ( this.keyListener.isPressed(40) ) { //DOWN
      this.refs.character.getWrappedInstance().moveDown();
      this.props.updateCharXY()
      this.sendPlayerAction({action_type:'down', x:this.props.charPos.x, y:this.props.charPos.y, crop:this.refs.character.getWrappedInstance().refs.sprite.crop})
    }else if ( this.keyListener.isPressed(37) ) { //LEFT
      this.refs.character.getWrappedInstance().moveLeft();
      this.props.updateCharXY()
      this.sendPlayerAction({action_type:'left', x:this.props.charPos.x, y:this.props.charPos.y, crop:this.refs.character.getWrappedInstance().refs.sprite.crop})
    }else if ( this.keyListener.isPressed(39) ) { //RIGHT
      this.refs.character.getWrappedInstance().moveRight();
      this.props.updateCharXY()
      this.sendPlayerAction({action_type:'right', x:this.props.charPos.x, y:this.props.charPos.y, crop:this.refs.character.getWrappedInstance().refs.sprite.crop})
    } else {
      this.refs.character.getWrappedInstance().charMoving = false;
    }
  }

  // ##############

  onReceived = (data) => {
    console.log(data)
    switch (data.data.type) {
      case 'connect':
        this.props.addSpectator(data.data.spectator)
        break;
      case 'add_player':
        this.props.setPlayer(data.data.users_info.find((user)=>{return user.id === this.props.player_info.id}))
        this.props.updateUsers(data.data.users_info)
        break;
      case 'player_ready':
        if (data.data.player.id === this.props.player_info.id) {
          this.props.setPlayer(data.data.player)
        }
        this.props.updatePlayers(data.data.player)
        break;
      case 'game_start':
        this.gameStarted = data.data.game_started ?  true : false
        // store only has charPos (x,y), add other data
        let character = data.data.characters.find((character)=>{return character.player_id === this.props.player_info.id})
        let characters = data.data.characters.map((character)=>{
          return {...character, crop:{x:0, y:0, width:32, height:32}}
        })
        let entities = data.data.entities.map((entity)=>{
          return {...entity, x:entity.x*this.state.tileSize, y:entity.y*this.state.tileSize}
        })
        this.props.setCharPos({x:character.x, y:character.y})
        this.props.setCharID(character.id)
        this.props.addEntities(entities)
        this.props.addCharacters(characters)
        this.gameStart()
        break;
      case 'player_action':
        if(data.data.player_id === this.props.player_info.id){
          // this.props.updateCharXY()

        }else{
          this.props.updateCharacters({id:data.data.character_id,
                                      x:data.data.x,
                                      y:data.data.y,
                                      crop:data.data.crop,
                                      player_id:data.data.player_id})
        }
        break;
      case 'drop_bomb':
        let bomb = {...data.data.entity, x:data.data.entity.x*this.state.tileSize, y:data.data.entity.y*this.state.tileSize, char_id:data.data.char_id, created_at:data.data.created_at}
        this.props.addEntity(bomb)
        break;
      case 'bomb_triggered':
        // console.log("in bomb triggered",data)
        this.destroyList.push(...data.data.destroyList)
        // data.data.destroyList.forEach((id)=>{
        //   // if (this.props.entities.find((entity)=>{return (entity.id===id && entity.type===3)})) {
        //   //   this.refs[`bomb${id}`].getWrappedInstance().triggered = true
        //   // }
        //   this.props.removeEntity(id)
        // })
        data.data.death_zones.center.forEach((center)=>{
          this.animateObjects.push({...center, crop:{x:60, y:20, width:20, height:20}, src:bombSprite, created_at: Date.parse(new Date())})
        })
        data.data.death_zones.x.forEach((x)=>{
          this.animateObjects.push({...x, crop:{x:60, y:20, width:20, height:20}, src:bombSprite, created_at: Date.parse(new Date())})
        })
        data.data.death_zones.y.forEach((y)=>{
          this.animateObjects.push({x:y.x, y:y.x+1, crop:{x:60, y:20, width:20, height:20}, src:bombSprite, created_at: Date.parse(new Date())})
        })
        data.data.killChars.forEach((id)=>{
          if (id === this.props.charID) {
            this.props.killPlayer()
            this.keyListener.unsubscribe();
            window.removeEventListener('click', this.toggleKeyListener)
          }
          this.props.removeCharacters(id)
        })

        break;
      case 'disconnect':
        this.props.removeUser(data.data.user_id)
        if (data.data.user_id === this.props.player_info.id) {
          this.gameStop()
          this.keyListener.unsubscribe();
          window.removeEventListener('click', this.toggleKeyListener)
          this.props.exit()
        }
        break;
      default:
    }

  }

  sendMessage = () => {
    const data = 'hello'
    // Call perform or send
    this.refs.gameChannel.perform('update_entity', {data})
  }

  joinGame = () => {
    this.refs.gameChannel.perform('join_game', {})
  }

  playerReady = () => {
    this.refs.gameChannel.perform('player_ready', {})
  }

  start = () => {
    this.refs.gameChannel.perform('game_start', {})
  }

  sendPlayerAction = (data) => {
      this.refs.gameChannel.perform('player_action', {...data})
  }

  bombTriggered = (entity) => {
    this.refs.gameChannel.perform('bomb_blast', {entity:{...entity, x:entity.x/this.state.tileSize, y:entity.y/this.state.tileSize}, bombStrength:this.props.charStats.bombStrength})
  }

  exit = () => {
    this.refs.gameChannel.perform('exit', {})
  }

  displayBombs = () => {
    let bombs = []
    this.props.entities.forEach((entity, index)=>{
      if (entity.type === 3){
        bombs.push(
          <Bomb
            key={index}
            ref={`bomb${entity.id}`}
            id={entity.id}
            x={entity.x}
            y={entity.y}
            width={this.state.tileSize}
            height={this.state.tileSize}
          />
        )
      }
    })
    return (bombs)
  }

  displayExplosions = () => {
    return this.animateObjects.map((obj, index)=>{
      return(
        <StaticSprite
          key={index}
          src={obj.src}
          crop={obj.crop}
          x={obj.x*this.state.tileSize}
          y={obj.y*this.state.tileSize}
          width={this.state.tileSize}
          height={this.state.tileSize}
        />)
    })
  }

  displayBricks = () => {
    let bricks = this.props.entities.filter((entity)=>{
      return (entity.type===2)
    }).map((entity,index)=>{
      return(
        <WallTile
          key={index}
          src={brickImg}
          x={entity.x}
          y={entity.y}
          width={this.state.tileSize}
          height={this.state.tileSize}
        />
      )
    })
    return bricks
  }

  displayCharacter = () => {
    if (this.props.playerAlive){
      return <Character
        ref='character'
        keyListener={this.keyListener}
        xDim={this.state.xDim}
        yDim={this.state.yDim}
        tileSize={this.state.tileSize}
      />
    }
  }

  displayCharacters = () => {
    let characters = this.props.characters.filter((character)=>{
      return ((character.player_id !== this.props.player_info.id) && character.alive)
    }).map((character, index)=>{
      return <StaticSprite
        key={index}
        src={charSprite2}
        crop={character.crop}
        x={character.x}
        y={character.y}
        width={this.state.tileSize}
        height={this.state.tileSize}
      />
    })

    return <Layer>
      {characters}
    </Layer>
  }

  displayGameButtons = () => {
    let i = 0;
    let buttons = []
    if (!this.gameStarted){
      if(this.props.player_info.spectator)
      {buttons.push(<div key={++i} className="button-margin-js">
        <Button onClick={this.joinGame}>Join Game</Button>
      </div>)}
      if(this.props.player_info.spectator === false)
        {buttons.push(<div key={++i} className="button-margin-js">
          <Button onClick={this.playerReady}>Ready</Button>
        </div>)}
      if(this.props.player_info.game_owner){
        buttons.push(<div key={++i} className="button-margin-js">
          <Button onClick={this.start}>Start</Button>
        </div>)
      }
    }
    return buttons
  }

  displayCanvas = () => {
      return (<Stage width={this.state.xDim} height={this.state.yDim} >
        <TileMap
          src={wallImg}
          width={(this.state.xDim/15)}
          height={(this.state.yDim/13)}
          type={1}
        />
        <Layer>
          {this.displayExplosions()}
        </Layer>
        <TileMap
          src={brickImg}
          width={(this.state.xDim/15)}
          height={(this.state.yDim/13)}
          type={2}
        />
        <Layer>
          {this.displayCharacter()}
        </Layer>
        {this.displayCharacters()}
        <Layer>
          {this.displayBombs()}
        </Layer>
      </Stage>)
  }

  displayPlayers = () => {
    return (
      this.props.players.map((player, index)=>{
        return <List.Item key={index}>{player.name}</List.Item>
      })
    )
  }

  displaySpectators = () => {
    return (
      this.props.spectators.map((spectators, index)=>{
        return <List.Item key={index}>{spectators.name}</List.Item>
      })
    )
  }

  render(){
    return(
      <div>
        <ActionCable ref='gameChannel' channel={{channel: 'GameRoomChannel', game_id:this.props.player_info.game_id, player_id: this.props.player_info.id}} onReceived={this.onReceived} />
        <Grid columns={2}>
          <Grid.Column width={13}>

            <div id='game-canvas' >
              {this.displayCanvas()}
            </div>


          </Grid.Column>
          <Grid.Column width={3}>
            <h3>Players:</h3>
            <List>
              {this.displayPlayers()}
            </List>
            <h3>Spectators:</h3>
            <List>
              {this.displaySpectators()}
            </List>
            <div className="button-margin-js">
              <Button active onClick={this.sendMessage}>Send</Button>
            </div>
            {this.displayGameButtons()}
            <div className="button-margin-js">
              <Button onClick={this.exit}>Exit</Button>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    )
  }

}

//######################################
function mapStateToProps(state){
  return {
    entities: state.entities.entities,
    charStats: state.character.charStats,
    charID: state.character.charID,
    charPos: {...state.character.charPos},
    speedX: state.character.speedX,
    speedY: state.character.speedY,
    playerAlive: state.character.playerAlive,
    characters: state.character.characters,
    player_info: state.players.player_info,
    players: state.players.players,
    spectators: state.players.spectators,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({addEntity: addEntity, addEntities: addEntities, removeEntity: removeEntity,
                              setCharID: setCharID, setCharStats: setCharStats, setCharPos: setCharPos, updateCharXY: updateCharXY, addCharacters: addCharacters, updateCharacters: updateCharacters, removeCharacters: removeCharacters, killPlayer: killPlayer,
                              setPlayer: setPlayer, removePlayer: removePlayer, addSpectator: addSpectator, updatePlayers: updatePlayers, updateUsers: updateUsers, removeUser:removeUser, exit:exit
                              }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard)
