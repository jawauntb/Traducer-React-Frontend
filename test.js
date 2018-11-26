import React, { Component } from 'react';
import translate from './translate.svg';
import { Navbar, NavbarSearch, NavbarLink, NavbarHeader } from "./Navbars.js";
import './App.css';
import ReactDOM from 'react-dom';
import { Footer } from './src/Head_And_Foot';


class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderButtonTitle = this.renderButtonTitle.bind(this);
    this.renderHeaderText = this.renderHeaderText.bind(this);
    this.state = {
      enteringNewPhrase: true
    };
  }
  // you must make a function that returns either a TextForm or a table and changes depending on the state
  // if you click the button, you change the button text. you alse render

  handleClick() {
    if (this.state.enteringNewPhrase) {
      this.setState({enteringNewPhrase: false});
    } this.setState({enteringNewPhrase: true});
  }


  renderContent() {
    if (this.state.enteringNewPhrase) {
      return <InputForm />;
    } else {
      return <Table />;
    }
  }

  renderHeaderText() {
    if (this.props.enteringNewPhrase) {
      return "Click the button in the navbar to see every translation on record!";
    } else {
      return "Click the button in the navbar to translate text into English!";
    }
  }


  renderButtonTitle() {
    if (this.state.enteringNewPhrase) {
      return "See All The Translations We've Made";
    } else {
      return "Translate A New Phrase Into English";
    }
  }


  render() {
    return (
      <div>
        <Navbar />
        <SiteHeader />
        {this.renderContent}
        <Footer />
      </div>
    );
  }
}


class Navbar extends Component {
  render() {
    return (
      <div>
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <button onClick={this.props.handleClick}>
                <img src={translate} />
              </button>
            </div>
            <div>Traduce</div>
            <div class="collapse navbar-collapse" id="myNavbar">
              <ul class="nav navbar-nav">
                <li>
                  <button onClick={this.props.handleClick}>{this.renderButtonTitle}</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

class SiteHeader extends Component {
  render() {
    return (
      <div>
        <div class="jumbotron"><br />
          <div class="container text-center">
            <h1>Traduce!</h1>
            <h2>The World's Premier solution for translating notes into english</h2>
            <p>{this.renderHeaderText}</p>
          </div>
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
      language: "",
      output_text: ""
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
  }

  render() {
    return (
      <div class="col-sm-9">
        <hr />
        <h4>Enter A Translation:</h4>
        <form role="form" id="entry" onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label>
              <p>*Reminder: Traduce only translates INTO english FROM another language.</p>
              <textarea value={this.state.value} onChange={this.handleChange} class="form-control" rows="3" required />
            </label>
          </div>
          <button type="submit" class="btn btn-success" value="Submit" />
        </form>
        <br /><br />
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
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div>
        <footer class="container-fluid text-center">
          <div><br></br>
            <p>Thanks for using Traduce, A fun tool to play around
          with foreign language translations with friends!</p>
          </div>
        </footer>
      </div>
    );
  }
}

export {Navbar, SiteHeader, InputForm, Table, Footer, App}