package org.mupro.nshakira.exception;

public class EmailSendingException extends RuntimeException{
    public EmailSendingException(String message){
        super(message);
    }
}
