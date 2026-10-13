import { useMemo, useSyncExternalStore } from "react";
import {
  getNotifications,
  type NotificationItem,
} from "../data/notifications";

const STORAGE_KEY = "aud.notifications.read";

/**
 * Module-level read-state store shared by the header badge and the page, so
 * marking an item read updates both instantly. `useSyncExternalStore` keeps
 * React in sync without a context.
 */
function load(): ReadonlySet<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

let readIds: ReadonlySet<string> = load();
let snapshot = readIds;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ReadonlySet<string> {
  return snapshot;
}

function commit(next: ReadonlySet<string>) {
  readIds = next;
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    /* storage unavailable */
  }
  for (const listener of listeners) listener();
}

function markRead(id: string) {
  if (readIds.has(id)) return;
  commit(new Set(readIds).add(id));
}

function markAllRead(ids: readonly string[]) {
  const next = new Set(readIds);
  for (const id of ids) next.add(id);
  commit(next);
}

export interface ReadNotification extends NotificationItem {
  read: boolean;
}

export interface UseNotificationsResult {
  items: ReadNotification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export function useNotifications(now = Date.now()): UseNotificationsResult {
  const read = useSyncExternalStore(subscribe, getSnapshot);

  const items = useMemo(
    () =>
      getNotifications(now).map((item) => ({
        ...item,
        read: read.has(item.id),
      })),
    [now, read],
  );

  const unread = items.reduce((count, item) => count + (item.read ? 0 : 1), 0);

  return {
    items,
    unread,
    markRead,
    markAllRead: () => markAllRead(items.map((i) => i.id)),
  };
}
