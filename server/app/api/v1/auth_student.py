"""
Authentication API endpoints for students .
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.models.user import Student, Admin
from app.schemas.auth import (
    StudentRegister,
    StudentLogin,
    StudentGoogleAuth,
    VerifyEmailRequest,
    ResendOTPRequest,
    AdminLogin,
    AdminRegister,
    StudentResponse,
    AdminResponse,
    StudentUpdate,
    ChangePassword,
    ForgotPassword,
    ResetPassword,
    StudentListItem,
    AdminUpdateStudent,
)
from app.services import auth_service
from app.core.security import (
    get_current_student,
    get_current_admin,
    set_auth_cookies,
    clear_auth_cookies,
    decode_token,
)
from app.core.logging import logger
from app.core.redis_cache import redis_cache
from app.services.s3_service import s3_service
from app.core.config import settings


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ========== Student Registration & Login ==========


@router.post("/student/register", status_code=status.HTTP_201_CREATED)
async def register_student(data: StudentRegister, request: Request, db: Session = Depends(get_db)):
    """
    Register a new student with email and password.
    Sends OTP to email for verification.

    - **emailId**: Unique email address
    - **password**: Min 8 chars with uppercase, lowercase, digit
    - **fullName**: compulsory full name
    - **collegeOrSchool**: Optional college/school name
    - **contactNo**: Optional contact number

    Returns message to check email for OTP.
    """
    student = auth_service.register_student(db, data)

    return {
        "message": "Registration successful! Please check your email for the OTP to verify your account.",
        "emailId": student.emailId,
    }


@router.post("/student/login")
async def login_student(
    data: StudentLogin, request: Request, response: Response, db: Session = Depends(get_db)
):
    """
    Login student with email and password.
    Sets HTTP-only cookies for authentication.

    Returns user data only (tokens in cookies).
    """
    device_info = request.headers.get("User-Agent")
    ip_address = request.client.host if request.client else None

    student, access_token, refresh_token = await auth_service.login_student(
        db, data, device_info, ip_address
    )

    # Set HTTP-only cookies
    set_auth_cookies(response, access_token, refresh_token)

    return {"user": StudentResponse.model_validate(student), "message": "Login successful"}


@router.post("/student/google")
async def google_auth_student(
    data: StudentGoogleAuth, request: Request, response: Response, db: Session = Depends(get_db)
):
    """
    Authenticate student with Google OAuth.
    Creates new account if doesn't exist.
    Sets HTTP-only cookies for authentication.

    - **idToken**: Google ID token from frontend (Google Sign-In)
    - **profilePic**: Optional profile picture URL

    Returns user data only (tokens in cookies).
    """
    device_info = request.headers.get("User-Agent")
    ip_address = request.client.host if request.client else None

    student, access_token, refresh_token = await auth_service.google_auth_student(
        db, data, device_info, ip_address
    )

    # Set HTTP-only cookies
    set_auth_cookies(response, access_token, refresh_token)

    return {
        "user": StudentResponse.model_validate(student),
        "message": "Google authentication successful",
    }


@router.post("/verify-email")
async def verify_email(data: VerifyEmailRequest, response: Response, db: Session = Depends(get_db)):
    """
    Verify student email with OTP code.
    Sets HTTP-only cookies for authentication.

    - **emailId**: Student email
    - **otp**: 6-digit OTP code from email

    Returns user data only (tokens in cookies).
    """
    from app.services.otp_service import verify_email_otp

    student, access_token, refresh_token = await verify_email_otp(db, data.emailId, data.otp)

    # Set HTTP-only cookies
    set_auth_cookies(response, access_token, refresh_token)

    return {
        "user": StudentResponse.model_validate(student),
        "message": "Email verified successfully! Welcome to Visual ML.",
    }


@router.post("/resend-otp")
async def resend_otp(data: ResendOTPRequest, db: Session = Depends(get_db)):
    """
    Resend OTP verification email.

    - **emailId**: Student email

    Returns success message.
    """
    from app.services.otp_service import resend_verification_otp

    resend_verification_otp(db, data.emailId)

    return {"message": "New OTP sent to your email. Please check your inbox."}


# ========== Admin Login ==========


@router.post("/admin/register", status_code=status.HTTP_201_CREATED)
async def register_admin(
    data: AdminRegister, request: Request, response: Response, db: Session = Depends(get_db)
):
    """
    Register a new admin account.
    Sets HTTP-only cookies for authentication.

    - **email**: Unique admin email
    - **password**: Min 8 chars with uppercase, lowercase, digit
    - **name**: Optional admin name

    Returns user data only (tokens in cookies).
    """
    admin, access_token, refresh_token = await auth_service.register_admin(db, data)

    # Set HTTP-only cookies
    set_auth_cookies(response, access_token, refresh_token)

    return {"user": AdminResponse.model_validate(admin), "message": "Admin registered successfully"}


@router.post("/admin/login")
async def login_admin(
    data: AdminLogin, request: Request, response: Response, db: Session = Depends(get_db)
):
    """
    Login admin with email and password.
    Sets HTTP-only cookies for authentication.

    Returns user data only (tokens in cookies).
    """
    device_info = request.headers.get("User-Agent")
    ip_address = request.client.host if request.client else None

    admin, access_token, refresh_token = await auth_service.login_admin(
        db, data, device_info, ip_address
    )

    # Set HTTP-only cookies
    set_auth_cookies(response, access_token, refresh_token)

    return {"user": AdminResponse.model_validate(admin), "message": "Admin login successful"}


# ========== Token Management ==========


@router.post("/refresh")
async def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token from cookie.
    Implements token rotation - old refresh token is revoked.

    Returns success message (new tokens in cookies).
    """
    # Get refresh token from cookie
    refresh_token_str = request.cookies.get("refresh_token")
    if not refresh_token_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found in cookies"
        )

    device_info = request.headers.get("User-Agent")
    ip_address = request.client.host if request.client else None

    # Refresh tokens
    access_token, new_refresh_token = await auth_service.refresh_access_token(
        db, refresh_token_str, device_info, ip_address
    )

    # Set new cookies
    set_auth_cookies(response, access_token, new_refresh_token)

    return {"message": "Token refreshed successfully"}


@router.post("/logout")
async def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    """
    Logout user by revoking refresh token and clearing cookies.
    Invalidates Redis cache and all sessions.
    """
    # Get tokens from cookies
    access_token = request.cookies.get("access_token")
    refresh_token_str = request.cookies.get("refresh_token")

    # Get user ID from access token for cache invalidation
    user_id = None
    if access_token:
        try:
            payload = decode_token(access_token)
            user_id = int(payload.get("sub"))
        except:
            pass

    # Revoke refresh token and clear cache
    if refresh_token_str and user_id:
        await auth_service.logout_user(db, refresh_token_str, user_id)

    # Clear cookies
    clear_auth_cookies(response)

    return {"message": "Logged out successfully"}


# ========== Student Profile Management ==========


@router.get("/student/me", response_model=StudentResponse)
async def get_student_profile(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """
    Get current student profile.
    Requires valid access token.
    """
    # Fetch full student from database to get all fields including authProvider and createdAt
    db_student = db.query(Student).filter(Student.id == student.id).first()
    if not db_student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    return StudentResponse.model_validate(db_student)


@router.patch("/student/me", response_model=StudentResponse)
async def update_student_profile(
    data: StudentUpdate,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """
    Update current student profile.
    Cannot change emailId (it's the unique identifier).

    - **collegeOrSchool**: College or school name
    - **contactNo**: Contact number
    - **recentProject**: Recent project description
    - **profilePic**: Profile picture URL
    """
    # Fetch full student from database
    db_student = db.query(Student).filter(Student.id == student.id).first()
    if not db_student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    # Update fields
    if data.collegeOrSchool is not None:
        db_student.collegeOrSchool = data.collegeOrSchool
    if data.contactNo is not None:
        db_student.contactNo = data.contactNo
    if data.recentProject is not None:
        db_student.recentProject = data.recentProject
    if data.profilePic is not None:
        db_student.profilePic = data.profilePic

    db.commit()
    db.refresh(db_student)

    # ✅ Invalidate cache to reflect changes immediately
    await redis_cache.delete_user(db_student.id)

    logger.info(f"Student profile updated: {db_student.emailId}")

    return StudentResponse.model_validate(db_student)


@router.post("/student/upload-profile-pic")
async def upload_profile_picture(
    file: UploadFile = File(..., description="Profile picture to upload"),
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """
    Upload a profile picture to S3 and update student profile.

    Supported formats: JPG, JPEG, PNG, GIF, WEBP
    Max file size: 5MB

    **Authentication Required - JWT from HTTP-only cookies**
    """
    logger.info(f"📸 Profile picture upload request - User: {student.id} ({student.emailId})")
    logger.info(f"📄 File: {file.filename}, Content-Type: {file.content_type}")

    try:
        # Read file content
        file_content = await file.read()
        file_size_mb = len(file_content) / (1024 * 1024)

        logger.info(
            f"✅ File content read - Size: {len(file_content)} bytes ({file_size_mb:.2f} MB)"
        )

        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
            )

        # Validate file size (max 5MB)
        if file_size_mb > 5:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large ({file_size_mb:.2f}MB). Maximum size is 5MB",
            )

        # Validate filename
        filename = file.filename or "profile.jpg"
        file_ext = filename.split(".")[-1].lower()
        if file_ext not in ["jpg", "jpeg", "png", "gif", "webp"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file extension. Allowed: jpg, jpeg, png, gif, webp",
            )

        # Generate unique S3 key
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        s3_key = f"profile-pictures/{student.id}/{timestamp}.{file_ext}"

        logger.info(f"📦 Uploading to S3 - Key: {s3_key}")

        # Upload to S3
        s3_url = await s3_service.upload_file(
            file_content=file_content,
            s3_key=s3_key,
            content_type=file.content_type or "image/jpeg",
            metadata={
                "student_id": str(student.id),
                "email": student.emailId,
                "upload_timestamp": timestamp,
            },
        )

        logger.info(f"✅ File uploaded to S3 - URL: {s3_url}")

        # Generate public URL using presigned URL (7 days)
        # For production, consider making profile pictures publicly accessible
        # or using CloudFront with proper cache settings
        public_url = await s3_service.get_presigned_url(s3_key, expiry=604800)  # 7 days

        # Update student profile with new picture URL
        db_student = db.query(Student).filter(Student.id == student.id).first()
        if not db_student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

        # Delete old profile picture from S3 if exists
        old_pic = db_student.profilePic
        if old_pic is not None and old_pic.startswith("https://"):
            try:
                # Extract S3 key from old URL if it's an S3 URL
                if "profile-pictures/" in old_pic:
                    old_key = old_pic.split("profile-pictures/")[1].split("?")[0]
                    old_key = f"profile-pictures/{old_key}"
                    logger.info(f"🗑️ Deleting old profile picture - Key: {old_key}")
                    await s3_service.delete_file(old_key)
            except Exception as e:
                logger.warning(f"Failed to delete old profile picture: {str(e)}")

        db_student.profilePic = public_url
        db.commit()

        # Invalidate cache
        await redis_cache.delete_user(db_student.id)

        logger.info(f"✅ Profile picture updated for student {student.emailId}")

        return {
            "success": True,
            "message": "Profile picture uploaded successfully",
            "profilePicUrl": public_url,
            "s3Key": s3_key,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile picture upload failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload profile picture: {str(e)}",
        )


@router.post("/student/change-password")
async def change_password(
    data: ChangePassword,
    response: Response,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """
    Change student password.
    Only for students with LOCAL authentication.
    Revokes all refresh tokens and clears cookies for security.
    """
    # Fetch full student from database
    db_student = db.query(Student).filter(Student.id == student.id).first()
    if not db_student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    await auth_service.change_password(db, db_student, data.oldPassword, data.newPassword)

    # Clear cookies (user must login again)
    clear_auth_cookies(response)

    return {"message": "Password changed successfully. Please login again."}


@router.post("/student/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    """
    Initiate password reset.
    Sends reset token (in production, via email).

    Returns success message even if email doesn't exist (security).
    """
    reset_token = auth_service.initiate_password_reset(db, data.emailId)

    # In production, send email here and don't return token
    # For development, return token
    return {
        "message": "If email exists, reset link has been sent",
        "resetToken": reset_token,  # Remove in production!
    }


@router.post("/student/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    """
    Reset password using reset token.
    Revokes all refresh tokens for security.
    """
    auth_service.reset_password(db, data.token, data.newPassword)


# ========== Admin Profile & Student Management ==========


@router.get("/admin/me", response_model=AdminResponse)
async def get_admin_profile(admin: Admin = Depends(get_current_admin)):
    """
    Get current admin profile.
    Requires admin access token.
    """
    return AdminResponse.model_validate(admin)


@router.get("/admin/students", response_model=List[StudentListItem])
async def list_students(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    isPremium: bool = None,
    isActive: bool = None,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    List all students (admin only).

    Query parameters:
    - **skip**: Pagination offset (default: 0)
    - **limit**: Max results (default: 100)
    - **search**: Search by name, email, or college
    - **isPremium**: Filter by premium status
    - **isActive**: Filter by active status
    """
    # Create cache key based on filters
    cache_key = f"students:list:{skip}:{limit}:{search}:{isPremium}:{isActive}"
    cached = await redis_cache.get(cache_key)
    if cached:
        logger.debug("Returning cached students list")
        return cached

    query = db.query(Student)

    # Apply filters
    if search:
        query = query.filter(
            (Student.fullName.ilike(f"%{search}%"))
            | (Student.emailId.ilike(f"%{search}%"))
            | (Student.collegeOrSchool.ilike(f"%{search}%"))
        )

    if isPremium is not None:
        query = query.filter(Student.isPremium == isPremium)

    if isActive is not None:
        query = query.filter(Student.isActive == isActive)

    # Pagination
    students = query.offset(skip).limit(limit).all()

    result = [StudentListItem.model_validate(s) for s in students]

    # Cache for 5 minutes
    await redis_cache.set(cache_key, result, ttl=300)

    return result


@router.get("/admin/students/{student_id}", response_model=StudentResponse)
async def get_student_detail(
    student_id: int, admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)
):
    """
    Get student details by ID (admin only).
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    return StudentResponse.model_validate(student)


@router.patch("/admin/students/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    data: AdminUpdateStudent,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Update student (admin only).
    Can modify isPremium and isActive status.

    - **isPremium**: Grant/revoke premium access
    - **isActive**: Activate/deactivate account
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    # Update fields
    if data.isPremium is not None:
        student.isPremium = data.isPremium
        logger.info(
            f"Admin {admin.email} updated student {student.emailId} premium status: {data.isPremium}"
        )

    if data.isActive is not None:
        student.isActive = data.isActive
        logger.info(
            f"Admin {admin.email} updated student {student.emailId} active status: {data.isActive}"
        )

        # If deactivating, revoke all refresh tokens
        if not data.isActive:
            from app.models.user import RefreshToken

            db.query(RefreshToken).filter(RefreshToken.studentId == student.id).update(
                {"isRevoked": True}
            )

    db.commit()
    db.refresh(student)

    # ✅ Invalidate cache to reflect admin changes immediately
    await redis_cache.delete_user(student.id)

    # If deactivated, also clear all sessions
    if data.isActive is not None and not data.isActive:
        await redis_cache.delete_all_user_sessions(student.id)

    return StudentResponse.model_validate(student)


# ========== Development Utils (UNSECURED) ==========


@router.delete("/dev/student/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def dev_delete_student(student_id: int, db: Session = Depends(get_db)):
    """
    [DEV ONLY] Delete a student by ID.
    No authentication required.
    Deletes user and clears cache.
    """
    logger.warning(f"DEV: Deleting student {student_id}")

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    # Clear cache first
    await redis_cache.delete_user(student_id)
    await redis_cache.delete_all_user_sessions(student_id)

    # Delete from DB
    db.delete(student)
    db.commit()

    return None
