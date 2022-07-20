import React from 'react'
import './BoardContent.scss'
import Column from 'components/Column/Column'
export default function BoardContent() {
  return (
    <div className="board-content">
    <Column/>
    <Column/>
    <Column/>
    <Column/>
    <Column/>
    <Column/>
  </div>
  )
}
