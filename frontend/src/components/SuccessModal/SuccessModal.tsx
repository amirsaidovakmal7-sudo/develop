import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from '../../i18n';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  status: 'success' | 'error' | null;
  onClose: () => void;
}

/** Shared success/error state for the order form (TECH_TASK_REDISIGN.md п.27). */
export function SuccessModal({ status, onClose }: SuccessModalProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          className={styles.backdrop}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.card}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`${styles.icon} ${status === 'success' ? styles.success : styles.error}`}>
              {status === 'success' ? '✓' : '✕'}
            </div>
            <div className={styles.title}>{status === 'success' ? t.form.successTitle : t.form.errorTitle}</div>
            <p className={styles.text}>{status === 'success' ? t.form.successText : t.form.errorText}</p>
            <button type="button" className={styles.close} onClick={onClose}>
              {status === 'success' ? t.form.successClose : t.form.errorClose}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
