import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'alarma.App',
  appName: 'Alarma anti robo',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins:{
    SplashScreen:{
      launchShowDuration: 1000
    }
  }
};

export default config;
