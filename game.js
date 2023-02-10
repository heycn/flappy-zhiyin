const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')
const gameContainer = document.getElementById('game-container')
const endMenu = document.getElementById('end-menu')
const endScore = document.getElementById('end-score')
const bestScore = document.getElementById('best-score')

// 鸡图
const flappyImg = new Image()
flappyImg.src = './assets/flappy_zhiyin.png'

// 游戏
const flapSpeed = -3
const birdWidth = 30
const birdHeight = 30
const pipeWidth = 50
const pipeGap = 125

// 鸡
let birdX = 50
let birdY = 50
let birdSpeed = 0
let birdAcceleration = 0.1

// 管道
let pipeX = 400
let pipeY = canvas.height - 200

// 得分和最高得分
let scoreDiv = document.getElementById('score-display')
let score = 0
let heightScore = 0
let scored = false

document.body.addEventListener('touchstart', () => (birdSpeed = flapSpeed))
document.body.addEventListener('keyup', e => e.key === ' ' && (birdSpeed = flapSpeed))

document.getElementById('restart-button').addEventListener('click', () => {
  hideEndMenu()
  restGame()
  loop()
})

const increaseScore = () => {
  if (birdX > pipeX + pipeWidth &&
     (birdY < pipeY + pipeGap || birdY + birdHeight > pipeY + pipeGap) &&
     !scored) {
    score++
    scoreDiv.innerHTML = score
    scored = true
  }

  if (birdX < pipeX + pipeWidth) {
    scored = false
  }
}

const collisionCheck = () => {
  const birdBox = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
  }
  const topPipeBox = {
    x: pipeX,
    y: pipeX - pipeGap + birdHeight,
    width: pipeWidth,
    height: pipeY
  }
  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + pipeGap + birdHeight,
    width: pipeWidth,
    height: canvas.height - pipeY - pipeGap
  }

  const topPipeCollision = () => (birdBox.x + birdBox.width > topPipeBox.x &&
                                 birdBox.x < topPipeBox.x + topPipeBox.width &&
                                 birdBox.y < topPipeBox.y)
  const bottomPipeCollision = () => (birdBox.x + birdBox.width > bottomPipeBox.x &&
                                    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
                                    birdBox.y + birdBox.height > bottomPipeBox.y)
  const birdCollision = () => (birdY < 0 || birdY + birdHeight > canvas.height)
  if (topPipeCollision() || bottomPipeCollision() || birdCollision()) {
    return true
  }
  return false
}

const hideEndMenu = () => {
  endMenu.style.display = 'none'
  gameContainer.classList.remove('backdrop-blur')
  endScore.innerHTML = score
}

const showEndMenu = () => {
  endMenu.style.display = 'block'
  gameContainer.classList.add('backdrop-blur')
  endScore.innerHTML = score
  if (heightScore < score) {
    heightScore = score
  }
  bestScore.innerHTML = heightScore
}

const restGame = () => {
  birdX = 50
  birdY = 50
  birdSpeed = 0
  birdAcceleration = 0.1
  pipeX = 400
  pipeY = canvas.height - 200
  score = 0
  scoreDiv.innerHTML = score
}

const endGame = () => {
  showEndMenu()
}

const birdMove = () => {
  ctx.drawImage(flappyImg, birdX, birdY, birdWidth, birdHeight)
  birdSpeed += birdAcceleration
  birdY += birdSpeed
}

const pipeMove = () => {
  ctx.fillStyle = '#333'
  ctx.fillRect(pipeX, -100, pipeWidth, pipeY)
  ctx.fillRect(pipeX, pipeY + pipeGap, pipeWidth, canvas.height - pipeY)
  pipeX -= 1.5
  if (pipeX < -50) {
    pipeX = 400
    pipeY = Math.random() * (canvas.height - pipeGap) + pipeWidth
  }
}

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  pipeMove()
  birdMove()
  if (collisionCheck()) {
    endGame()
    return
  }
  increaseScore()
  requestAnimationFrame(loop)
}

loop()
