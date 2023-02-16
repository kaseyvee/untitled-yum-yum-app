import '../../../styles/Menu.scss';
import MenuItem from '@/components/MenuItem';
import PocketBase from 'pocketbase';
import RestaurantItem from '@/components/RestaurantItem';

const pb = new PocketBase('http://127.0.0.1:8090');

export default async function Menu({ params }: any) {
  const restaurant = await pb.collection('restaurants').getOne(params.restaurantId);
  const username = await pb.collection('users').getOne(restaurant.user_id);
  const menuItems = await pb.collection('menu_items').getList(1, 50, {
    filter: `restaurant_id = "${params.restaurantId}"`,
    sort: '-created',
  });
  
  const menuItemList = menuItems.items.map((menuItem) => {
    return (
      <MenuItem key={menuItem.id} userId={restaurant.user_id} menuItem={menuItem}/>
    )
  });

  return (
    <div className='Menu'>
      <RestaurantItem username={username.username} restaurant={restaurant}/>
      {menuItemList}
    </div>
  )
}