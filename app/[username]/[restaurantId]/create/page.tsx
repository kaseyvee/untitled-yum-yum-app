'use client';

import { useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { pb } from "@/helpers/dbconnect";
import { storage } from "@/helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"; 

import '../../../../styles/NewForm.scss';

import FormTitle from "@/components/FormTitle"
import AddButton from "@/components/AddButton"
import Image from "next/image"

export default function Create({ params }: any) {
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [rating, setRating] = useState<any>('');
  const [error, setError] = useState('');

  const name = useRef<HTMLInputElement>(null);
  const notes = useRef<HTMLTextAreaElement>(null);
  const imageLink = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const loggedInUser: any = pb.authStore.model;

  function handleSelectRating(e: any) {
    setRating(e.target.value);
  }

  async function handleImageUpload() {
    if (!imageUpload) return;
    const imageRef = ref(storage, `restaurants/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const imageUrl = getDownloadURL(snapshot.ref);
    return imageUrl;
  }

  async function handleCreateItemRequest(image = '') {
    const data = {
      "name": name.current && name.current.value,
      rating,
      "notes": (notes.current && notes.current.value) || '',
      image,
      "restaurant_id": params.restaurantId,
    };

    await pb.collection('menu_items').create(data);
  }

  async function handleCreateItem(e: any) {
    e.preventDefault();
    setError('');

    if ((name.current && !name.current.value) || !rating) {
      return setError("Please enter the name and rating.");
    }

    if (imageUpload) {
      const imageUrl: any = await handleImageUpload();
      await handleCreateItemRequest(imageUrl);

      return router.push(`/${loggedInUser.username}/${params.restaurantId}`);
    }

    if (imageLink.current && imageLink.current.value) {
      await handleCreateItemRequest(imageLink.current.value);

      return router.push(`/${loggedInUser.username}/${params.restaurantId}`);
    }

    await handleCreateItemRequest();

    return router.push(`/${loggedInUser.username}/${params.restaurantId}`);
  }

  return (
    <div className="NewForm">
      <FormTitle text='New Item' redirect='/new'/>
      <form onSubmit={e => handleCreateItem(e)}>
        <input ref={name} type='text' id='name' placeholder='Name'/>
        <select id="stars" defaultValue='' onChange={handleSelectRating}>
          <option value='' disabled>Rating</option>
          <option value={1}>1 star</option>
          <option value={2}>2 stars</option>
          <option value={3}>3 stars</option>
        </select>
        <textarea ref={notes} id='notes' placeholder='Notes'/>
        <input ref={imageLink} type='text' id='image-url' placeholder='Image URL'/>
        <p>or</p>
        <label htmlFor="upload">
          <input type='file' id='upload' onChange={e => {setImageUpload(e.target.files && e.target.files[0])}}/>
          <Image src='/upload.png' alt="upload" width={24} height={24}/> {imageUpload ? "Oooh! Pretty!" : "Upload"}
        </label>
        
        <AddButton text="Add New Item"/>
        {error && <h4 className="error">{error}</h4>}
      </form>
    </div>
  )
}