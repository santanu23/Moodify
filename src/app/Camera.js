import React, {Component} from 'react';
import Webcam from 'react-webcam';

class Cam extends Component {
	constructor(props, context) {
    	super(props, context);

    	this.screenshot = this.screenshot.bind(this);

    	this.state = {
      		screenshot: this.props.img,
        	tab: 0
    	};
  	}

  	screenshot() {
      var screenshot = this.refs.webcam.getScreenshot();
      this.setState({screenshot: screenshot});
  	}

  render() {
    return (
    	<div>
		<Webcam ref='webcam' screenshotFormat='image/png' audio={false}/>

		<div className='screenshots'>
            <div className='controls'>
                <button onClick={this.screenshot}>capture</button>
            </div>
            { this.state.screenshot ? <img src={this.state.screenshot} /> : null }
        </div>
        </div>
    )
  }
}

export default Cam;