import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const Styles = createGlobalStyle`
    ${normalize};
    * {
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #__next {
        display: flex;
        min-height: 100vh;
    }

    h1 {
        margin: 0 0 1.5rem; 
        padding: 0;
    }

    ul {
        margin: 0;
        padding: 0;
    
        > li {
            list-style-type: none;
        }
    }
`;

export default Styles;
