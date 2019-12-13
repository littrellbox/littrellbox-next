import React from 'react'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let style = "tooltip";
    if(this.props.side) {
      style = "tooltip " + "tooltip-" + this.props.side;
    }
    return (
      <div className={"tooltip-container " + this.props.className}>
        {this.props.children}
        <div className={style}>
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default Tooltip;