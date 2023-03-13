const redis=require('redis');
const Post=require('../models/postModel')
const AsyncLock = require('async-lock');

const lock = new AsyncLock();

const client = redis.createClient({
  legacyMode: true,
  PORT: 6379
})
client.connect().catch(console.error);

// Middleware to check if the data is present in cache or not
exports.cache=async(req,res,next)=>{
  const { id } = req.params;

  client.get(id, (err,data)=>{
    console.log("in cache");
    if(err) throw err;

    if(data !== null) {
      console.log("from cache...")
      res.json(JSON.parse(data));
    } else {
      next();
    }
  })
}

exports.getPost=async (req, res) => {
  console.log("in controller")
  const { id } = req.params;
  
  // function to call setTimeout 
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
      // Acquiring the lock
      lock.acquire(id, async ()=>{
         // Check if the post is already present in the database
        const existingPost = await Post.findOne({ id: id });
        if (existingPost) {
          await sleep(3000);
          console.log(`Post ${id} found in database, no need for api call`);
          return res.json(existingPost);
        } else {

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
        // Save the post in cache
        client.setEx(id,3600,JSON.stringify(postData));

        // Save the new Post in database
        await post.save();
        console.log(`Post ${id} saved to database`);

        // Send the post from api
        return res.json(postData);
      }
      },function(err) {
        
        if (err){
          console.log(err.message)
        }
      })
    
}