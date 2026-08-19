import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any> | undefined;
  }
}

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

export function getEchoInstance(): Echo<any> | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.Echo) {
    return window.Echo;
  }

  const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || "cvx6m93foca6jgytrudv";
  const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1";
  const reverbPort = parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080", 10);
  const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || "http";

  window.Echo = new Echo({
    broadcaster: "reverb",
    key: reverbKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbScheme === "https",
    enabledTransports: ["ws", "wss"],
  });

  return window.Echo;
}
