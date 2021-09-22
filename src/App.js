import './App.css';
import Post from './Post';
import React, {useState,useEffect} from 'react';
import {auth, db,filestore} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes=useStyles([]);
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [email,setEmail]=useState('');
  const [user,setUser]=useState(null);
  useEffect(()=>
  {
  const unsubscribe =  auth.onAuthStateChanged((authUser)=>
   {
     if(authUser)
     {
         console.log(authUser);
         setUser(authUser);
     }
     else{
       setUser(null);
     }
   });
   
   return () =>
   {
     unsubscribe();
   }
  },[user,username]);
  useEffect(()=>{
    db.collection('posts').orderBy('timeStamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      })));
    })
  },[])
  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return authUser.updateProfile({
        displayName:username
      })
    })

    .catch((error)=>alert(error.message))
    setOpen(false);
  };
  const signup = (event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>
    {
      console.log("setting user",username)
      console.log(authUser);
      return authUser.user.updateProfile({displayName:username})
    })
    .catch((error)=>{alert(error.message)});
    setOpen(false);
    setEmail('');
    setPassword('');
    setUsername('');
  };
  const signIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpenSignIn(false);
    setEmail('');
    setPassword('');
  };
  return (
    
    <div className="App">
      
      

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
    <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
      <center>
        <img 
        className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
        </center>
        
        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}/>
        <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}/>
        <Button type="submit" onClick={signIn}>sign in</Button>
        </form>
    </div>
      </Modal>
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
    <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
      <center>
        <img 
        className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
        </center>
        <Input
        placeholder="username"
        type="text"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}/>
        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}/>
        <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}/>
        <Button type="submit" onClick={signUp}>signup</Button>
        </form>
    </div>
      </Modal>
      <div className="app__header">
        <img 
        className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""/>
       {user ? (
        <Button onClick={()=>auth.signOut()}>Logout</Button>
      ):(
        <div className="app__loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>sign In</Button>
        <Button onClick={()=>setOpen(true)}>sign UP</Button>
        </div>
      )
      }
      </div>
      
      
      <div className="app_posts">
      {posts.map(({id,post})=>(
        <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))}
      </div>
      

      {user?.displayName ? 
      (<ImageUpload username = {user.displayName} />) 
       :
      (
        <center><h3> Sorry you need to Login to Upload</h3></center>
      )
       }
      
    </div>
  );
}

export default App;
