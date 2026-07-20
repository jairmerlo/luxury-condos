export {};

declare global {
  interface Window {
    __flex_g_settings: {
      registration_key: string;
      agent_info?: {
        google_maps_api_key: string;
      };
    };
  }
}
