const Player = (isTurn, xOrO) => {
	const positions = []
	const addPosition = numToAdd => positions.push(numToAdd)
	let score = 0

	return {
		xOrO,
		isTurn,
		positions,
		addPosition,
		score,
	}
}

const x = Player(true, 'x')
const o = Player(false, 'o')

const gameBoard = (() => {
	const gameBoardCells = document.querySelectorAll('[data-cell]')
	const playerX = document.getElementById('playerX')
	const playerO = document.getElementById('playerO')
	const restartButton = document.querySelector('.scoreboard button')
	const modal = document.querySelector('.modal')

	const winningCombinations = [
		['1', '2', '3'],
		['4', '5', '6'],
		['7', '8', '9'],
		['1', '4', '7'],
		['2', '5', '8'],
		['3', '6', '9'],
		['1', '5', '9'],
		['3', '5', '7'],
	]
	let gameBoardIsActive = true

	gameBoardCells.forEach(cell => {
		cell.addEventListener('click', e => {
			if (cell.classList.contains('x') || cell.classList.contains('o')) return
			if (x.isTurn) populateCell(cell, x)
			else populateCell(cell, o)
		})
	})

	const updateScore = function (player) {
		player.score++
		if (player.xOrO === 'x') {
			console.log(player.xOrO)
			playerX.textContent = player.score
		}
		if (player.xOrO === 'o') {
			console.log(player.xOrO)
			playerO.textContent = player.score
		}
	}

	const populateCell = function (cell, player) {
		cell.classList.add(player.xOrO)
		player.addPosition(cell.dataset.cell)
		checkForWinner(player)
		o.isTurn = !o.isTurn
		x.isTurn = !x.isTurn
	}

	const checkForWinner = function (player) {
		console.log(player.positions)
		winningCombinations.forEach(combination => {
			if (combination.every(val => player.positions.includes(val))) {
				gameBoardIsActive = false
				displayWinner(player)
				updateScore(player)
			}
		})
		let count = 0
		gameBoardCells.forEach(cell => {
			if (cell.classList.contains('x') || cell.classList.contains('o')) {
				count++
			}
		})
		if (count >= 9) {
			gameBoardIsActive = false
			displayWinner('draw')
		}
	}

	const displayWinner = function (winner) {
		let textContent = ''
		let textColor = ''
		if (winner === 'draw') {
			textContent = `It's a Draw`
			textColor = 'white'
		} else if (winner.xOrO === 'x') {
			textContent = `X Wins!`
			textColor = '#34d1bf'
		} else {
			textContent = `O Wins!`
			textColor = '#3454d1'
		}
		modal.textContent = textContent
		modal.style.color = textColor
		modal.showModal()
	}

	restartButton.addEventListener('click', clearBoard)

	modal.addEventListener('click', dialogClickHandler)

	function dialogClickHandler(e) {
		if (e.target.tagName !== 'DIALOG') return
		const rect = e.target.getBoundingClientRect()
		const clickedInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width
		if (clickedInDialog === false) e.target.close()
		clearBoard()
	}

	function clearBoard() {
		gameBoardIsActive = true
		x.isTurn = true
		o.isTurn = false
		x.positions.length = 0
		o.positions.length = 0
		gameBoardCells.forEach(cell => {
			if (cell.classList.contains('x')) cell.classList.remove('x')
			if (cell.classList.contains('o')) cell.classList.remove('o')
		})
	}
})()
