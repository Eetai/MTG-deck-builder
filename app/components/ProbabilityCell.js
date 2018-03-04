import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

class ProbabilityCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      P: '',
      cardColor:'',
      manapic: '',
      history: {}
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
  }

  parseManaPic(ProducibleManaColors) {
    let manapic = (ProducibleManaColors.includes('C') || ProducibleManaColors.includes('F')) ? 'Cmana.png' : (ProducibleManaColors.split(',').join('').slice(0, Math.min(ProducibleManaColors.length, 2)) + 'mana.png')
    if (ProducibleManaColors.split(',').join('') === 'BGRUW') manapic = 'BGRUWmana.png'
    this.setState({ manapic })
    return manapic
  }

  componentWillMount() {
    // setting mana icon for land cards
    if (this.props.card.type.includes('Land')) {
      const manapic = this.parseManaPic(this.props.card.ProducibleManaColors)
      this.setState({ manapic })
    }
    // getting P if not land, setting card color if need be
    else if (!this.props.card.types.includes('Plane')) {
      const cardColor = (this.props.card.colors) ? this.colors[this.props.card.colors[Math.floor(Math.random() * this.props.card.colors.length)]] : this.colors.Grey

      const P = this.props.prob

      this.setState({ P, cardColor })
    }
    else {
      this.setState({ manapic: 'Plane.png' })
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.card.type.includes('Land')) {
      const manapic = this.parseManaPic(nextProps.card.ProducibleManaColors)
      this.setState({ manapic })
    }
    else if (!nextProps.card.types.includes('Plane')) {
      const cardColor = (nextProps.card.colors) ? this.colors[nextProps.card.colors[Math.floor(Math.random() * nextProps.card.colors.length)]] : this.colors.Grey

      let P = (Object.keys(this.state.history).includes(nextProps.deckNamesAndQuants)) ? this.state.history[nextProps.deckNamesAndQuants] : nextProps.prob

      const history = Object.assign({}, this.state.history)
      if (P !== 'loading' && !nextProps.calculating) history[nextProps.deckNamesAndQuants] = P

      console.log("HISTORY?!!: ",history)

      this.setState({ P, cardColor, history })

      setTimeout(() => {
        if (P !== this.props.prob) {
          P = this.props.prob
          if (P !== 'loading' && !this.Props.calculating) history[this.Props.deckNamesAndQuants] = P
          this.setState({ P, history })
        }
      }, 1000);
    }
    else {
      this.setState({ manapic: 'Plane.png' })
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

function mapStateToProps(storeState, ownProps) {
  return {
    prob: (!ownProps.card.types.includes('Land') && !ownProps.card.types.includes('Plane'))
      ? storeState.probabilityReducer[ ownProps.card.uniqueName ][ ownProps.draws - 6 ]
      : 0
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveToCache: (deckNamesAndQuants, card, prob) => {
      dispatch(addToCache(deckNamesAndQuants, card, prob))
    }
  }
}

const ProbCell = connect(mapStateToProps, mapDispatchToProps)(ProbabilityCell)

export default ProbCell
