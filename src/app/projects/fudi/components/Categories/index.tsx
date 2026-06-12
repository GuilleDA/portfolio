"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { CATEGORIES, type CategoryItem } from "../../lib/categories";
import styles from "./styles.module.scss";

type CategoriesProps = {
  items?: CategoryItem[];
  heading?: string;
};

export function Categories({
  items = CATEGORIES,
  heading = "Categories",
}: CategoriesProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const list = listRef.current;
    if (!list) return;

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: list.scrollLeft,
      hasMoved: false,
    };

    list.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLUListElement>) {
    const list = listRef.current;
    if (!list || !dragState.current.isDragging) return;

    const deltaX = event.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.current.hasMoved = true;
    }

    list.scrollLeft = dragState.current.scrollLeft - deltaX;
  }

  function endDrag(event: PointerEvent<HTMLUListElement>) {
    const list = listRef.current;
    dragState.current.isDragging = false;

    if (list?.hasPointerCapture(event.pointerId)) {
      list.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
  }

  return (
    <nav className={styles.root}>
      <h2 className={styles.heading}>{heading}</h2>
      <ul
        ref={listRef}
        className={`${styles.list} ${isDragging ? styles.dragging : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(event) => {
          if (!dragState.current.hasMoved) return;

          event.preventDefault();
          event.stopPropagation();
          dragState.current.hasMoved = false;
        }}
      >
        {items.map((c) => {
          const Icon = c.icon;

          return (
            <li key={c.label} className={styles.item}>
              <Link
                href={`/projects/fudi/search?category=${encodeURIComponent(c.label)}`}
                className={styles.button}
                draggable={false}
              >
                {Icon ? (
                  <Icon className={styles.icon} aria-hidden />
                ) : (
                  <span className={styles.emoji} aria-hidden>
                    {c.emoji}
                  </span>
                )}
                <span className={styles.label}>{c.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
