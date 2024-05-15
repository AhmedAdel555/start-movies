import React, { useState, ChangeEvent, FormEvent } from 'react';
import { firestore, setDoc, doc, collection, serverTimestamp } from "../firebase";
import { storage, ref, uploadBytesResumable, getDownloadURL } from "../firebase";

const AddFilmForm = () => {
  const [filmData, setFilmData] = useState({
    id:'',
    description: '',
    name: '',
    lowerCaseName: '',
    categories: [] as string[],
    image: '',
    video: '',
    publisherId: '',
    publisherName: '',
    likes: [],
    likesNumber:0,
    dislikes: [],
    dislikesNumber:0,
    savedToWatchLater: [],
    savedToWatchLaterNumber:0,
    viewers: [],
    viewersNumber:0,
    ratings: [],
    ratingNumber: 0,
    publishDate: null 
  });

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'categories') {
      setFilmData({ ...filmData, categories: value.split(',').map((category: string) => category.trim()) });
    } else if(name === 'name') {
      setFilmData({ ...filmData, [name]: value, lowerCaseName: value.toLowerCase() });
    } else {
      setFilmData({ ...filmData, [name]: value });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      let imageUrl = filmData.image;
      let videoUrl = filmData.video;
  
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        await uploadTask;
  
        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }
  
      if (video) {
        const storageRef = ref(storage, `videos/${video.name}`);
        const uploadTask = uploadBytesResumable(storageRef, video);
        
        await uploadTask;
  
        videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }
  
      const filmsCollectionRef = collection(firestore, "films");
      const filmDocRef = doc(filmsCollectionRef); 
      await setDoc(filmDocRef, { 
        ...filmData, 
        id: filmDocRef.id, 
        image: imageUrl, 
        video: videoUrl,
        publishDate: serverTimestamp() // Modify this line
      }); 
      alert('Film added successfully!');
      setFilmData({
        id:'',
        description: '',
        name: '',
        lowerCaseName: '',
        categories: [],
        image: '',
        video: '',
        publisherId: '',
        publisherName: '',
        likes: [],
    likesNumber:0,
    dislikes: [],
    dislikesNumber:0,
    savedToWatchLater: [],
    savedToWatchLaterNumber:0,
    viewers: [],
    viewersNumber:0,
        ratings: [],
        ratingNumber: 0,
        publishDate: null // Modify this line
      });
      setImage(null);
      setVideo(null);
      const videoInput = document.getElementById('video') as HTMLInputElement;
    if (videoInput) videoInput.value = ''; 

    const imageInput = document.getElementById('image') as HTMLInputElement;
    if (imageInput) imageInput.value = ''; 
    } catch (error) {
      console.error('Error adding film: ', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ color: 'white' }}>
      <div>
        <label htmlFor="description">Film Description:</label>
        <input
          type="text"
          name="description"
          id="description"
          value={filmData.description}
          onChange={handleChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <div>
        <label htmlFor="name">Film Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          value={filmData.name}
          onChange={handleChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <div>
        <label htmlFor="categories">Categories (comma separated):</label>
        <input
          type="text"
          name="categories"
          id="categories"
          value={filmData.categories.join(', ')}
          onChange={handleChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <div>
        <label htmlFor="video">Video:</label>
        <input
          type="file"
          name="video"
          id="video"
          accept="video/*"
          onChange={handleVideoChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <div>
        <label htmlFor="publisherId">Publisher ID:</label>
        <input
          type="text"
          name="publisherId"
          id="publisherId"
          value={filmData.publisherId}
          onChange={handleChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <div>
        <label htmlFor="publisherName">Publisher Name:</label>
        <input
          type="text"
          name="publisherName"
          id="publisherName"
          value={filmData.publisherName}
          onChange={handleChange}
          style={{ backgroundColor: 'black', color: 'white' }}
        />
      </div>
      <button type="submit">Add Film</button>
    </form>
  );
};

export default AddFilmForm;
