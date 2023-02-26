const Post=require('../models/postModel')

exports.getPost=async (req, res) => {
  const { id } = req.params;
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function test() {
    // Check if post is already present in the database
    const existingPost = await Post.findOne({ id: id });
    if (existingPost) {
      console.log(`Post ${id} found in database, no need for api call`);
      return res.json(existingPost);
    }
    await sleep(3000);
  }
  
  test();
  
    // If not present, get it from the api
    console.log(`Getting post ${id} from the given api`);
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const postData = await response.json();
  
    const post = new Post({
      id: postData.id,
      userId: postData.userId,
      title: postData.title,
      body: postData.body,
    });
  
    // Save the new Post in database
    await post.save();
    console.log(`Post ${id} saved to database`);
  
    // Send the post from api
    res.json(postData);
  }