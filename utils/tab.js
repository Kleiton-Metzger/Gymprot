export const getTabIconName = (route, focused) => {
  if (route.name === 'Profile') {
   return focused ? 'person' : 'person-outline';
  }else if (route.name === 'Home') {
   return focused ? 'home' : 'home-outline';
  } else if (route.name === 'Camera') {
   return focused ? 'camera' : 'camera-outline';
  } else if (route.name === 'Upload') {
   return focused ? 'cloud-upload' : 'cloud-upload-outline';
  } else if (route.name === 'MyVideos') {
   return focused ? 'film' : 'film-outline';
  } 
}