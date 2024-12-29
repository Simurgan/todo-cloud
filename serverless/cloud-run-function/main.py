# This code sends email to specified address using google cloud functions

import os
import base64
import logging
from email.mime.text import MIMEText
import functions_framework
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

# app.run(port=int(os.environ.get("PORT", 8080)),host='0.0.0.0',debug=True)

def refresh_credentials(credentials):
    try:
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
    except Exception as e:
        logging.error(f"Failed to refresh credentials: {e}")
        raise

@functions_framework.http
def send_email(request):
    logging.info("Received request to send email.")

    # Load OAuth 2.0 credentials from environment variables
    token_info = {
        "token": os.getenv("ACCESS_TOKEN"),
        "refresh_token": os.getenv("REFRESH_TOKEN"),
        "client_id": os.getenv("CLIENT_ID"),
        "client_secret": os.getenv("CLIENT_SECRET"),
        "token_uri": os.getenv("TOKEN_URI"),
    }

    credentials = Credentials(
        token=token_info['token'],
        refresh_token=token_info['refresh_token'],
        token_uri=token_info['token_uri'],
        client_id=token_info['client_id'],
        client_secret=token_info['client_secret']
    )

    refresh_credentials(credentials)
    logging.info("Credentials refreshed successfully.")

    # Build the Gmail service
    try:
        service = build('gmail', 'v1', credentials=credentials)
        logging.info("Gmail service built successfully.")
    except Exception as e:
        logging.error(f"Failed to build Gmail service: {e}")
        return f"Failed to build Gmail service: {e}", 500

    # Hard-coded email content
    from_email = '<sender-email>'
    to_email = '<receiver-email>'
    subject = "Cloud email test"
    body = "This is a test email sent from Google Cloud Function."

    # Create the email
    message = MIMEText(body)
    message['to'] = to_email
    message['from'] = from_email
    message['subject'] = subject

    # Encode the message
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

    # Send the email
    try:
        message_body = {'raw': raw}
        message = service.users().messages().send(userId=to_email, body=message_body).execute()
        logging.info(f"Email sent successfully: Message Id: {message['id']}")
        return f"Email sent successfully: {message['id']}", 200
    except Exception as error:
        logging.error(f"An error occurred: {error}")
        return f"An error occurred: {error}", 500
