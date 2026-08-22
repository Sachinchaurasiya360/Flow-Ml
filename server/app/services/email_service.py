"""
Email service using Brevo API.
Handles OTP verification, welcome emails, and marketing campaigns.
"""

import brevo_python
from brevo_python.rest import ApiException
from app.core.config import settings
from app.core.logging import logger
from typing import Optional


class EmailService:
    """Email service using Brevo REST API."""

    def __init__(self):
        """Initialize Brevo API configuration."""
        if not settings.BREVO_API_KEY:
            logger.warning("BREVO_API_KEY not configured. Email sending will fail.")
            self.api_instance = None
        else:
            configuration = brevo_python.Configuration()
            configuration.api_key['api-key'] = settings.BREVO_API_KEY
            self.api_instance = brevo_python.TransactionalEmailsApi(
                brevo_python.ApiClient(configuration)
            )
        
        self.sender_email = settings.BREVO_SENDER_EMAIL
        self.sender_name = settings.BREVO_SENDER_NAME

    def _send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
    ) -> bool:
        """
        Send email using Brevo API.
        
        Args:
            to_email: Recipient email
            to_name: Recipient name
            subject: Email subject
            html_content: HTML email content
            
        Returns:
            bool: True if sent successfully
        """
        if not self.api_instance:
            logger.error("Brevo API not configured. Check BREVO_API_KEY in .env")
            return False
            
        try:
            logger.info(f"Preparing to send email to {to_email}")
            logger.info(f"Subject: {subject}")
            
            send_smtp_email = brevo_python.SendSmtpEmail(
                to=[{"email": to_email, "name": to_name}],
                sender={"name": self.sender_name, "email": self.sender_email},
                subject=subject,
                html_content=html_content
            )
            
            logger.info(f"Sending email via Brevo API...")
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            
            logger.info(f"Email sent successfully to {to_email}")
            logger.info(f"Message ID: {api_response.message_id}")
            
            return True

        except ApiException as e:
            logger.error(f"Brevo API error sending email to {to_email}")
            logger.error(f"Status: {e.status}, Reason: {e.reason}")
            if e.body:
                logger.error(f"Body: {e.body}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending email to {to_email}: {e}")
            logger.exception("Full traceback:")
            return False

    def send_verification_otp(self, email: str, name: str, otp: str) -> bool:
        """
        Send OTP verification email.
        
        Args:
            email: User email
            name: User name
            otp: 6-digit OTP code
            
        Returns:
            bool: True if sent successfully
        """
        logger.info(f"Sending OTP verification email to {email}")
        logger.info(f"OTP Code: {otp}")
        
        subject = "Verify your Flow ML account"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .otp-box {{ background: white; border: 2px dashed #667eea; padding: 20px; 
                           text-align: center; margin: 20px 0; border-radius: 8px; }}
                .otp-code {{ font-size: 32px; font-weight: bold; color: #667eea; 
                            letter-spacing: 8px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Flow ML!</h1>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>Thank you for signing up! Please verify your email address using the code below:</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0; font-size: 14px; color: #666;">Your verification code</p>
                        <p class="otp-code">{otp}</p>
                    </div>
                    
                    <p><strong>This code will expire in 10 minutes.</strong></p>
                    <p>If you didn't create an account with Flow ML, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Flow ML. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        result = self._send_email(email, name, subject, html_content)
        if result:
            logger.info(f"OTP email sent successfully to {email}")
        else:
            logger.error(f"Failed to send OTP email to {email}")
        return result

    def send_welcome_email(self, email: str, name: str) -> bool:
        """
        Send welcome email after successful verification.
        
        Args:
            email: User email
            name: User name
            
        Returns:
            bool: True if sent successfully
        """
        logger.info(f"Sending welcome email to {email}")
        
        subject = "Welcome to Flow ML!"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .feature {{ background: white; padding: 15px; margin: 10px 0; border-radius: 8px; 
                           border-left: 4px solid #667eea; }}
                .cta-button {{ display: inline-block; background: #667eea; color: white; 
                              padding: 15px 30px; text-decoration: none; border-radius: 8px; 
                              margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Flow ML!</h1>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>Your account has been successfully verified! You're now ready to start building amazing ML pipelines.</p>
                    
                    <h3>What you can do with Flow ML:</h3>
                    
                    <div class="feature">
                        <strong>Visual Pipeline Builder</strong><br>
                        Create ML pipelines with an intuitive drag-and-drop interface
                    </div>
                    
                    <div class="feature">
                        <strong>Multiple Algorithms</strong><br>
                        Choose from Linear Regression, Logistic Regression, and more
                    </div>
                    
                    <div class="feature">
                        <strong>Save & Resume</strong><br>
                        Your projects are automatically saved and synced
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{settings.FRONTEND_URL}/dashboard" class="cta-button">
                            Get Started Now
                        </a>
                    </div>
                    
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Happy building!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Flow ML. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        result = self._send_email(email, name, subject, html_content)
        if result:
            logger.info(f"Welcome email sent successfully to {email}")
        else:
            logger.error(f"Failed to send welcome email to {email}")
        return result

    def send_experience_survey(self, email: str, name: str) -> bool:
        """
        Send experience survey email (10 days after signup).
        
        Args:
            email: User email
            name: User name
            
        Returns:
            bool: True if sent successfully
        """
        logger.info(f"Sending experience survey to {email}")
        
        subject = "How's your Flow ML experience?"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .cta-button {{ display: inline-block; background: #667eea; color: white; 
                              padding: 15px 30px; text-decoration: none; border-radius: 8px; 
                              margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>We'd love your feedback!</h1>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>You've been using Flow ML for 10 days now! We hope you're enjoying the experience.</p>
                    
                    <p>We'd really appreciate it if you could take 2 minutes to share your thoughts with us. 
                    Your feedback helps us make Flow ML better for everyone.</p>
                    
                    <div style="text-align: center;">
                        <a href="#feedback" class="cta-button">
                            Share Your Feedback
                        </a>
                    </div>
                    
                    <p>As a thank you, we'll give you <strong>1 month of Premium access</strong> for free!</p>
                    
                    <p>Thank you for being part of our community!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Flow ML. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        result = self._send_email(email, name, subject, html_content)
        if result:
            logger.info(f"Survey email sent successfully to {email}")
        else:
            logger.error(f"Failed to send survey email to {email}")
        return result

    def send_password_reset_email(self, email: str, name: str, reset_token: str) -> bool:
        """
        Send password reset email with reset link.
        
        Args:
            email: User email
            name: User name
            reset_token: Password reset token
            
        Returns:
            bool: True if sent successfully
        """
        logger.info(f"Sending password reset email to {email}")
        
        # Create reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        subject = "Reset your Flow ML password"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .reset-box {{ background: white; border: 2px solid #667eea; padding: 20px; 
                             text-align: center; margin: 20px 0; border-radius: 8px; }}
                .cta-button {{ display: inline-block; background: #667eea; color: white; 
                              padding: 15px 30px; text-decoration: none; border-radius: 8px; 
                              margin: 20px 0; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; 
                           margin: 20px 0; border-radius: 4px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi {name},</p>
                    <p>We received a request to reset your Flow ML password. Click the button below to create a new password:</p>
                    
                    <div class="reset-box">
                        <a href="{reset_link}" class="cta-button">
                            Reset Password
                        </a>
                    </div>
                    
                    <p><strong>This link will expire in {settings.RESET_TOKEN_EXPIRE_MINUTES} minutes.</strong></p>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong><br>
                        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                    </div>
                    
                    <p style="font-size: 12px; color: #666; margin-top: 20px;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="{reset_link}" style="color: #667eea; word-break: break-all;">{reset_link}</a>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Flow ML. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        result = self._send_email(email, name, subject, html_content)
        if result:
            logger.info(f"Password reset email sent successfully to {email}")
        else:
            logger.error(f"Failed to send password reset email to {email}")
        return result

    def send_marketing_email(
        self,
        email: str,
        name: str,
        subject: str,
        content: str
    ) -> bool:
        """
        Send marketing/promotional email.
        
        Args:
            email: User email
            name: User name
            subject: Email subject
            content: HTML email content
            
        Returns:
            bool: True if sent successfully
        """
        logger.info(f"Sending marketing email to {email}")
        result = self._send_email(email, name, subject, content)
        if result:
            logger.info(f"Marketing email sent successfully to {email}")
        else:
            logger.error(f"Failed to send marketing email to {email}")
        return result


# Singleton instance
email_service = EmailService()
