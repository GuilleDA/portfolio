'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './ColorPicker.module.scss';
import PaletteIcon from '../../assets/icons/palette.svg';

interface ColorPickerProps {
  onColorSelect?: (color: string) => void;
  initialColor?: string;
  className?: string;
  isThin?: boolean;
}

export default function ColorPicker({
  onColorSelect,
  initialColor = '#FF0000',
  className = '',
  isThin = false
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hexInput, setHexInput] = useState(initialColor);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [hue, setHue] = useState(0); // Matiz seleccionado en la barra arcoíris
  const [huePosition, setHuePosition] = useState(0); // Posición del indicador en la barra (0-100%)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const rainbowRef = useRef<HTMLDivElement>(null);
  const [isDraggingGradient, setIsDraggingGradient] = useState(false);
  const [isDraggingRainbow, setIsDraggingRainbow] = useState(false);

  const isUserInteractingRef = useRef(false);

  const positionRef = useRef(position);
  const hueRef = useRef(hue);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const onColorSelectRef = useRef(onColorSelect);

  useEffect(() => {
    onColorSelectRef.current = onColorSelect;
  }, [onColorSelect]);

  const updateGradientPosition = useCallback((clientX: number, clientY: number) => {
    if (!gradientRef.current) return;

    isUserInteractingRef.current = true;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });

    const saturation = Math.max(0, Math.min(100, x)) / 100;
    const value = 1 - (Math.max(0, Math.min(100, y)) / 100);

    const color = hsvToRgb(hueRef.current, saturation, value);
    setSelectedColor(color);
    setHexInput(color);
    onColorSelectRef.current?.(color);
  }, []);

  const handleGradientMouseDown = (e: React.MouseEvent) => {
    setIsDraggingGradient(true);
    updateGradientPosition(e.clientX, e.clientY);
  };

  const updateRainbowPosition = useCallback((clientX: number) => {
    if (!rainbowRef.current) return;

    isUserInteractingRef.current = true;
    const rect = rainbowRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;

    let newHue = (Math.max(0, Math.min(100, x)) / 100) * 360;
    if (newHue >= 360) newHue = 359.99;

    setHue(newHue);
    setHuePosition(Math.max(0, Math.min(100, x)));

    const saturation = positionRef.current.x / 100;
    const value = 1 - (positionRef.current.y / 100);

    const color = hsvToRgb(newHue, saturation, value);
    setSelectedColor(color);
    setHexInput(color);
    onColorSelectRef.current?.(color);
  }, []);

  const handleRainbowMouseDown = (e: React.MouseEvent) => {
    setIsDraggingRainbow(true);
    updateRainbowPosition(e.clientX);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserInteractingRef.current = true;
    const value = e.target.value;
    setHexInput(value);

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setSelectedColor(value);
      onColorSelectRef.current?.(value);
    }
  };

  const handleClearColor = () => {
    isUserInteractingRef.current = true;
    setSelectedColor('');
    setHexInput('');
    onColorSelectRef.current?.('');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingGradient) {
        updateGradientPosition(e.clientX, e.clientY);
      }
      if (isDraggingRainbow) {
        updateRainbowPosition(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingGradient(false);
      setIsDraggingRainbow(false);
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 50);
    };

    if (isDraggingGradient || isDraggingRainbow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingGradient, isDraggingRainbow, updateGradientPosition, updateRainbowPosition]);

  const prevInitialColorRef = useRef(initialColor);
  useEffect(() => {
    if (!isUserInteractingRef.current && prevInitialColorRef.current !== initialColor) {
      setSelectedColor(initialColor);
      setHexInput(initialColor);
      prevInitialColorRef.current = initialColor;
    }
  }, [initialColor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 280;
    const dropdownHeight = 320;

    let left = buttonRect.left + (buttonRect.width / 2) - (dropdownWidth / 2);
    let top = buttonRect.bottom + 8;

    if (left < 10) {
      left = 10;
    }

    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }

    if (top + dropdownHeight > window.innerHeight - 10) {
      top = buttonRect.top - dropdownHeight - 8;
    }

    setDropdownPosition({ top, left });
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const dropdownContent = isOpen && mounted ? (
    <div
      ref={pickerRef}
      className={styles.colorPicker__dropdown}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`
      }}
    >

      <div
        ref={gradientRef}
        className={styles.colorPicker__gradient}
        onMouseDown={handleGradientMouseDown}
        style={{
          background: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%),
            linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%),
            hsl(${hue}, 100%, 50%)
          `
        }}
      >

        <div
          className={styles.colorPicker__selector}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      <div
        ref={rainbowRef}
        className={styles.colorPicker__rainbow}
        onMouseDown={handleRainbowMouseDown}
      >
        <div
          className={styles.colorPicker__hueIndicator}
          style={{
            left: `${huePosition}%`
          }}
        />
      </div>

      <div className={styles.colorPicker__input}>
        <select className={styles.colorPicker__format}>
          <option value="hex">HEX</option>
        </select>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          className={styles.colorPicker__hex}
          placeholder="#COLOR5"
        />
      </div>

      <button
        type="button"
        onClick={handleClearColor}
        className={styles.colorPicker__clearButton}
      >
        Clear color
      </button>
    </div>
  ) : null;

  return (
    <>
      <div className={`${styles.colorPicker} ${isThin ? styles['colorPicker--thin'] : ''} ${className}`}>
        <button
          ref={buttonRef}
          type="button"
          className={styles.colorPicker__button}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
          }}
        >
          {selectedColor ? (
            <div
              className={styles.colorPicker__colorCircle}
              style={{ backgroundColor: selectedColor }}
            />
          ) : (
            <PaletteIcon />
          )}
        </button>
      </div>

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}
