import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadDeck } from '../reducers/Deck'
import { selectDeck } from '../reducers/selectedDeck'
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';

class LoadDeckForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  render() {
    return (
      <div>
        <List>
          {
            this.props.decks.map((deck, index) => {
              return (
                <ListItem
                  key = {index}
                  primaryText = {deck.name}
                  onClick = {() => this.props.chooseDeck(this.props.user.id, deck.id, deck.name)}
                />
              )
            })
          }
        </List>
      </div>
    )
  }
}

const mapState = (storeState) => {
  return {
    decks: storeState.userDeckReducer,
    user: storeState.defaultUser
  }
}

const mapDispatch = (dispatch) => {
  return {
    chooseDeck: (userId, deckId, name) => {
      dispatch(loadDeck(userId, deckId))
      dispatch(selectDeck(name))
    }
  }
}

const LoadDeck = connect(mapState, mapDispatch)(LoadDeckForm)

export default LoadDeck
