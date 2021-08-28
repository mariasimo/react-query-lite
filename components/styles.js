import styled from 'styled-components';

export const Container = styled.main`
  margin: 1rem auto;
  padding: 2rem;
  width: 100%;
  max-width: 48rem;
`;

export const PostItem = styled.li`
  text-transform: capitalize;
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all ease 300ms;
  color: #353535;
  border-bottom: 0.0625rem solid #ddd;
  padding-bottom: 1rem;

  &:hover {
    border-radius: 0.5rem;
    color: white;
    background-color: #0383ff;
  }
`;

export const PostsList = styled.ul`
  margin-bottom: 2rem;
`;

export const Loading = styled.h2`
  color: tomato;
  font-weight: 500;
  font-size: 1.2rem;
`;

export const Fetching = styled.h2`
  color: mediumseagreen;
  font-weight: 500;
  font-size: 1.2rem;
`;

export const Error = styled.h2`
  color: tomato;
  font-weight: 500;
  font-size: 1.2rem;
`;

export const PostTitle = styled.h1`
  font-size: 1.75rem;
  text-transform: capitalize;
`;

export const PostBody = styled.div``;

export const Button = styled.button`
  background-color: #0383ff;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all ease 300ms;

  &:hover {
    background-color: #0976e0;
  }
`;

export const PostContainer = styled.article`
  margin-bottom: 2rem;

  ${Button} {
    margin-bottom: 1.5rem;
  }
`;
