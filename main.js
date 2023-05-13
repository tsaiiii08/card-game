const GAME_STATE = {
  FirstCardAwaites:"FirstCardAwaites",
  SecondCardAwaites:"SecondCardAwaites",
  CardsMatches:"CardsMatches",
  CardsMatchFailed:"CardsMatchFailed",
  GameFinished:"GameFinished"
}
  


const Symbols = ['https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', 'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', 'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', 'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png'
]

const numberOfCard = 52


const view = {
  getCardElement(index) {
    return `
    <div data-index=${index} class="card back">
    </div>
    `
  },

  getCardContent(index){
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
    <p>${number}</p>
    <img src="${symbol}" alt="">
    <p>${number}</p>
    `
  },

  transformNumber(number) {
    switch (number) {
      case 1: return 'A'
      case 11: return 'J'
      case 12: return 'Q'
      case 13: return 'K'
      default: return number
    }
  },

 
  displayCards(indexes) {
    const rootElement = document.querySelector('.cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("")
  },

  flipCards(...cards){
    cards.map(card => {
       if(card.classList.contains('back')){
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      console.log(card)
      return
      }
      card.classList.add('back')
    card.innerHTML = null
    }) 
  },
  pairCard(...cards){
    cards.map(card=>{
       card.classList.add('.paired')
    })
   
  },

  renderScore(score){
    document.querySelector('.score').textContent = `Score: ${score}`
  },

  renderTreidTimes(times){
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },
  appendWrongAnimation(...cards){
    cards.map(card=>{
       card.classList.add('wrong')
    card.addEventListener('animationend',e=>{
      card.classList.remove('wrong'),{once:true}
    })
   
    })
  },
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number

  }
}


const controller = {
  currentStage : GAME_STATE.FirstCardAwaites,
  generateCards(){
    view.displayCards(utility.getRandomNumberArray(numberOfCard))
  },
  dispatchCardAction(card){
    if(!card.classList.contains('back')){
      return
    }

    switch (this.currentStage) {
      case GAME_STATE.FirstCardAwaites:
        view.flipCards(card)
        model.revealedCard.push(card)
        this.currentStage = GAME_STATE.SecondCardAwaites
        break;

      case GAME_STATE.SecondCardAwaites:
        view.renderTreidTimes(model.triedTimes += 1)
        view.flipCards(card)
        model.revealedCard.push(card)
        this.currentStage = GAME_STATE.SecondCardAwaites
        console.log(model.isRevealedCardMatch())
        if(model.isRevealedCardMatch()){
          view.renderScore(model.score+=10)
          this.currentStage = GAME_STATE.CardsMatches
          view.pairCard(...model.revealedCard)
          model.revealedCard = []
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  
            return
          }
          this.currentStage = GAME_STATE.FirstCardAwaites


        } else{
          view.appendWrongAnimation(...model.revealedCard)
          this.currentStage = GAME_STATE.CardsMatchFailed
          setTimeout(this.resetCards,1000)
          
        }
        break;
        
      
    }


  },
  resetCards(){
    view.flipCards(...model.revealedCard)
    model.revealedCard = []
    controller.currentStage = GAME_STATE.FirstCardAwaites
  }
}

const model = {
  revealedCard: [],
  isRevealedCardMatch(){
    return this.revealedCard[0].dataset.index % 13 === this.revealedCard[1].dataset.index % 13
  },
  score:0,
  triedTimes: 0,
}


controller.generateCards()
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click',event=>{
    controller.dispatchCardAction(card)
  })
})