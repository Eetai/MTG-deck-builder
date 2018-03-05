import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios'

class ProbabilityCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      P: '',
      cardColor:'',
      manapic: '',
      history: {},
      calculating: false
    }
    this.colors = {
      Blue: '#2693C7',
      Red: '#FC6621',
      Green: '#2BC749',
      White: '#FDEA6D',
      Black: '#A8A39A',
      Grey: '#99968f'
    }
    this.parseManaPic = this.parseManaPic.bind(this)
    this.playableTurn = this.playableTurn.bind(this)
    this.getProbability = this.getProbability.bind(this)
    this.getDeckNamesAndQuants = this.getDeckNamesAndQuants.bind(this)
  }

  playableTurn(card, draws) {
    function cardCost(card) {
      return card.manaCost
        .split('{')
        .slice(1)
        .map(v => v.slice(0, -1))
        .reduce((a, b) => {
          if (Object.keys(a).includes(b)) {
            a[b]++;
          } else {
            if (!['B', 'G', 'W', 'R', 'U'].includes(b[0]))
              a.C = !isNaN(parseInt(b)) ? parseInt(b) : 0;
            else a[b] = 1;
          }
          return a;
        }, { C: 0 });
    }

    function convertedManaCost(cost) {
      return Object.keys(cost).reduce((a, b) => a + cost[b], 0)
    }

    return convertedManaCost(cardCost(card)) <= draws - 6
  }

  getDeckNamesAndQuants(deck) {
    return JSON.stringify(deck.map(card => ({ name: card.uniqueName, quantity: card.quantity })))
  }

  parseManaPic(ProducibleManaColors) {
    let manapic = (ProducibleManaColors.includes('C') || ProducibleManaColors.includes('F')) ? 'Cmana.png' : (ProducibleManaColors.split(',').join('').slice(0, Math.min(ProducibleManaColors.length, 2)) + 'mana.png')
    if (ProducibleManaColors.split(',').join('') === 'BGRUW') manapic = 'BGRUWmana.png'
    this.setState({ manapic })
    return manapic
  }

  getProbability(deck, card, draws, deckNamesAndQuants) {
    const self = this
    self.setState({ calculating: true })
    axios.put('api/alg', ({ draws, card, deck }))
      .then(res => {
        const history = Object.assign({}, self.state.history)
        history[deckNamesAndQuants] = res.data
        self.setState({ P: res.data, calculating: false, history })
      });
  }

  componentWillMount() {
    if (this.props.card.type.includes('Land')) {
      const manapic = this.parseManaPic(this.props.card.ProducibleManaColors)
      this.setState({ manapic })
    }
    else if (!this.props.card.types.includes('Plane')) {
      const cardColor = (this.props.card.colors) ? this.colors[this.props.card.colors[Math.floor(Math.random() * this.props.card.colors.length)]] : this.colors.Grey
      const deckNamesAndQuants = this.getDeckNamesAndQuants(this.props.deck)

      this.setState({ P: 'loading', cardColor })
      if (this.state.history[deckNamesAndQuants] !== undefined) {
        this.setState({ P: this.state.history[deckNamesAndQuants] })
      }
      else {
        this.getProbability(this.props.deck, this.props.card, this.props.draws, this.props.deckNamesAndQuants)
      }
    }
    else {
      this.setState({ manapic: 'Plane.png' })
    }
  }

  componentWillReceiveProps({ draws, card, deck }){
    if (card.type.includes('Land')) {
      const manapic = this.parseManaPic(card.ProducibleManaColors)
      this.setState({ manapic })
    }
    else if (card.types.includes('Plane')) {
      this.setState({ manapic: 'Plane.png' })
    }
    else {
      const cardColor = (card.colors) ? this.colors[card.colors[Math.floor(Math.random() * card.colors.length)]] : this.colors.Grey

      const newDeckNamesAndQuants = this.getDeckNamesAndQuants(deck)
      const oldDeckNamesAndQuants = this.getDeckNamesAndQuants(this.props.deck)
      const playable = this.playableTurn(card, draws)

      if (!playable) {
        this.setState({ P: 0 })
      }
      else if (newDeckNamesAndQuants !== oldDeckNamesAndQuants) {
        this.setState({ P: 'loading' })
        if (this.state.history[newDeckNamesAndQuants] !== undefined) {
          this.setState({ P: this.state.history[newDeckNamesAndQuants] })
        }
        else if (!this.state.calculating) {
          this.getProbability(deck, card, draws, newDeckNamesAndQuants)
        }
      }
      setTimeout(() => {
        if (this.playableTurn(this.props.card, this.props.draws)) {
          const futureDeckNamesAndQuants = this.getDeckNamesAndQuants(this.props.deck)
          if (newDeckNamesAndQuants !== futureDeckNamesAndQuants) {
            this.setState({ P: 'loading' })
            if (this.state.history[futureDeckNamesAndQuants] !== undefined) {
              this.setState({ P: this.state.history[futureDeckNamesAndQuants] })
            }
            else if (!this.state.calculating){
              this.getProbability(this.props.deck, this.props.card, this.props.draws, futureDeckNamesAndQuants)
            }
          }
        }
      }, 2000);
    }
  }

  render() {
    if (this.state.P !== 'loading' && !this.props.card.types.includes('Land') && !this.props.card.types.includes('Plane')) return (
      <div>
        {`${(this.state.P * 100).toFixed(1)}%`}
      </div>
    )
    else if (this.props.card.type.includes('Land') || this.props.card.types.includes('Plane')) return (
      <div>
        <img src={`./Manapix/${this.state.manapic}`} style={{ height:'25px' }}/>
      </div>
    )
    else return (
      <div>
        <CircularProgress size={25} color={this.state.cardColor}/>
      </div>
    )
  }
}

export default ProbabilityCell
