import { pb } from "@/helpers/dbconnect";
import Image from "next/image";
import getUserRestaurants from "@/helpers/getUserRestaurants";

import '../../styles/Profile.scss';

import RestaurantList from "@/components/RestaurantList";
import ShareProfileButton from "@/components/ShareProfileButton";
import ProfileNav from "@/components/ProfileNav";

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'

export default async function Profile({ params }: any) {
  const user = await pb.collection('users').getFirstListItem(`username="${params.username}"`);
  const userRestaurants = await getUserRestaurants(user.id);

  return (
    <div className='Profile'>
      <div className='profile-header'>
        <Image src={user.avatar} alt='avatar' width={120} height={120}/>
        <div className='section-right'>
          <h2>@{user.username}</h2>
          <ShareProfileButton user={user}/>
        </div>
      </div>
      <ProfileNav favourites={true} user={user}/>
      <div className='restaurants-container'>
        <h1>{user.username}&apos;s newest favourites</h1>
        <RestaurantList
          user={user}
          userRestaurants={userRestaurants}
        />
      </div>
    </div>
  )
}