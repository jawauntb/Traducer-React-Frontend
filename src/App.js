import React, { Component } from 'react';
import translate from './translate.svg';
// import './App.css';
import ReactDOM from 'react-dom';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteringNewPhrase: true
    };
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick() {
    if (this.state.enteringNewPhrase === true) {
      this.setState({enteringNewPhrase: false});
    } else {
      this.setState({enteringNewPhrase: true});
    }
  }


  render() {

    var loadContent;
    var buttonText;
    var headerText;
    if (this.state.enteringNewPhrase === true) {
      loadContent = <InputForm />;
      buttonText = "See Past Translations";
      headerText = <p>Click the button in the navbar to see every translation on record!</p>;
    } else {
      loadContent = <Table />;
      buttonText = "Translate Into English";
      headerText = <p>Click the button in the navbar to translate text into English!</p>;
    }

    return (
      <div class="text-center">
        <Navbar
          handleClick={this.handleClick}
          buttonText={buttonText}
        />
        <SiteHeader
          headerText={headerText}
        />
        {loadContent}
        <Footer/>
      </div>
    );
  }
}


class Navbar extends Component {

  render() {
    return (
      <div id="nav">
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <NavHeader/>
            <div class="collapse navbar-collapse" id="myNavbar">
              <ul class="nav navbar-nav">
                <li><a>Traduce</a></li>
                <li>
                    <button onClick={this.props.handleClick}>
                      {this.props.buttonText}
                    </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

class NavHeader extends Component {
  render() {
    return (
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <img src={translate} />
      </div>
    );
  }

}
    
    
class SiteHeader extends Component {
  render() {
    return (
        <div class="jumbotron">
          <div class="container text-center">
            <h1>Traduce!</h1>
            <h2>The World's Premier solution for translating notes into english</h2>
            {this.props.headerText}
          </div>
        </div>
    );
  }
}

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    var text_in = JSON.stringify({
      input_text: this.state.value,
    });
    alert('A New Phrase Was Submitted For Translation: ' + this.state.value);
    fetch('http://django-env.6gwinyghki.us-east-1.elasticbeanstalk.com/api/translations/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: text_in
    });
    event.preventDefault();
  }

  render() {
    return (
      <div class="col-sm-12 well">
          <form role="form" id="entry" onSubmit={this.handleSubmit}>
            <div class="form-group">
              <label>
                <h4>Enter A Translation:</h4>
                <textarea value={this.state.value} onChange={this.handleChange} class="form-control" rows="3" required />
              </label>
              <p>*Reminder: Traduce only translates INTO english FROM another language.</p>
            </div>
            <hr />
            <button type="submit" class="btn btn-success" value="Submit">Submit</button>
          </form>
      </div>
    );
  }
}

class Table extends Component {
  state = {
    translations: []
  };

  async componentDidMount() {
    try {
      const res = await fetch('http://django-env.6gwinyghki.us-east-1.elasticbeanstalk.com/api/translations/');
      const translations = await res.json();
      this.setState({
        translations
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div class="container well tables">
        <table id="entries">
          <tr>
            <td>Entered Text</td>
            <td>Language of Input</td>
            <td>English Translation</td>
          </tr>
          {this.state.translations.map(item => (
            <tr>
              <td key={item.input_text}>{item.input_text}</td>
              <td key={item.language}>{item.language}</td>
              <td key={item.output_text}>{item.output_text}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div>
        <footer class="container-fluid text-center footer">
          <div class="row">
            <h5>Thanks for using Traduce, A fun tool to play around
          with foreign language translations with friends!</h5>
          </div>
        </footer>
      </div>
    );
  }
}

export default App
