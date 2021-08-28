import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import {
  Container,
  PostsList,
  PostItem,
  Fetching,
  Loading,
  Error,
  PostTitle,
  PostBody,
  Button,
  PostContainer,
} from './styles';

const queryClient = new QueryClient();

export default function App() {
  const [postId, setPostId] = useState(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        {postId > -1 ? (
          <Post postId={postId} setPostId={setPostId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}
      </Container>
    </QueryClientProvider>
  );
}

// Our custom query hooks

function usePosts() {
  return useQuery({
    queryKey: 'posts',
    queryFn: async () => {
      await sleep(1000);
      const data = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      ).then((result) => result.json());

      return data.slice(0, 5);
    },
    // staleTime: 3000,
    // cacheTime: 5000
  });
}

function usePost(postId) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      await sleep(1000);
      const data = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      ).then((result) => result.json());

      return data;
    },
    // staleTime: 3000,
    // cacheTime: 5000
  });
}

function Posts({ setPostId }) {
  const postsQuery = usePosts();

  console.log(postsQuery);

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {postsQuery.status === 'loading' ? (
          <Loading>Loading...</Loading>
        ) : postsQuery.status === 'error' ? (
          <Error>Error: {postsQuery.error.message}</Error>
        ) : (
          <>
            <PostsList>
              {postsQuery.data.map((post) => (
                <PostItem key={post.id} onClick={() => setPostId(post.id)}>
                  {post.title}
                </PostItem>
              ))}
            </PostsList>
            <Fetching>
              {postsQuery.isFetching ? 'Background fetching...' : ''}
            </Fetching>
          </>
        )}
      </div>
    </div>
  );
}

function Post({ postId, setPostId }) {
  const postQuery = usePost(postId);

  console.log(postQuery);

  return (
    <PostContainer>
      <Button onClick={() => setPostId(-1)}>← Back</Button>
      <div>
        {postQuery.status === 'loading' ? (
          <Loading>Loading...</Loading>
        ) : postQuery.status === 'error' ? (
          <Error>Error: {postQuery.error.message}</Error>
        ) : (
          <>
            <PostTitle>{postQuery.data.title}</PostTitle>
            <PostBody>
              <p>{postQuery.data.body}</p>
            </PostBody>
            <Fetching>
              {postQuery.isFetching ? 'Background fetching...' : ''}
            </Fetching>
          </>
        )}
      </div>
    </PostContainer>
  );
}

// Utilities

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
