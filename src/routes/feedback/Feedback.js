import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import _ from 'underscore';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import s from './Feedback.css';

const textQuestions = [
  {
    q: 'What is your primary objective for using Trufan?',
    n: 'primary_objective',
  },
  {
    q: 'Please name any other apps that you’d use to solve this problem.',
    n: 'other_apps',
  },
  {
    q: 'What is one thing you would change or add to the platform?',
    n: 'one_thing',
  },
];

const radioQuestions = [
  {
    q: 'How helpful was the platform in helping you achieve this goal?',
    n: 'q1',
    a: [
      'It didn’t help at all.',
      'It helped, but I could have solved my problem without the platform.',
      'I could have solved my problem just as easily with another platform.',
      'It made me more likely to achieve my goal.',
      'I wouldn’t be able to achieve my goal without this platform.',
    ],
  },
  {
    q: 'How easy did you feel the platform was to use and navigate?',
    n: 'q2',
    a: [
      'This platform shouldn’t be used without a demo or walkthrough.',
      'It wasn’t difficult but a walkthrough would be helpful.',
      'It will take me a few uses to fully grasp the platform.',
      'It was fairly easy to understand and use.',
      'It was very easy to understand and use.',
    ],
  },
  {
    q:
      'On a scale of 1-10, how likely are to you recommend this platform to an industry peer?',
    n: 'q3',
    a: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
];

class Feedback extends React.Component {
  static propTypes = {
    // title: PropTypes.string.isRequired,
    id_token: PropTypes.string.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      q1: '',
      q2: '',
      q3: '',
      primary_objective: '',
      other_apps: '',
      one_thing: '',
      button_text: 'Submit',
      sent: false,
    };
  }

  textQuestionFromJSON(question) {
    const changeState = e => {
      e.preventDefault();
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    return (
      <InputLabel htmlFor={question.n} className={s.question_label}>
        {question.q}
        <textarea
          rows="2"
          type="text"
          id={question.n}
          name={question.n}
          onChange={changeState}
          className={s.question_textarea}
        />
      </InputLabel>
    );
  }

  radioQuestionFromJSON(question) {
    const options = question.a.map((a, i) => ({ value: i, label: a }));

    const changeState = e => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };
    const HTMLOptions = options.map(option => (
      <MenuItem value={option.value} key={option.value}>
        {option.label}
      </MenuItem>
    ));

    return (
      <InputLabel htmlFor={question.n}>
        {question.q}
        <Select
          name={question.n}
          className={s.question_select}
          onChange={e => changeState(e)}
          value={this.state[question.n]}
        >
          {HTMLOptions}
        </Select>
      </InputLabel>
    );
  }

  submitFeedback = event => {
    event.preventDefault();

    const request = {
      body: JSON.stringify(this.state),
    };
    if (this.props.id_token)
      request.headers = { Authorization: `Bearer ${this.props.id_token}` };

    this.setState({ button_text: 'Submitting..' });
    return this.props.fetch('/api/feedback', request).then(res =>
      res.json().then(() => {
        this.setState({
          sent: true,
        });
      }),
    );
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div align="center">
            {this.state.sent ? (
              <div>
                <h1>Thanks!</h1>
              </div>
            ) : (
              <form onSubmit={this.submitFeedback}>
                <div>
                  <h1>Feedback</h1>
                </div>
                <div>
                  {this.textQuestionFromJSON(textQuestions[0])}
                  {this.radioQuestionFromJSON(radioQuestions[0])}
                  {this.textQuestionFromJSON(textQuestions[1])}
                  {this.radioQuestionFromJSON(radioQuestions[1])}
                  {this.radioQuestionFromJSON(radioQuestions[2])}
                  {this.textQuestionFromJSON(textQuestions[2])}
                </div>
                <div pad={{ vertical: 'medium' }}>
                  <Button type="submit" color="primary">
                    {this.state.button_text}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Feedback);
