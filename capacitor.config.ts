import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-app',
  webDir: 'dist',
  server: {
    // REPLACE WITH YOUR PC's IP ADDRESS (Method A above)
    url: 'http://192.168.1.15:3000', 
    cleartext: true
  }
};

export default config;