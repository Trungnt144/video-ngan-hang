import { Config } from "@remotion/cli/config";
Config.setBrowserExecutable("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
Config.setVideoImageFormat("jpeg");
// Cảnh 3D (Three.js) cần WebGL chạy bằng card đồ hoạ thật của máy
Config.setChromiumOpenGlRenderer("angle");
