import React from 'react'
import { Container, Draggable } from 'react-smooth-dnd'

import './Column.scss'

import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'

export default function Column(props) {
  const { column } = props
  // sort cards
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const onCardDrop = (dropResult) => {
    console.log(dropResult)
  }
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
          onDrop={onCardDrop}
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
      <footer>Add another card</footer>
    </div>
  )
}
