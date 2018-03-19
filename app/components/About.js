import React from 'react'
import SocialPeople from 'material-ui/svg-icons/social/people';
import SocialPerson from 'material-ui/svg-icons/social/person';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import { colors } from '../../public/stylesheets/Colors'

const styles = {
  cardText: {
    marginLeft: '15px',
    marginRight: '15px',
    marginTop: '-12px'
  }
}

export default function About(props) {
  return (
    <Tabs
      tabItemContainerStyle={{ backgroundColor: colors.Black }}
      inkBarStyle={{ backgroundColor: colors.White }}
      >
      <Tab label="Team">
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
          <CardTitle title="The Team" subtitle="Roles and contributions" />
          <CardHeader
            title="Abel"
            subtitle="Lead Engineer"
            avatar={<SocialPerson />}
          />
          <CardText style={styles.cardText} >
            Abel joined the team after Bryan and Eetai had already embarked on creating an MTG deck analyzing app. He ended up pushing the app to take a different direction, as a probability calculator rather than a statistical metagame cruncher. Abel's mathematics background enabled him to approach the problem of computing the probability of playing specific cards in a robust way. Abel also architeched much of the app and designed the interface of how to interact with his algorithm.
          </CardText>

          <CardHeader
            title="Bryan"
            subtitle="Engineer, Contributor"
            avatar={<SocialPerson />}
          />
          <CardText style={styles.cardText}>
            Bryan was a casual MTG player growing up, a great team player, and a talented programmer that can dive into any project and get results quickly. He is was a natural choice contributor to the project. Bryan built much of the foundation for the app, from the schemas, to secruity, Bryan contributed at many steps along the way.
          </CardText>

          <CardHeader
            title="Eetai"
            subtitle="Professional MTG player, Contributor"
            avatar={<SocialPerson />}
          />
          <CardText style={styles.cardText}>
            Eetai was the catylist behind MTG Curve. His experience on the Pro Tour, and as an ongoing contributor to the highest levels of MTG's metagame, Eetai was a key consultant on every facet of this project. His expertise as a MTG player are the reason for many of the design choices, and inclusion of many features of the app.
          </CardText>
        </Card>
      </Tab>
      <Tab label="App">
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
          <CardTitle title="The App" subtitle="General information" />
          <CardHeader
            title="MTG Curve's Motivation"
            subtitle="Something we wanted to use"
            avatar={<img src="./Manapix/Wmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardText style={styles.cardText}>
            All three of members of the team have experience playing MTG. And each of us have always thought it would be great to 'know' how to best balance a deck's landbase. Until now the sorts of decisions that go into scultping the landbase of have been an esoteric art. Player's like Eetai can be pretty sure they have it right and pretty much everyone else is guessing. We set out to elucidate these decisions for players of all levels. The result of our efforts is this app, which we hope you enjoy.
          </CardText>
          <CardHeader
            title="How to use it"
            subtitle="And what it can do"
            avatar={<img src="./Manapix/Gmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardText style={styles.cardText}>
            Users can create decks by searching for cards in the search bar at the top left of the app. Once cards have been added to a deck, a user can adjust the quantity of any card in the deck, remove a card from the deck, view spoilers of the cards in the deck. Adding cards to a deck populates the app's table which shows relevant (although not necessarily exhaustive) manacolors which a land produces for land cards, and the probabilities of being able to draw, and play, any given non-land card, based on the decks specific composition.
          </CardText>
          <CardText style={styles.cardText}>
            Users can also login, which enables them to save decklists, or load old decklists which they have saved. Usernames, passwords, decks, etc. are not shared among other users or entities.
          </CardText>
        </Card>
      </Tab>
      <Tab label="Algorithm">
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
          <CardTitle title="The Algorithm" subtitle="What it's doing, how, and some assumptions" />
          <CardText style={styles.cardText}>
            The algorithm was entirely designed by Abel. In short its purpose is to parse a deck of cards for all relevant land-mana-sources including, multicolor and fetch lands, and find every hand the deck can yeild on a given turn that can successfully play a given card then computes their combined probabilities. No statistical analysis is done, the numbers you see are probailities, this means they are not guesses, they are exact, and will always be the same every time you visit the site. The primary concepts that the algorithm uses to do this are the following:
          </CardText>
          <CardHeader
            title="Vandermonde's Convolution"
            subtitle="an identity for binomial coefficients"
            avatar={<img src="./Manapix/Bmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardMedia style={{ maxWidth: '300px' }}>
            <img src="./Morepix/Vandermondes.png" alt="" style={{ paddingLeft: '25px', width: '434px', height: 'auto' }} />
          </CardMedia>
          <CardText style={styles.cardText}>
            This allows the calculator to handle fetch lands. Fetch lands were problematic. They have side effects, like thinning the deck, and injecting player-choice into the otherwise random act of drawing cards. To handle this the algorithm leverages Vandermonde's convolution, by saying that essencially we can compute a series discrete sub-scenarios and add them together rather than trying to hand the entire computation at once. The following is a breakdown of this process
          </CardText>
          <CardText style={styles.cardText}>
            All fetch lands that can fetch lands which are relevant to the colored mana cost requirements of a given card are separated from the deck. A heuristic determines the highest value land to fetch given a cards manacost and the number of colors of mana the land can produce. That land is assumed to have been chosen, as such the card's cost is reduced appropriately. if the land is a dual land, and both colors could count twards the cost of the card, the cards cost is augmented to include split lands. This models the player defering theeir choice until more information is revealed. This assumes optimal play.
          </CardText>
          <CardText style={styles.cardText}>
            This effectively partitions the computation of playing the card. The summands in the LHS of Vandermonde's Convolution can be tinerprited as the various scenarios in which various numbers of fetch lands were used to play a given card. This was an essencial methodology, because dual and fetch lands were not interchangeable and could not be treated in such a way that would entanlge fetch lands with ordinary multicolored lands.
          </CardText>
          <CardHeader
            title="Multichoose"
            subtitle="augmented permutations"
            avatar={<img src="./Manapix/Rmana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardMedia style={{ maxWidth: '300px' }}>
            <img src="./Morepix/Multichoose.png" alt="" style={{ paddingLeft: '25px', width: '434px', height: 'auto' }} />
          </CardMedia>
          <CardText style={styles.cardText}>
            Multichoose techniques are fairly straightforward. They are a means of computing the number of multisets of size n on k symbols. The k symbols are distinguishable and the n positions in the multiset are indistinguishable. This allows us to count the number ways to draw multiples of the same card in a ahand of a given size, since technically we need to distinguish between the cards in our deck, even if they have the same name, whereas, we do not care what order we drew them in, given that we got them one at a time (this is an important assumption, nothing about the calculator models drawing multiple cards per turn).
          </CardText>
          <CardText style={styles.cardText}>
            Here is where the problem kicks in. We do not want a count, so the formula above is actually not of that much use to us. What we actually want is to enumerate the various hands we could draw. Those abstracted enumerations are what we use to compute the probabilities. However, there are trillions of possible hands for a 60 card deck. We need to model for drawing of cards exhaustively such that it A.) doesn't take forever, and B.) doesn't break any rules of the game. Here is how the algorithm does it:
          </CardText>
          <CardText style={styles.cardText}>
            It uses an augmented permuations algorithm which constucts hands recursively. A hand is essencially a set of buckets, each bucket represents a different kind of card ('produces red mana', 'produces red mana and green mana', 'produces no mana', 'is the card we are trying to play', ...). Similar to how we would create permuations, the algorithm one-by-one duplicates the set of buckets and for each duplicate it places one more thing in a different bucket. This permutation algorithm also makes sure never to place too many things in any one bucket, but can put more than one thing in each bucket. This makes sure that duplicate cards are being modeled, but also, not exceeding the quantities in the deck itself.
          </CardText>
          <CardText style={styles.cardText}>
            Once all this is done. Every viable hand for playing a given card, on a given turn, has been enumerated, but once again, these hands are not sysnonimous with values, they are merely abstracted selections of cards. They are however sufficient to begin the actual probability calculation.
          </CardText>
          <CardHeader
            title="Hypergeometric Distributions"
            subtitle="how poker probabilities are calculated"
            avatar={<img src="./Manapix/Umana.png" style={{ width: '40px', height: '40px' }} />}
          />
          <CardMedia style={{ maxWidth: '300px' }}>
            <img src="./Morepix/HypergeometricPMF.png" alt="" style={{ paddingLeft: '25px', width: '434px', height: 'auto' }} />
          </CardMedia>
          <CardText style={styles.cardText}>
            Hypergeometric distributions compute probabilities of drawing specific things without replacement. Since the algorithm has already gone through the exhaustive process of enumerating hands. We can use the above formula directly to comput that hand into a probabilitiy. Since we know that the multichoose algorithm is not repetitive, we know each hand is different, so we needn't worry about implementing inclusion exclusion or anything remotely fancy. We can simply convert each hand into its respective probability and add them together.
          </CardText>
          <CardText style={styles.cardText}>
            Keeping in mind that this entire process is being done many times in parallel because of how we're implementing Vandermonde's Convolution, the resultant sum will be the probability of having drawn some number of fetch lands, a given card -with a modified manacost based on the number of fetch lands which were drawn-, and some combination of other lands which allow the card to be legally played on the given turn. The algorithm outputs the sum of each of these probabilities, one aggregated probabilitiy for each number of fetch lands which could have been drawn.
          </CardText>
        </Card>
      </Tab>
    </Tabs>
  )
}
