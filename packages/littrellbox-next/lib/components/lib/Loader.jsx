import React from 'react'

class CircleLoader extends React.Component {
  render() {
    return (
      //FIXME: oh go not this
      <div className="lds-spinner">
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    )
  }
}

export default CircleLoader