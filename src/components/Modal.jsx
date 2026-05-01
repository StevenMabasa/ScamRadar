import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-cyber-line bg-cyber-panel p-5 shadow-glow">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <Button aria-label="Close modal" icon={X} onClick={onClose} size="sm" variant="ghost" />
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
