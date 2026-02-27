import React, { useState } from "react";
import { X, Mail, CheckCircle2, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NewsItem } from "../types";
import { sendNewsletter } from "../services/emailService";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem[];
}

export function EmailModal({ isOpen, onClose, news }: EmailModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim();
      if (email.includes("@") && !recipients.includes(email)) {
        setRecipients([...recipients, email]);
        setEmailInput("");
      } else if (!email.includes("@")) {
        setError("Please enter a valid email address.");
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setRecipients(recipients.filter(email => email !== emailToRemove));
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      setError("Please add at least one recipient.");
      return;
    }

    setIsSending(true);
    setError("");
    setSuccessMessage("");

    try {
      await sendNewsletter(news, recipients);
      setSuccessMessage(`Successfully sent to ${recipients.length} recipients!`);
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
        setRecipients([]);
      }, 3000);
    } catch (err) {
      setError("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--color-brand-green)]" />
              Send Newsletter
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {successMessage ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-[var(--color-brand-green)] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sent Successfully!</h3>
                <p className="text-gray-500">{successMessage}</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients (Press Enter to add)
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleAddEmail}
                    placeholder="investor@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent text-sm"
                  />
                  
                  {recipients.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recipients.map(email => (
                        <span key={email} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {email}
                          <button onClick={() => handleRemoveEmail(email)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSend}
                    disabled={isSending || recipients.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-brand-black)] text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send to {recipients.length} Recipients
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
