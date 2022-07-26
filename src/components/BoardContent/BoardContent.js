/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { isEmpty } from 'lodash'

import './BoardContent.scss'

import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { fetchBoardDetails } from 'actions/ApiCall'
import { createNewColumn } from 'actions/ApiCall'

export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewmColumnForm, setOpenNewColumnForm] = useState(false)

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = (e) => (
    setNewColumnTitle(e.target.value)
  )

  useEffect(() => {

    const boardId = '62dcbe7f8b43f51480e2a73a'
    fetchBoardDetails(boardId).then(board => {
      // eslint-disable-next-line no-console
      console.log(board)
      setBoard(board)
      // Sort column
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
    })
    // if (boardFromDB) {
    // setBoard(boardFromDB)



    // setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, '_id'))
    // }
    // Sort column
    // boardFromDB.columns.sort((a, b) => {
    //   return boardFromDB.columnOrder.indexOf(a._id) - boardFromDB.columnOrder.indexOf(b._id)
    // })
    // setColumns(boardFromDB.columns)
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

    newBoard.columnOrder = newColumns.map(c => c._id)
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
      let currentColumn = newColumns.find(c => c._id === columnId)
      console.log(currentColumn)

      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)
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
      boardId: board._id,
      title: newColumnTitle.trim()
    }
    // Call API
    createNewColumn(newColumnToAdd).then(column => {
      let newColumns = [...columns]
      newColumns.push(column)

      let newBoard = { ...board }
      newBoard.columnOrder = newColumns.map(c => c._id)
      newBoard.columns = newColumns

      setColumns(newColumns)
      setBoard(newBoard)

      setNewColumnTitle('')
      toggleOpenNewColumnForm()
    })
  }

  const onUpdateColumnState = (newColumnToUpdate) => {
    // console.log(newColumnToUpdate)
    const columnIdToUpdate = newColumnToUpdate._id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(
      i => i._id === columnIdToUpdate
    )

    if (newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      // update column info

      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c._id)
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
              <Column column={column} onCardDrop={onCardDrop} onUpdateColumnState={onUpdateColumnState}
              />
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
              <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
              <span className="cancel-icon" onClick={toggleOpenNewColumnForm}><i className="fa fa-trash icon"></i></span>
            </Col>
          </Row>
        )
        }
      </BootstrapContainer>
    </div>
  )
}
