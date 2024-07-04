export enum BuildMode {
  PRODUCTION = "production",
  DEVELOPMENT = "development"
}

export enum BuildPlatform {
  MOBILE = "mobile",
  DESKTOP = "desktop"
}

export interface BuildPaths {
  entry: string;
  html: string;
  output: string;
  src: string;
  public: string;
}

export interface BuildOptions {
  port: number;
  paths: BuildPaths;
  mode: BuildMode;
  analyzer?: boolean;
  platform: BuildPlatform;
}