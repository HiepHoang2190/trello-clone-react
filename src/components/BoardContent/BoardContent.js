import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'

import { initialData } from 'actions/initialData'
export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewmColumnForm, setOpenNewColumnForm] = useState(false)

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = useCallback((e) => (
    setNewColumnTitle(e.target.value)
  ), [])
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

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewmColumnForm])

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

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewmColumnForm)
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), // 5 ranom characters, will remove when we implement code API
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)

    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    // console.log(newColumnToUpdate)
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(
      i => i.id === columnIdToUpdate
    )

    if (newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      // update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)

    // console.log(columnIndexToUpdate)
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
              <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
            </Draggable>
          )
        })}
      </Container>
      <BootstrapContainer className="dev-trello-container">
        {!openNewmColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon"> Add another column</i>
            </Col>
          </Row>
        )}
        {openNewmColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>{' '}
              <span className="cancel-new-column" onClick={toggleOpenNewColumnForm}><i className="fa fa-trash icon"></i></span>
            </Col>
          </Row>
        )
        }
      </BootstrapContainer>
    </div>
  )
}
