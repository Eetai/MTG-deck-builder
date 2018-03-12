import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SaveUserDecks, UpdateUserDeck } from '../reducers/userDecks'
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { one } from 'nouns'

class SaveDeckForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  componentWillMount(){
    const nounOne = one()
    const nounTwo = one()
    const nounThree = one()
    const nouns = ((nounOne + nounTwo).length > 15) ? nounOne[0].toUpperCase() + nounOne.slice(1) + nounTwo[0].toUpperCase() + nounTwo.slice(1) : nounOne[0].toUpperCase() + nounOne.slice(1) + nounTwo[0].toUpperCase() + nounTwo.slice(1) + nounThree[0].toUpperCase() + nounThree.slice(1)
    this.setState({ name: nouns })
  }

  render() {
    return (
      <div>
        <TextField
          hintText="Give your deck a title"
          value={this.state.name}
          onChange={(event) => this.setState({ name: event.target.value })}
        />
        <FlatButton
          label="Submit"
          primary={true}
          onClick={(e) => this.props.handleSaveDeck(this.state.name, this.props.user, this.props.deck, e)}
        />
      </div>
    )
  }
}

const mapState = (storeState) => {
  return {
    user: storeState.defaultUser,
    deck: storeState.deckReducer
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSaveDeck: (name, user, deck, evt) => {
      evt.preventDefault()
      dispatch(SaveUserDecks(name, user, deck))
    },

  }
}

const SaveDeck = connect(mapState, mapDispatch)(SaveDeckForm)

export default SaveDeck
