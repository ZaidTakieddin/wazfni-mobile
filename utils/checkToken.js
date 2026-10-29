import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
const useCheckToken = () => {
  useEffect(() => {
    SecureStore.getItemAsync('access_token').then((token) => {
      
    });
  }, []);
};

export default useCheckToken;
