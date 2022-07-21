import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'

import { initialData } from 'actions/initialData'
export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      // Sort column
      // boardFromDB.columns.sort((a, b) => {
      //   return boardFromDB.columnOrder.indexOf(a.id) - boardFromDB.columnOrder.indexOf(b.id)
      // })
      // setColumns(boardFromDB.columns)

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }
  }, [])
  if (isEmpty(board)) {
    return <div className="not-found" style={{
      'padding': '10px',
      'color': 'white'
    }}>Board not found!</div>
  }

  const onColumnDrop = (dropResult) => {
    // console.log(dropResult)
    let newColumns = [...columns]
    let newBoard = { ...board }
    newColumns = applyDrag(newColumns, dropResult)

    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    // console.log(newBoard)
    // console.log(newColumns)
    // console.log(columns)
    setColumns(newColumns)
    setBoard(newBoard)
    // sau khi cập nhật column thì cần cập nhật columnOrder ở board

  }

  const onCardDrop = (columnId, dropResult) => {

    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      // console.log(columnId)
      // console.log(dropResult)

      let newColumns = [...columns]
      let currentColumn = newColumns.find(c => c.id === columnId)
      console.log(currentColumn)

      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)
      console.log(newColumns)
      setColumns(newColumns)

    }
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]
        }
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => {
          return (
            <Draggable key={index}>
              <Column column={column} onCardDrop={onCardDrop} />
            </Draggable>
          )
        })}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon"> Add another column</i>
      </div>
    </div>
  )
}
