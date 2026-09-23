"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type UseMessageScrollOptions<T extends { id: string }> = {
  conversationId: string;
  messages: T[]; // chronological ascending (oldest -> newest)
  hasMore: boolean;
  loadOlderMessages: () => Promise<void>;
};

export function useMessageScroll<T extends { id: string }>({
  conversationId,
  messages,
  hasMore,
  loadOlderMessages,
}: UseMessageScrollOptions<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const previousConversationIdRef = useRef<string | null>(null);
  const previousMessageCountRef = useRef(0);
  const initializedRef = useRef(false);
  const loadingOlderRef = useRef(false);

  const topElementRef = useRef<{ id: string; topOffset: number } | null>(null);

  /**
   * Finds the message node closest to the container's visible top edge.
   * DOM order here is newest -> oldest (because displayMessages is reversed
   * for the flex-col-reverse layout), which visually is bottom -> top.
   * So we walk backwards from the end of the list (the oldest / visually
   * topmost nodes) until we find one that's at or below the current
   * scroll offset.
   */
  const findTopAnchor = useCallback(() => {
    const container = containerRef.current;
    if (!container) return null;

    const nodes = container.querySelectorAll<HTMLElement>("[data-message-id]");
    if (!nodes.length) return null;

    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (node.offsetTop >= container.scrollTop - 4) {
        return node;
      }
    }

    return nodes[0];
  }, []);

  /*
   * ----------------------------------------------------------
   * SCROLL PRESERVATION VIA ELEMENT ANCHORING
   * ----------------------------------------------------------
   */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !messages.length) return;

    const conversationChanged =
      previousConversationIdRef.current !== conversationId;

    // 1. Initial Load / Switch Conversation
    if (conversationChanged) {
      container.scrollTop = container.scrollHeight;
      previousConversationIdRef.current = conversationId;
      previousMessageCountRef.current = messages.length;
      initializedRef.current = true;
      topElementRef.current = null;
      return;
    }

    // 2. Prepend Lock: Anchor to previously captured element
    if (topElementRef.current) {
      const { id, topOffset } = topElementRef.current;
      const targetElement = container.querySelector<HTMLElement>(
        `[data-message-id="${id}"]`,
      );

      if (targetElement) {
        container.scrollTop = targetElement.offsetTop - topOffset;
      }

      topElementRef.current = null;
      previousMessageCountRef.current = messages.length;
      return;
    }

    // 3. New Incoming Message at Bottom
    if (messages.length > previousMessageCountRef.current) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      120;

      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }

    previousMessageCountRef.current = messages.length;
  }, [conversationId, messages]);

  /*
   * ----------------------------------------------------------
   * LOAD OLDER MESSAGES
   * ----------------------------------------------------------
   */
  const loadOlder = useCallback(async () => {
    const container = containerRef.current;

    if (
      !container ||
      !initializedRef.current ||
      loadingOlderRef.current ||
      !hasMore
    ) {
      return;
    }

    loadingOlderRef.current = true;

    const anchorNode = findTopAnchor();
    if (anchorNode) {
      const messageId = anchorNode.getAttribute("data-message-id");
      if (messageId) {
        topElementRef.current = {
          id: messageId,
          topOffset: anchorNode.offsetTop - container.scrollTop,
        };
      }
    }

    try {
      await loadOlderMessages();
    } catch (error) {
      topElementRef.current = null;
      console.error("Failed to load older messages:", error);
    } finally {
      loadingOlderRef.current = false;
    }
  }, [hasMore, loadOlderMessages, findTopAnchor]);

  /*
   * ----------------------------------------------------------
   * TOP-OF-LIST DETECTION (IntersectionObserver)
   * ----------------------------------------------------------
   * A plain `scrollTop <= N` check is unreliable in flex-direction:
   * column-reverse containers — Chrome reports negative scrollTop once
   * you scroll away from the rest position, Firefox doesn't. Watching a
   * sentinel node sidesteps that entirely.
   */
  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadOlder();
        }
      },
      { root: container, rootMargin: "80px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadOlder]);

  return { containerRef, sentinelRef };
}
