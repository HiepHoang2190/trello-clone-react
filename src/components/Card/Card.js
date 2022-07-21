import React from 'react'
import './Card.scss'

export default function Card(props) {
  const { card } = props
  return (
    <div className="card-item">
      {card.cover && (
        <img src={card.cover} className="card-cover" alt="title-image" onMouseDown={e => e.preventDefault()} />
      )}
      Title: {card.title}
    </div>
  )
}
