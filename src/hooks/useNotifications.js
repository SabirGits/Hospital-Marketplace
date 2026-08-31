import { useEffect, useState, useCallback } from "react";
import { getNotifications, deleteNotification, clearNotifications } from "../api/api";

const POLL_MS = 15000; // no websocket yet — good enough for a bell icon

export default function useNotifications(recipient) {
  const [items, setItems] = useState([]);

  const refresh = useCallback(() => {
    if (!recipient) { setItems([]); return; }
    getNotifications(recipient).then(setItems).catch(() => {});
  }, [recipient]);

  useEffect(() => {
    refresh();
    if (!recipient) return;
    const interval = setInterval(refresh, POLL_MS);
    return () => clearInterval(interval);
  }, [recipient, refresh]);

  const remove = useCallback(async (id) => {
    await deleteNotification(id);
    refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    if (!recipient) return;
    await clearNotifications(recipient);
    refresh();
  }, [recipient, refresh]);

  return { items, remove, clearAll, refresh };
}
