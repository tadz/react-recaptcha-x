import * as React from 'react';

declare global {
  // tslint:disable-next-line:interface-name (@see https://github.com/Microsoft/TypeScript/issues/19816)
  interface Window {
    GoogleReCaptcha_onload: Function;
  }
}

type Props = {
  siteKeyV3: string;
};

/**
 * a Provider which must be used once per application,
 * to include the Google reCAPTCHA JS API
 */
class ReCaptchaProvider extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onLoadHandler = this.onLoadHandler.bind(this);
    window.GoogleReCaptcha_onload = this.onLoadHandler;
  }

  public componentDidMount(): void {
    const { siteKeyV3 } = this.props;
    // avoid loading again if previously loaded...
    // tslint:disable-next-line:no-typeof-undefined (@see https://github.com/Microsoft/tslint-microsoft-contrib/issues/415)
    if (typeof grecaptcha === 'undefined') {
      // load the Google reCAPTCHA JS API script tag.
      // We cannot dynamically import because
      // there are no CORS headers and the FETCH will fail if we try...
      const script: HTMLScriptElement = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKeyV3}&onload=GoogleReCaptcha_onload`;
      document.body.appendChild(script);
    }
  }

  public render(): React.ReactNode {
    return <div>ReCaptchaProvider</div>;
  }

  /**
   * invoked when Google reCAPTCHA is loaded
   * @see componentDidMount
   */
  private onLoadHandler(): void {
    delete window.GoogleReCaptcha_onload;
    this.setState({ loaded: true });
    grecaptcha.ready(() => {
      this.setState({ ready: true });
    });
  }
}

export { ReCaptchaProvider };