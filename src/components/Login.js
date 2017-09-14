import React from 'react';
import LoginAdapter from '../adapters/LoginAdapter'
import { connect } from 'react-redux'
import { setPlayer, removePlayer, updateUsers } from '../actions/players'
import { bindActionCreators } from 'redux'
import { Grid, Divider, Image } from 'semantic-ui-react'

class Login extends React.Component{

  handleSubmit = (event) => {
    // console.log(event, this);
    event.preventDefault();
    let data = { player_name: event.target.player_name.value, game_id: 1}
    LoginAdapter.login(data)
    .then((data) => {
      console.log(data)
      if (data.player){
        this.props.setPlayer({id:data.player.id,
                              name:data.player.name,
                              ready:data.player.ready,
                              game_id:data.player.game_id,
                              game_owner:data.player.game_owner,
                              spectator:data.player.spectator})
        if (data.users.length){
          this.props.updateUsers(data.users.filter((user)=>{return user.id !== data.player.id}))
        }
        // redirect to game_id lobby
        this.props.route.history.push('/hi')
      }
    })
  }
  // // <Grid centered>
  // {/* <Divider hidden section /> */}
  // // <br/>
  // {/* </Grid> */}

  render(){
    return (
      <div className='login-style'>
          <Divider hidden section/>
          <Image src='giphy.gif' fluid />
          <h1>BomberMan</h1>
          <h2> Enter Guest Name </h2>
        <div className='login-page'>
          <form onSubmit={this.handleSubmit}>
            <input type='text' name='player_name' placeholder='Player_name' />
            <input type='submit' value='Enter Lobby' />
          </form>
        </div>
    </div>
    )
  }
};

function mapStateToProps(state){
  return {
    player_info: state.players.player_info,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setPlayer: setPlayer, removePlayer:removePlayer, updateUsers: updateUsers,
                              }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
