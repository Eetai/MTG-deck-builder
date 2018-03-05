import React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { removeCardFromDeck, updateCardInDeck } from '../reducers/deck.js'
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
import ProbabilityCell from './ProbabilityCell'
import Drawer from 'material-ui/Drawer';
import { spawn } from 'threads'

class DeckList extends Component {
    constructor(props){
        super(props)
        this.state = {
            drawer: false,
            selectedCard: {},
        }

        this.colors = {
            Blue: '#2693C7',
            Red: '#FC6621',
            Green: '#2BC749',
            White: '#FDEA6D',
            Black: '#A8A39A',
            Grey: '#99968f'
        }
    }

    render() {
        if (this.props){
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
                                                            <ProbabilityCell
                                                                draws = { 7 + v }
                                                                card = { card }
                                                                deck = { this.props.deck }
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
        }
    }
}

const DeckListView = connect(mapStateToProps, mapDispatchToProps)(DeckList)

export default DeckListView;
