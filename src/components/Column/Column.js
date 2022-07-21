import React from 'react'
import { Container, Draggable } from 'react-smooth-dnd'

import './Column.scss'

import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'

export default function Column(props) {
  const { column, onCardDrop } = props
  // sort cards
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  // Chuyển onCarđrop qua BoardContent để set lại column ở board
  // const onCardDrop = (columnId, dropResult) => {

  //   if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
  //     console.log(columnId)
  //     console.log(dropResult)
  //   }
  // }
  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          {...column.props}
          // onDragStart={e => console.log('drag started', e)}
          // onDragEnd={e => console.log('drag end', e)}
          // onDragEnter={() => {
          //   console.log('drag enter:', column.id);
          // }}
          // onDragLeave={() => {
          //   console.log('drag leave:', column.id);
          // }}
          // onDropReady={p => console.log('Drop ready: ', p)}
          orientation="vertical" // default
          groupName="lotusdev-columns"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => {
            return (
              <Draggable key={index}>
                <Card card={card} />
              </Draggable>

            )
          })}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon"> Add another card</i>
        </div>
      </footer>
    </div>
  )
}
