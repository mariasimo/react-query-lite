import Styles from '../styles/globalStyles';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Styles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
