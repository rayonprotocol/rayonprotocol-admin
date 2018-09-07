interface Window {
  Intl: typeof Intl;
}

declare module '*.css' {
  const classes: { [index: string]: string };
  export default classes;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare const BUILD_ENV: 'development' | 'production';
declare const EMAIL_SUB_API_ROOT: string;
declare const URL_APIBASE: string;
declare const ENV_BLOCKCHAIN: string;
declare const INFURA_API_KEY: string;
