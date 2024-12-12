import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PublicLayout = ({ children }) => {
  return (
    <Main>
      <header>
        <Link to="/">
          <h1>Listagem de Filmes</h1>
        </Link>
      </header>
      <section>
        {children}
      </section>
    </Main>
  );
}

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicLayout;

const Main = styled.main`
  > header {
    background-color: var(--background-600);
    padding: 48px;
  }

  > section {
    padding: 48px;
    width: 100%;
    height: 100%;
  }
`;
