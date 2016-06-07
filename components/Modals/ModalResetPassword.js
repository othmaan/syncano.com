import React, { Component } from 'react';
import Formsy from 'formsy-react';
import classNames from 'classnames';
import ModalWrapper from './ModalWrapper';
import ModalTextField from './ModalTextField';
import AuthHOC from '../AuthHOC';

class ModalResetPassword extends Component {
  componentDidUpdate(props, state, context) {
    const isOpen = this.context.modals.resetPassword.isOpen;
    const wasOpen = context.modals.resetPassword.isOpen;

    if (isOpen !== wasOpen && isOpen) {
      this.trackPageView();
    }
  };

  trackPageView() {
    analytics.page('Website', {
      Page: 'Reset Password'
    });
  };

  onClose = () => {
    const { auth } = this.context;

    auth.resetStatus();
  };

  getInputClassName = () => {
    const { status } = this.context.auth;

    return classNames({
      'form__input': true,
      'is-invalid': (status === 400)
    });
  };

  getInputDisableStatus = () => {
    const { auth } = this.context;
    const { status } = auth;

    if (status == 'waiting') {
      return true;
    }

    return false;
  };

  renderErrorMessage = () => (
    <div className="form__message form__error-message">
      <p>Oops! That email was not found.</p>
    </div>
  );

  renderSuccessMessage = () => (
    <div className="modal-box__content_form__success-message">
      <p>Check your inbox. We've sent instructions on how to reset your password.</p>
    </div>
  );

  renderForm = () => {
    const { auth } = this.context;
    const { status } = auth;

    return (
      <div className="modal-box__content_form form">
        <Formsy.Form onValidSubmit={(model) => auth.handlePasswordReset(model)}>
          <ModalTextField
            className={this.getInputClassName()}
            name="email"
            validations="isEmail"
            type="email"
            placeholder="E-mail address"
            disabled={this.getInputDisableStatus()}
            autofocus
            required
          />
          {status === 400 && this.renderErrorMessage()}
          <button className="button button--large button--featured">
            Reset password
          </button>
        </Formsy.Form>
      </div>
    );
  };

  render = () => {
    const { auth, modals } = this.context;
    const { status } = auth;

    return (
      <ModalWrapper
        modalName="resetPassword"
        onClose={this.onClose}
      >
        <div className="modal-box__content">
          <div className="inner">
            <h2>Forgot your password?</h2>
            <p>We’ll email you instructions on how to reset it.</p>

            {status === 'success' ? this.renderSuccessMessage() : this.renderForm()}

            <div className="modal-box__content__login-options">
              <h3 className="modal-box__content__login-options__headline">
                <span>or Log in with</span>
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
                        alt="Log in with Google"
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
                        src={require('./images/github.svg')}
                        alt="Log in with GitHub"
                      />
                      <span>GitHub</span>
                    </span>
                  </li>
                  <li>
                    <span
                      className="button"
                      onClick={() => auth.handleSocialAuth('facebook')}
                    >
                      <img
                        className="facebook"
                        src={require('./images/facebook.svg')}
                        alt="Log in with Facebook"
                      />
                      <span>Facebook</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <footer className="modal-box__footer">
          <div className="modal-box__footer__column">
            <span onClick={modals.signUp.open}>
              Don’t have an account? <strong>Sign up.</strong>
            </span>
          </div>
        </footer>
      </ModalWrapper>
    );
  };
};

ModalResetPassword.contextTypes = {
  auth: React.PropTypes.object,
  modals: React.PropTypes.object
};

export default AuthHOC(ModalResetPassword);
