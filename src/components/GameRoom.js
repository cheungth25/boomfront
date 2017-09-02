//import React, { Component, PropTypes } from 'react'
import React, { Component } from 'react'
import {ActionCable} from 'react-actioncable-provider'

export default class GameRoom extends Component {
    state = {
      messages: []
    };

    onReceived (message) {
        this.setState({
            messages: [
                ...this.state.messages,
                message
            ]
        })
    }

    sendMessage = () => {
        const message = this.refs.newMessage.value
        // Call perform or send
        this.refs.gameChannel.perform('sendMessage', {message})
    }

    render () {
        return (
            <div>
                <ActionCable ref='gameChannel' channel={{channel: 'GameChannel', room: '3'}} onReceived={this.onReceived} />
                <h4>Messages:</h4>
                <ul>
                    {this.state.messages.map((message) =>
                        <li key={message.id}>{message.body}</li>
                    )}
                </ul>
                <input ref='newMessage' type='text' />
                <button onClick={this.sendMessage}>Send</button>
            </div>
        )
    }
}
