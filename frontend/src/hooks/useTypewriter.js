import { useState, useEffect } from "react";

export default function useTypewriter({
  words = ["Practice Smarter.", "Interview Stronger.", "Build Career Confidence.", "Get Interview Ready."],
  typingSpeed = 95,
  deletingSpeed = 50,
  pauseDelay = 1800,
} = {}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrentText(words[0]);
      return;
    }

    const currentWord = words[wordIndex % words.length];

    let timer;
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.substring(0, prev.length - 1));
        if (currentText.length <= 1) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      if (currentText === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDelay]);

  return currentText;
}
