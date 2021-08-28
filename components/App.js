import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient();

export default function App() {
  const [postId, setPostId] = useState(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {postId > -1 ? (
          <Post postId={postId} setPostId={setPostId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}
      </div>
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
          <p>Loading...</p>
        ) : postsQuery.status === 'error' ? (
          <div>Error: {postsQuery.error.message}</div>
        ) : (
          <>
            <ul>
              {postsQuery.data.map((post) => (
                <li key={post.id} onClick={() => setPostId(post.id)}>
                  {post.title}
                </li>
              ))}
            </ul>
            <div>{postsQuery.isFetching ? 'Background fetching...' : ''}</div>
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
    <div>
      <button onClick={() => setPostId(-1)}>← Back</button>
      <div>
        {postQuery.status === 'loading' ? (
          <div>Loading...</div>
        ) : postQuery.status === 'error' ? (
          <div>Error: {postQuery.error.message}</div>
        ) : (
          <>
            <h1>{postQuery.data.title}</h1>
            <div>
              <p>{postQuery.data.body}</p>
            </div>
            <div>{postQuery.isFetching ? 'Background fetching...' : ''}</div>
          </>
        )}
      </div>
    </div>
  );
}

// Utilities

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
