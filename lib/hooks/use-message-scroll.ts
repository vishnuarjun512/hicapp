"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type UseMessageScrollOptions<T extends { id: string }> = {
  conversationId: string;
  messages: T[];
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

  const previousConversationIdRef = useRef<string | null>(null);
  const previousMessageCountRef = useRef(0);
  const initializedRef = useRef(false);
  const loadingOlderRef = useRef(false);

  // Remembers the top-most visible element before prepending
  const topElementRef = useRef<{ id: string; topOffset: number } | null>(null);

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

    // 2. Prepend Lock: Anchor to previous top element
    if (topElementRef.current) {
      const { id, topOffset } = topElementRef.current;
      const targetElement = container.querySelector(
        `[data-message-id="${id}"]`,
      );

      if (targetElement instanceof HTMLElement) {
        // Calculate exact relative scroll position to anchor node
        const newElementTop = targetElement.offsetTop;
        container.scrollTop = newElementTop - topOffset;
      }

      topElementRef.current = null;
      previousMessageCountRef.current = messages.length;
      return;
    }

    // 3. New Incoming Message at Bottom
    if (messages.length > previousMessageCountRef.current) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
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

    // Capture the current top-most message item DOM node
    const firstMessageNode = container.querySelector("[data-message-id]");
    if (firstMessageNode instanceof HTMLElement) {
      const messageId = firstMessageNode.getAttribute("data-message-id");
      if (messageId) {
        topElementRef.current = {
          id: messageId,
          topOffset: firstMessageNode.offsetTop - container.scrollTop,
        };
      }
    }

    try {
      await loadOlderMessages();
    } catch (error) {
      topElementRef.current = null;
      console.error("Failed to load older messages:", error);
    } finally {
      // Delay releasing scroll lock trigger by 50ms to allow React paint batching
      setTimeout(() => {
        loadingOlderRef.current = false;
      }, 50);
    }
  }, [hasMore, loadOlderMessages]);

  /*
   * ----------------------------------------------------------
   * SCROLL LISTENER
   * ----------------------------------------------------------
   */
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !initializedRef.current || loadingOlderRef.current) {
      return;
    }

    if (container.scrollTop <= 60) {
      void loadOlder();
    }
  }, [loadOlder]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { containerRef };
}
