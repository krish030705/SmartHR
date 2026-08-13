import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmDialog({
  open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-soft">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:bg-black/5">
          Cancel
        </button>
        <Button onClick={onConfirm} loading={loading} accent="#C4463A" className="w-auto px-4">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}