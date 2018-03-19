const Sequelize = require('sequelize');
const db = require('../models/db')

const mtgJson = require('./AllSets.json')
const { Cards, Decks, Users, Decks_Cards } = require('../models')

const mtgSets = Object.keys(mtgJson);
let setNames = mtgSets.map((name) => {
    return mtgJson[name].name;
})
//get array of each cards array
const cardSets = mtgSets.map((name) => {
    return mtgJson[name].cards;
})

for (var i = 0; i < setNames.length; i++) {
    for (var j = 0; j < cardSets[i].length; j++) {
        cardSets[i][j].set = setNames[i];
    }
}

//forEach array, push into a cards array
//nested forEach
const allCards = []

cardSets.forEach((cardSet) => {
    cardSet.forEach((card) => {
        delete card.id;
        allCards.push(card);
    })
})

const cardsWithMultiverseId = allCards.reduce((cards, card, i) => {
    if (card.multiverseid) {
        function parse(card){
            let P =''
            let F=''
            if(!card.text) card.text = ''
            if(card.type.includes('Land')) {
                P += card.type.split(' ').reduce((a, b) => {
                    if (b === 'Swamp') a += 'B'
                    if (b === 'Forest') a += 'G'
                    if (b === 'Plains') a += 'W'
                    if (b === 'Mountain') a += 'R'
                    if (b === 'Island') a += 'U'
                    return a
                }, '').split('').sort().join(',')
                if (card.text.indexOf('{B}') > 0 && P.indexOf('B') < 0) P += 'B'
                if (card.text.indexOf('{G}') > 0 && P.indexOf('G') < 0) P += 'G'
                if (card.text.indexOf('{W}') > 0 && P.indexOf('W') < 0) P += 'W'
                if (card.text.indexOf('{R}') > 0 && P.indexOf('R') < 0) P += 'R'
                if (card.text.indexOf('{U}') > 0 && P.indexOf('U') < 0) P += 'U'
                if (card.text.indexOf('{C}') > 0 && P.indexOf('C') < 0) P += 'C'
                if (card.text.indexOf('any color') > 0 || card.text.indexOf('any type') > 0) P += 'WRGBU'
                if (card.text.indexOf(`Sacrifice ${card.name}: Search`) > -1) {
                    P += 'F'
                }
            }

            if(P === '') P = false
            else P = P.split('').sort().reduce((a, b) => (a.includes(b) || b=== ' ' || b===',') ? a : a.concat(b),[]).join(',')

            F = (P === 'F') ? card.text.split('\n').reduce((a, b) => {
                if (b.indexOf(`Sacrifice ${card.name}: Search`) > -1) {
                    if (b.indexOf('basic') > 0 && a.indexOf('C') < 0) a += 'Basic,'
                    if (b.indexOf('Mountain') > 0 && a.indexOf('C') < 0) a += 'Mountain,'
                    if (b.indexOf('Forest') > 0 && a.indexOf('C') < 0) a += 'Forest,'
                    if (b.indexOf('Island') > 0 && a.indexOf('C') < 0) a += 'Island,'
                    if (b.indexOf('Swamp') > 0 && a.indexOf('C') < 0) a += 'Swamp,'
                    if (b.indexOf('Plains') > 0 && a.indexOf('C') < 0) a += 'Plains,'
                }
                return a
            }, '').slice(0, -1) : false
            return[P,F]
        }
        let ProducibleManaColors = ''
        let fetchOptions = ''
        let parsed = parse(card, ProducibleManaColors, fetchOptions)
        ProducibleManaColors = parsed[0]
        fetchOptions = parsed[1]
        if(card.manaCost){
            card.manaCost = card.manaCost.split('/').join('')
        }

        cards.push(Object.assign({}, card , { fetchOptions , ProducibleManaColors , uniqueName: (card.name + ' (' + card.set + ') #' + card.multiverseid)}))
    };
    return cards
},[])


// seed file for mtg db
Cards.sync({
        force: true
    })
    .then(() => {
        Cards.bulkCreate(cardsWithMultiverseId);
    })
    .then(() => {
        console.log('cards success');
        Users.sync({ force: true })
            .then(() => {
                console.log('users success');
                Decks.sync({ force: true })
                    .then(() => {
                        console.log('decks success');
                        Decks_Cards.sync({ force: true })
                            .then(() => {
                                console.log('decks_cards success');
                                console.log('all done!');
                                process.exit(0);
                            })
                    })
            })
    })
    .catch();
