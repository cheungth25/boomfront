import React, { Component } from 'react';
import './App.css';
import GameRoom from './components/GameRoom'
import GameBoard from './components/GameBoard'
import ActionCableProvider from 'react-actioncable-provider'


class App extends Component {

  actioncable = () =>{
    return(
    <ActionCableProvider url='ws://localhost:3000/cable'>
      <GameRoom />
    </ActionCableProvider>)
  }

  render() {
    return (
      <div>
        <GameBoard xDim={720} yDim={624}/>
      </div>
    );
  }
}

export default App;
