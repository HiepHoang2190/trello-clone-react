import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'

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

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder,'id'))
    }
  }, [])
  if (isEmpty(board)) {
    return <div className="not-found" style={{
      'padding': '10px',
      'color': 'white'
    }}>Board not found!</div>
  }

  return (
    <div className="board-content">
      {columns.map((column, index) => {
        return (
          <Column key={index} column={column} />
        )
      })}


    </div>
  )
}
