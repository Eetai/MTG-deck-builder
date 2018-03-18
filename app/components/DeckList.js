import React from 'react'
import { connect } from 'react-redux'
import { Component } from 'react'
import { removeCardFromDeck, updateCardInDeck } from '../reducers/deck.js'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ZoomOut from 'material-ui/svg-icons/action/zoom-out';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import ProbabilityCell from './ProbabilityCell'
import Drawer from 'material-ui/Drawer';
import { spawn } from 'threads'
import { MediaQuery, Responsive } from 'react-responsive'

const tableStyles = {
    smallButton: {
        height: 25,
        lineHeight: '24px',
        verticalAlign: 'middle',
        width: 25
    }
}


class DeckList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawer: false,
            selectedCard: {},
            turns: [1,2,3,4,5,6,7,8]
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
        if (this.props) {
            return (
                <div className="DeckListContainer">
                    {/* drawer for showing single card previews */}
                    <Drawer
                        containerStyle={{ backgroundColor: '#212121' }}
                        open={this.state.drawer}
                        openSecondary={false}
                        docked={false}
                        width={"47%"}
                    >
                        <div>
                            <div>
                                <img
                                    style={{ transform: 'translate(100px, 10px)', width: 300, height: 'auto' }}
                                    src={`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.state.selectedCard.multiverseid}&type=card`}
                                />
                            </div>
                            <FloatingActionButton
                                style={{ transform: 'translate(230px, 10px)' }}
                                disabled={!this.state.drawer}
                                label={''}
                                backgroundColor={this.colors.White}
                                mini={true}
                                onClick={(e) => this.setState({ calculating: !this.state.calculating, drawer: !this.state.drawer })}>
                                <ZoomOut />
                            </FloatingActionButton>
                        </div>
                    </Drawer>

                    {/* probability table */}
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={{ width: '12%' }}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '9%', textAlign: 'center' }}>Edit</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '5%', textAlign: 'center' }}>Quantity</TableHeaderColumn>
                                {
                                    this.props.turns.map(turn => {
                                        return (
                                            <TableHeaderColumn key={`turn_column_header_${turn}`} style={{ textAlign: 'center', width: '5%' }}>{turn}</TableHeaderColumn>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} showRowHover={true}>
                            {
                                this.props.deckList.map(card => {
                                    return (
                                        <TableRow key={`${card.uniqueName}_row`}>
                                            <TableRowColumn
                                                style={{ width: '12%' }}
                                            >
                                                {/* open preview button */}
                                                <FloatingActionButton
                                                    style={{ paddingRight: '5px' }}
                                                    iconStyle={tableStyles.smallButton}
                                                    zDepth={0}
                                                    disabled={this.state.drawer}
                                                    label={''}
                                                    backgroundColor={this.colors.White}
                                                    onClick={(e) => this.setState({ calculating: !this.state.calculating, drawer: !this.state.drawer, selectedCard: card })}>
                                                    <ZoomIn />
                                                </FloatingActionButton>
                                                {card.name}
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '9%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    {/* increment button */}
                                                    <FloatingActionButton
                                                        style={{ padding: '1px' }}
                                                        iconStyle={tableStyles.smallButton}
                                                        zDepth={0}
                                                        disabled={card.quantity > 3 && !card.type.includes('Basic Land')}
                                                        backgroundColor={this.colors.Green}
                                                        mini={true}
                                                        onClick={() => this.props.updateCardQuant(card.uniqueName, card.quantity + 1)}>
                                                        <ContentAdd />
                                                    </FloatingActionButton>
                                                    {/* decrement button */}
                                                    <FloatingActionButton
                                                        style={{ padding: '1px' }}
                                                        iconStyle={tableStyles.smallButton}
                                                        zDepth={0}
                                                        disabled={card.quantity < 1}
                                                        backgroundColor={this.colors.Blue}
                                                        mini={true}
                                                        onClick={() => {
                                                            this.props.updateCardQuant(card.uniqueName, card.quantity - 1)
                                                        }}>
                                                        <ContentRemove />
                                                    </FloatingActionButton>
                                                    {/* remove-from-deck button */}
                                                    <FloatingActionButton
                                                        style={{ padding: '1px' }}
                                                        iconStyle={tableStyles.smallButton}
                                                        zDepth={0}
                                                        backgroundColor={this.colors.Red}
                                                        mini={true}
                                                        onClick={() => this.props.removeCard(card.uniqueName)}>
                                                        <ContentClear />
                                                    </FloatingActionButton>
                                                </div>
                                            </TableRowColumn>
                                            <TableRowColumn style={{ width: '5%', textAlign: 'center' }}>{card.quantity}</TableRowColumn>
                                            {/* probabilitiy cells */}
                                            {
                                                this.props.turns.map(turn => {
                                                    return (
                                                        <TableRowColumn key={`probability_table_cell_${card.multiverseid}_${turn}`} style={{ width: '5%' }}>
                                                            <ProbabilityCell
                                                                key={`${card.multiverseid}_${turn}`}
                                                                draws={6 + turn}
                                                                card={card}
                                                                deck={this.props.deck}
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
        deck: storeState.deckReducer,
        user: storeState.defaultUser
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCardQuant: (uniqueName, value) => {
            dispatch(updateCardInDeck(uniqueName, { quantity: value }))
        },
        removeCard: (cardUniqName) => {
            dispatch(removeCardFromDeck(cardUniqName));
        }
    }
}

const DeckListView = connect(mapStateToProps, mapDispatchToProps)(DeckList)

export default DeckListView;
