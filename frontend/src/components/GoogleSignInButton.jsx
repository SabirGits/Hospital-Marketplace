import { useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let scriptLoadPromise = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

export default function GoogleSignInButton({ onCredential }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadGoogleScript().then(() => {
      if (cancelled || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        // Hand the raw signed credential up to the caller — it gets sent to
        // the backend for real verification there, never trusted as-is here.
        callback: (response) => onCredential(response.credential),
      });
      if (buttonRef.current) {
        // Google's button needs a fixed pixel width, not a percentage — measure
        // the actual space we have (minus a little breathing room) so it never
        // overflows a narrow phone screen.
        const availableWidth = Math.min(360, buttonRef.current.parentElement?.clientWidth || 360);
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline", size: "large", width: availableWidth, text: "continue_with",
        });
      }
      setReady(true);
    });
    return () => { cancelled = true; };
  }, [onCredential]);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={() => showToast("Google Sign-In needs a Client ID — set VITE_GOOGLE_CLIENT_ID in .env (see README).")}
      >
        Continue with Google
      </button>
    );
  }

  return <div ref={buttonRef} style={{ display: ready ? "flex" : "none", justifyContent: "center" }} />;
}
