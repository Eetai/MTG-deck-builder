import React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { removeCardFromDeck, updateCardInDeck } from '../reducers/Deck.js'
import { computeCurve, setCurveToLoading } from '../reducers/probabilities.js'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentClear from 'material-ui/svg-icons/content/clear';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ProbCell from './ProbabilityCell'
import Drawer from 'material-ui/Drawer';
import { spawn } from 'threads'

class DeckList extends Component {
    constructor(props){
        super(props)
        this.state = {
            drawer: false,
            selectedCard:{},
            calculating: false,
            lastDeckList: '',
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

        this.reCalcProbs = this.reCalcProbs.bind(this)
        this.getDeckNamesAndQuants = this.getDeckNamesAndQuants.bind(this)
    }

    getDeckNamesAndQuants(deck) {
        return JSON.stringify(deck.map(card => ({ name: card.uniqueName, quantity: card.quantity })))
    }

    // Debouncing currently sucks!
    // state is bascially fucked

    reCalcProbs(dispatchCalcProb, deck){
        let deckNamesAndQuants = this.getDeckNamesAndQuants(deck)
        this.setState({ calculating: true, lastDeckList: deckNamesAndQuants })

        deck.forEach(card => {
            if (!card.types.includes('Land') && ! card.types.includes('Plane')) {
                for (var turn = 1; turn < 9; turn++) {
                    dispatchCalcProb(turn + 6, card, deck)
                }
            }
        })
        setTimeout(() => {
            let deckNamesAndQuants = this.getDeckNamesAndQuants(this.props.deck)
            if (deckNamesAndQuants !== this.state.lastDeckList) {
                this.props.setToLoading()
                this.props.deck.forEach(card => {
                    if (!card.types.includes('Land') && ! card.types.includes('Plane')) {
                        for (var turn = 1; turn < 9; turn++) {
                            dispatchCalcProb(turn + 6, card, this.props.deck)
                        }
                    }
                })
            }

            const NOT_LOADING_AND_UNIQUE = !JSON.stringify(this.state.lastDeckList).includes('loading') && !this.state.history[deckNamesAndQuants]

            const history = Object.assign({}, this.state.history)
            if (NOT_LOADING_AND_UNIQUE) history[this.state.lastDeckList] = true

            this.setState({ calculating: false, lastDeckList: deckNamesAndQuants, history })
        }, 2000);
    }

    componentWillReceiveProps(nextProps) {
        const deckNamesAndQuants = this.getDeckNamesAndQuants(nextProps.deck)
        if (!this.state.calculating && !this.state.history[deckNamesAndQuants]) {
            this.reCalcProbs(this.props.calcProb, nextProps.deck)
        }
    }

    render() {
        if (this.props){
            const deckNamesAndQuants = this.getDeckNamesAndQuants(this.props.deck)
            return (
                <div className="DeckListContainer">
                    <Drawer
                        containerStyle={{ backgroundColor:'#212121'}}
                        open={this.state.drawer}
                        openSecondary={false}
                        docked={false}
                        width={"47%"}
                    >
                        <div>
                            <div>
                                <img
                                    style={{ transform: 'translate(100px, 10px)', width: 300, height: 'auto'}}
                                    src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.state.selectedCard.multiverseid}&type=card`}
                                />
                            </div>
                            <FloatingActionButton
                                style={{ transform: 'translate(230px, 10px)'}}
                                disabled={!this.state.drawer}
                                label={''}
                                backgroundColor={this.colors.White}
                                mini={true}
                                onClick={(e) => this.setState({calculating:!this.state.calculating ,drawer: !this.state.drawer })}>
                                <RemoveRedEye />
                            </FloatingActionButton>
                        </div>
                    </Drawer>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={{ width: '20%' }}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '8%' }}>View</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>Quantity</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '8%' }}>Inc</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '8%' }}>Dec</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '8%' }}>Remove</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>1</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>2</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>3</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>4</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>5</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>6</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>7</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%' }}>8</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                this.props.deckList.map(card=>{
                                    return(
                                        <TableRow>
                                            <TableRowColumn
                                                style={{ width: '20%'}}
                                                >
                                                {card.name}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    disabled={this.state.drawer}
                                                    label={''}
                                                    backgroundColor={this.colors.White}
                                                    mini={true}
                                                    onClick={(e) => this.setState({ calculating:!this.state.calculating ,drawer: !this.state.drawer, selectedCard: card })}>
                                                    <RemoveRedEye />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%' }}>{card.quantity}</TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    disabled={card.quantity > 3 && !card.type.includes('Basic Land')}
                                                    backgroundColor={this.colors.Green}
                                                    mini={true}
                                                    onClick={() => this.props.updateCardQuant(card.uniqueName, card.quantity + 1)}>
                                                    <ContentAdd/>
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    disabled={card.quantity < 1}
                                                    backgroundColor={this.colors.Blue}
                                                    mini={true}
                                                    onClick={() => {
                                                        this.props.updateCardQuant(card.uniqueName, card.quantity - 1)
                                                        }
                                                    }>
                                                    <ContentRemove />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '8%' }}>
                                                <FloatingActionButton
                                                    backgroundColor={this.colors.Red}
                                                    mini={true}
                                                    onClick={() => this.props.removeCard(card.uniqueName)}>
                                                    <ContentClear />
                                                </FloatingActionButton>
                                            </TableRowColumn>
                                            {
                                                [0,1,2,3,4,5,6,7].map(v=>{
                                                    return (
                                                        <TableRowColumn style={{ width: '5%' }}>
                                                            <ProbCell
                                                                draws = {7 + v}
                                                                card = { card }
                                                                deckNamesAndQuants = { deckNamesAndQuants }
                                                                calculating = { this.state.calculating }
                                                            />
                                                        </TableRowColumn>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            )
        }
    }
}

function mapStateToProps(storeState) {
    return {
        deck: storeState.deckReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCardQuant: (uniqueName,value) => {
            dispatch(updateCardInDeck(uniqueName,{quantity: value}))
        },
        removeCard: (cardUniqName) => {
            dispatch(removeCardFromDeck(cardUniqName));
        },
        calcProb: (draws, card, deck, cachedData) => {
            dispatch(computeCurve(draws, card, deck, cachedData))
        },
        setToLoading: () => {
            dispatch(setCurveToLoading())
        }
    }
}

const DeckListView = connect(mapStateToProps, mapDispatchToProps)(DeckList)

export default DeckListView;
