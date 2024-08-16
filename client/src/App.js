import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import MyAppBar from './components/MyAppBar';
import { Box, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const GET_POSTS = gql`
  query {
    posts {
      id
      title
    }
  }
`;

const GET_POST = gql`
  query($id: Int!) {
    post(id: $id) {
      id
      title
      body
    }
  }
`;

const Posts = ({ setSelectedPostId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await request(GRAPHQL_ENDPOINT, GET_POSTS);
      setPosts(data.posts);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Divider variant='middle' sx={{borderWidth: '1px', m: "10px 0"}}/>
      <Typography align='center' variant='h5' sx={{color: '#F1F7F6'}}>Posts</Typography>
      <Grid gap={2} container columns={12} alignItems={"center"} justifyContent={"center"} mt={5} >
        {posts.map((post) => (
          <Grid item lg={3} md={1} sx={{cursor: "pointer"}} key={post.id} onClick={() => setSelectedPostId(post.id)} height={"100%"}>
              <Paper elevation={5} height='100%' sx={{p: 3}}>
                {post.title}
              </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const PostDetail = ({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await request(GRAPHQL_ENDPOINT, GET_POST, { id: postId });
      setPost(data.post);
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <Container>
      <Box sx={{width: "100%", boxShadow: "1px 3px 5px 1px #000", bgcolor: "#03624C", color: "#F1F7F6", borderRadius: "20px", mt: "20px", p: "10px 0"}}>
        <Typography variant='h5' align='center'>{post.title}</Typography>
      </Box>
      <Box sx={{width: "100%", bgcolor: "#03624C", boxShadow: "1px 3px 5px 1px #000", color: "#F1F7F6", borderRadius: "20px", mt: "20px", p: "10px", boxSizing: 'border-box', minHeight: "40vh"}}>
        <Typography variant='span'>{post.body}</Typography>
      </Box>
    </Container>
  );
};

const App = () => {
  const [selectedPostId, setSelectedPostId] = useState(null);

  return (
    <>
      <Container maxWidth={"xl"} sx={{bgcolor: '#1ccd82', padding: 0, minHeight: '100vh'}} disableGutters={true}>
        <MyAppBar/>
        <Container>
          <Typography align='center' variant='h4' sx={{mt: 3, color: '#F1F7F6'}}>JsonPlaceholder and GraphQl</Typography>
          {selectedPostId ? (
            <PostDetail postId={selectedPostId} />
          ) : (
            <Posts setSelectedPostId={setSelectedPostId} />
          )}
        </Container>
      </Container>
    </>
  );
};

export default App;
