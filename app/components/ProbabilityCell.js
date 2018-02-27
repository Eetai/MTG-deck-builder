import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

class ProbabilityCell extends Component {
  constructor(props) {
    super(props)
    this.state={
      P: '',
      cardColor:'',
      manapic: '',
    }
    this.colors = {
      Blue: '#2693C7',
      Red: '#FC6621',
      Green: '#2BC749',
      White: '#FDEA6D',
      Black: '#A8A39A'
    }
  }

  componentWillMount(){
    // setting mana icon for land cards
    if (this.props.card.type.includes('Land')) {
      let manapic = (this.props.card.ProducibleManaColors.includes('C') || this.props.card.ProducibleManaColors.includes('F')) ? 'Cmana.png' : (this.props.card.ProducibleManaColors.split(',').join('').slice(0, Math.min(this.props.card.ProducibleManaColors.length, 2)) + 'mana.png')
      if (this.props.card.ProducibleManaColors.split(',').join('') === 'BGRUW') manapic = 'BGRUWmana.png'
      this.setState({ manapic })
    }
    // setting up loading color or getting P if not land
    else if (this.props.probs) {
      let cardColor = this.colors[this.props.card.colors[Math.floor(Math.random() * this.props.card.colors.length)]]
      this.setState({
        P: this.props.probs[this.props.card.uniqueName][this.props.draws - 6],
        cardColor
      })
    }
  }

  componentWillReceiveProps(nextProps){
    // setting mana icon for land cards
    if (nextProps.card.type.includes('Land')) {
      let manapic = (nextProps.card.ProducibleManaColors.includes('C') || nextProps.card.ProducibleManaColors.includes('F')) ? 'Cmana.png' : (nextProps.card.ProducibleManaColors.split(',').join('').slice(0, Math.min(nextProps.card.ProducibleManaColors.length, 2)) + 'mana.png')
      if (nextProps.card.ProducibleManaColors.split(',').join('') === 'BGRUW') manapic = 'BGRUWmana.png'
      this.setState({ manapic })
    }
    // setting up loading color or getting P if not land
    else if (nextProps.probs) {
      let cardColor = this.colors[nextProps.card.colors[Math.floor(Math.random() * nextProps.card.colors.length)]]
      console.log(cardColor)
      this.setState({
        P: nextProps.probs[nextProps.card.uniqueName][nextProps.draws - 6],
        cardColor
      })
    }
  }

  render() {
    if (this.state.P !== 'loading' && !this.props.card.type.includes('Land')) return (
      <div>
        {`${(this.state.P * 100).toFixed(1)}%`}
      </div>
    )
    else if (this.props.card.type.includes('Land')) return (
      <div>
        <img src={`./Manapix/${this.state.manapic}`} style={{width: '25px', height:'25px'}}/>
      </div>
    )
    else return (
      <div>
        <CircularProgress size={25} color={this.state.cardColor}/>
      </div>
    )
  }
}

function mapStateToProps(storeState) {
  return {
    probs: storeState.probabilityReducer
  }
}

const ProbCell = connect(mapStateToProps, null)(ProbabilityCell)

export default ProbCell
