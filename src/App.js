import React, { Component } from 'react';
import './App.css';
import GameBoard from './components/GameBoard'
import { connect } from 'react-redux'
import ActionCableProvider from 'react-actioncable-provider'
import {Redirect} from 'react-router'



class App extends Component {

  loggedIn = () => {
    if (this.props.player_info.id) {
      return (
        // <ActionCableProvider url='ws://localhost:3000/cable'>
        <ActionCableProvider url='wss://immense-scrubland-57490.herokuapp.com/cable'>
          <GameBoard xDim={720} yDim={624} route={this.props.route}/>
        </ActionCableProvider>
      )
    }else {
      return <Redirect to="/" />
    }
  }

  render() {
    return (
      <div className='game-board'>
        {this.loggedIn()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    player_info: state.players.player_info,
  }
}

export default connect(mapStateToProps)(App)
