import {Config} from '@remotion/cli/config';

// Bulut makinesindeki hazır Chromium (indirme gerektirmez)
Config.setBrowserExecutable(
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
);
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setCrf(23);
Config.setConcurrency(4);
