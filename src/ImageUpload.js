import React,{useState} from 'react';
import {Button} from "@material-ui/core";
import {db,storage} from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
export default function ImageUpload({username}) {
    const [caption,setCaption]=useState('');
    const [progress,setProgress]=useState(0);
    const [image,setImage]=useState(null);
/*comments*/
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
       uploadTask.on(
           "state_changed",
           (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) *100
        );
        setProgress(progress);
           },
           (error)=>
           {
             console.log(error);
             alert(error.message);  
           },
           ()=>{
           storage.ref("images")
           .child(image.name)
           .getDownloadURL()
           .then(url => 
               {
                   db.collection("posts").add({
                       timeStamp : firebase.firestore.FieldValue.serverTimestamp(),
                       caption : caption,
                       imageUrl : url,
                       username : username
                   });
                   setProgress(0);
                   setCaption("");
                   setImage(null);
               });
           }
           );
       };

    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"/>
           <input type="text" placeholder="Enter Comment" onChange={event=>setCaption(event.target.value)} value={caption}/>
           <input type="file" onChange={handleChange}/>
           <Button onClick={handleUpload}>
               upload
                </Button> 
        </div>
    )
}
