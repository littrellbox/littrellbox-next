import React from 'react'

class CircleLoader extends React.Component {
  render() {
    return (
      //FIXME: oh god not this
      <div className={this.props.className + " lds-spinner"}>
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