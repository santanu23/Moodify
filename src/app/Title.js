import React, {Component} from 'react';

class Title extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
    	<center>
      		<h1>{this.props.name}</h1>
      	</center>
    );
  }
}

export default Title;