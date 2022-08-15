import styles from 'styles/components/MessageRight.module.css'

interface MessageRightProps{
    message: string,
    timestamp: string
}

export const MessageRight = ({message, timestamp}: MessageRightProps) => {
    return(
        <div className={styles.messageRow}>
            <div className={styles.messageContainer}>
                <p className={styles.messageContent}>{message}</p>
                <div className={styles.messageTimeStampRight}>{timestamp}</div>
            </div>
        </div>
    );
}