"use client";

import {
  useMemo,
  type CSSProperties,
  type FC,
} from "react";

import styles from "@/styles/AnimatedNav.module.css";

type NavItem = {
  id: string;
  label: string;
  accent?: boolean;
  highlight?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "HOME", highlight: true },
  { id: "option1", label: "TIKTOK" },
  { id: "option2", label: "LINKEDIN", accent: true },
  { id: "option3", label: "SETTINGS" },
];

type AnimatedWordProps = {
  text: string;
  accent?: boolean;
  highlight?: boolean;
};

const AnimatedWord: FC<AnimatedWordProps> = ({ text, accent, highlight }) => {
  const characters = useMemo(() => Array.from(text), [text]);

  return (
    <span className={styles.word}>
      <span className={styles.wordSr}>{text}</span>
      <span className={styles.letters} aria-hidden="true">
        {characters.map((character, index) => {
          const letter = character === " " ? "\u00A0" : character;
          return (
            <span
              key={`letter-${index}`}
              className={styles.letterClip}
              style={{ "--char-delay": `${index * 0.05}s` } as CSSProperties}
            >
              <span className={styles.letterWrapper}>
                <span className={styles.letter}>
                  {letter}
                </span>
                <span className={`${styles.letter} ${styles.highlight}`}>
                  {letter}
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
};

const AnimatedNav: FC = () => {
  return (
    <div className={styles.screen}>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${
                  item.highlight ? styles.navItemHighlight : ""
                } ${item.accent ? styles.navItemAccent : ""}`.trim()}
                data-label={item.label}
              >
                <AnimatedWord
                  text={item.label}
                  accent={item.accent}
                  highlight={item.highlight}
                />
              </button>
            );
          })}
        </nav>
        <div className={styles.brandmark}>
          <span className={styles.laurel}>⚭</span>
          <span className={styles.brandText}>Hover animation menu</span>
          <span className={styles.laurel}>⚭</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedNav;

