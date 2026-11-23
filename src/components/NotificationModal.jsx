
function NotificationModal({
    title,
    message,
    type = 'info',
    onConfirm,
    onCancel,
    confirmText = 'Continue',
    cancelText = 'Maybe Later'
}) {
    const isDanger = type === 'danger'

    return (
        <div
            className="notification-overlay"
            role="presentation"
        >
            <div
                className="notification-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="notification-title"
            >
                <div className={`notification-icon ${isDanger ? 'danger' : 'info'}`}>
                    {isDanger ? '⚠️' : '🔔'}
                </div>

                <h4 id="notification-title" className="fw-bold">
                    {title}
                </h4>

                <p className="text-secondary mb-4">
                    {message}
                </p>

                <div className="d-flex gap-2">
                    {onCancel && (
                        <button
                            className="btn btn-outline-secondary flex-fill"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}

                    <button
                        className={`btn flex-fill ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationModal
