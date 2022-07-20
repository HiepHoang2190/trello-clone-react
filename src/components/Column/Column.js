import React from 'react'

import './Column.scss';

import Card from 'components/Card/Card';
import { mapOrder } from 'utilities/sorts'

export default function Column(props) {
  const {column} = props
  // sort cards
  const cards = mapOrder(column.cards,column.cardOrder,'id')

  return (
    <div className="column">
      <header>{column.title}</header>
      <ul className="card-list">
        {/* <Card/>
        <li className="card-item">
          Add what you'd like to work on below
        </li> */}
        {cards.map((card,index) => {
          return (
            <Card key={index} card={card}/>
          )
        })}
     
      </ul>
      <footer>Add another card</footer>
    </div>
  )
}
