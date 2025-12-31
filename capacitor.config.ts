import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-app',
  webDir: 'dist',
  server: {
    // REPLACE WITH YOUR PC's IP ADDRESS (Method A above)
    url: 'http://localhost:3000', 
    cleartext: true
  }
};

export default config;