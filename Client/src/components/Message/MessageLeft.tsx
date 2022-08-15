import styles from 'styles/components/MessageLeft.module.css'

interface MessageLeftProps{
    message: string,
    timestamp: string,
    displayName: string
}

export const MessageLeft = ({ message, timestamp, displayName}:MessageLeftProps) => {
    return(
        <div className={styles.messageRow}>
            <div className={styles.displayName}>{displayName}</div>
            <div className={styles.messageContainer}>
                <p className={styles.messageContent}>{message}</p>
                <div className={styles.messageTimeStampRight}>{timestamp}</div>
            </div>
        </div>
    );
}