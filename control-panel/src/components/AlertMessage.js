import React from 'react';
import { Alert } from 'react-bootstrap';

const AlertMessage = ({ variant, error, show, onClose }) => {
    if (!show) return null;

    const errorCode = error?.code;
    const errorMessage = error?.message;

    return (
        <Alert variant={variant} onClose={onClose} dismissible>
            {errorCode && <strong>Error Code: {errorCode}</strong>}
            <p>{errorMessage}</p>
        </Alert>
    );
};

export default AlertMessage;
