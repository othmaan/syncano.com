import React, { Component } from 'react';
import Formsy from 'formsy-react';
import classNames from 'classnames';
import ModalWrapper from './ModalWrapper';
import ModalTextField from './ModalTextField';
import AuthHOC from '../AuthHOC';

class ModalSignUp extends Component {
  componentDidUpdate(props, state, context) {
    const isOpen = this.context.modals.signUp.isOpen;
    const wasOpen = context.modals.signUp.isOpen;

    if (isOpen !== wasOpen && isOpen) {
      this.trackPageView();
    }
  };

  trackPageView() {
    analytics.page('Website', {
      Page: 'Sign Up'
    });
  };

  onClose = () => {
    const { auth } = this.context;

    auth.resetStatus();
  };

  getInputDisableStatus = () => {
    const { auth } = this.context;
    const { status } = auth;

    if (status == 'waiting') {
      return true;
    }

    return false;
  };

  render() {
    const { auth, modals } = this.context;
    const isFormInvalid = auth.status !== 'done' && auth.message;

    const inputClassName = classNames({
      'form__input': true,
      'is-invalid': isFormInvalid
    });

    const renderErrorMessage = (message = 'Oops! That email / password combination is not valid.') => (
      <div className="form__message form__error-message">
        <p>{message}</p>
      </div>
    );

    return (
      <ModalWrapper
        modalName="signUp"
        onClose={this.onClose}
      >
        <div className="modal-box__content">
          <div className="inner">
            <h2>Sign up and start building</h2>
            <p>Build serverless apps on Syncano for free.<br/>Set up your backend in minutes!</p>

            <div className="modal-box__content_form form">
              <Formsy.Form onValidSubmit={(model) => auth.handlePasswordAuth('register', model)}>
                <ModalTextField
                  className={inputClassName}
                  name="email"
                  validations="isEmail"
                  type="email"
                  placeholder="E-mail address"
                  disabled={this.getInputDisableStatus()}
                  autofocus
                  required
                />
                <ModalTextField
                  className={inputClassName}
                  type="password"
                  name="password"
                  placeholder="Password"
                  disabled={this.getInputDisableStatus()}
                  required
                />
                {isFormInvalid && renderErrorMessage(auth.message)}
                <button className="button button--large button--featured">
                  Start Building for Free
                </button>
              </Formsy.Form>
            </div>

            <div className="modal-box__content__login-options">
              <h3 className="modal-box__content__login-options__headline">
                <span>or Sign up with</span>
              </h3>
              <div className="modal-box__content__login-options__buttons">
                <ul>
                  <li>
                  <span
                    className="button"
                    onClick={() => auth.handleSocialAuth('google')}
                  >
                    <img
                      src={require('./images/google.svg')}
                      alt="Sign up with Google"
                    />
                    <span>Google</span>
                  </span>
                  </li>
                  <li>
                  <span
                    className="button"
                    onClick={() => auth.handleSocialAuth('github')}
                  >
                    <img
                      className="github"
                      src={require('./images/github.svg')}
                      alt="Sign up with GitHub"
                    />
                    <span>GitHub</span>
                  </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <footer className="modal-box__footer">
          <div className="modal-box__footer__column">
          <span onClick={modals.logIn.open}>
            Already have an account? <strong>Log in</strong> to your Dashboard.
          </span>
          </div>
        </footer>
      </ModalWrapper>
    );
  };
};

ModalSignUp.contextTypes = {
  auth: React.PropTypes.object,
  modals: React.PropTypes.object
};

export default AuthHOC(ModalSignUp);
