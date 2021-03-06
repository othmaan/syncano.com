import React, { Component, PropTypes } from 'react';
import Formsy from 'formsy-react';
import axios from 'axios';
import classNames from 'classnames';
import FormInputElement from '../FormInputElement';

export default class ContactForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: '',
      displayValidationErrors: false
    };
  };

  static childContextTypes = {
    displayValidationErrors: PropTypes.bool
  };

  getChildContext = () => {
    return {
      displayValidationErrors: this.state.displayValidationErrors
    };
  };

  onSubmit = (model) => {
    const { sendToEmail } = this.props;
    const email = sendToEmail || APP_CONFIG.contactFormEmail;
    const action = `https://formspree.io/${email}`;

    this.hideValidationErrors();
    this.setState({ status: 'processing' });

    axios.post(action, model)
      .then(this.onSubmitSuccess)
      .catch(this.showError);
  };

  onSubmitSuccess = ({ status }) => {
    status === 200 ? this.showThankYou() : this.showError();
  };

  showError = () => {
    this.setState({ status: 'error' });
  };

  showThankYou = () => {
    this.setState({ status: 'done' });
  };

  getErrorMessage = () => (
    <div>
      <p><strong>There was an error sending your message.</strong></p>
      <p>Sorry about that. Please write us at <a href="mailto:hello@syncano.io">hello@syncano.io</a>.</p>
    </div>
  );

  getThankYouMessage = () => {
    const { thankYouMessage } = this.props;

    if (thankYouMessage) {
      return thankYouMessage;
    }

    return (
      <div>
        <h2>Thank you!</h2>
        <p><strong>Your message has been received.</strong></p>
        <p>{`We'll get back to you soon. In the meantime, check out some of our `}
        <a href="https://www.syncano.io/blog/" target="_blank">recent blog articles</a>.</p>
      </div>
    );
  };

  renderStatus = (status) => (
    <div className="contact-form__box__message">
      {status === 'done' ? this.getThankYouMessage() : this.getErrorMessage()}
    </div>
  );

  getButtonClassName = () => {
    const { buttonIsFeatured } = this.props;

    return classNames({
      'button button--large': true,
      'button--filled': !buttonIsFeatured,
      'button--featured': buttonIsFeatured
    });
  };

  showValidationErrors = () => {
    this.setState({ displayValidationErrors: true })
  };

  hideValidationErrors = () => {
    this.setState({ displayValidationErrors: false })
  };

  renderForm = () => {
    const { status } = this.state;
    const { title, subject, children, buttonLabel } = this.props;

    return (
      <div>
        {title && <h2>{title}</h2>}
        <div className="form">
          <Formsy.Form
            onValidSubmit={this.onSubmit}
            onInvalidSubmit={this.showValidationErrors}
          >
            <FormInputElement
              type="hidden"
              name="_subject"
              value={subject}
            />
            <FormInputElement
              name="_gotcha"
              style={{ display: 'none' }}
            />
            {children}
            <button
              className={this.getButtonClassName()}
              disabled={status === 'processing'}
            >
              {buttonLabel || 'Send'}
            </button>
          </Formsy.Form>
        </div>
      </div>
    );
  };

  render = () => {
    const { status } = this.state;

    return (
      <div className="contact-form">
        {status && status != 'processing' ? this.renderStatus(status) : this.renderForm()}
      </div>
    );
  };
};
