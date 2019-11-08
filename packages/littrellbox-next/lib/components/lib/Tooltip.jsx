import React from 'react'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={"tooltip-container " + this.props.className}>
        {this.props.children}
        <div className="tooltip">
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default Tooltip;