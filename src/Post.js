import React ,{useState,useEffect}  from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase';
import firebase from 'firebase';
function Post({postId,user,imageUrl,caption,username}) {
    const [comments,setComments]=useState([]);
    const [comment, setComment] = useState('');
    const postComment =( (e)=> {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timeStamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    });
    useEffect(()=> {
        let unsubscribe;
        if(postId)
        {
          unsubscribe = db.collection("posts")
          .doc(postId)
          .collection("comments")
          .orderBy("timeStamp","desc")
          .onSnapshot((snapshot)=> {
            setComments(snapshot.docs.map((doc)=> doc.data()))
          });
        }
        return () =>
        {
          unsubscribe();
        }
     
       },[postId]);

    return (
        <div className="post">
            <div className="post__header">
            <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
            <h3>{username}</h3> 
           </div>
           <img className="post__image" src={imageUrl} alt=""/>
           <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
           <div className="post__comments">
            {comments.map((cmt)=>(
                <p>
                    <strong>{cmt.username}</strong> {cmt.text}
                </p>
            ))}
        </div>
        
        {user && (
            <form className="post__commentBox">
            <input
            className="post__input"
            type="text"
            placeholder="Add a Comment"
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            >
            </input>
            <button 
               className="post__button"
               disabled={!comment}
               type="submit"
               onClick={postComment}
               >Post</button>
        </form>
        )}
        
        </div>
    )
}
export default Post