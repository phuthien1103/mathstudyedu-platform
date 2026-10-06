@echo off
chcp 65001 > nul
title Khoi dong OpenEdu LMS

echo ======================================================
echo    DANG KHOI CHAY HE THONG OPENEDU LMS...
echo ======================================================

:: 1. Chuyen vao thu muc goc de bat Docker PostgreSQL
cd /d D:\WEBSITE
echo [1/3] Dang khoi dong Database PostgreSQL (Docker)...
docker compose up -d

:: Cho 3 giay de Database on dinh
timeout /t 3 /nobreak > nul

:: 2. Mo cua so rieng de chay Server Backend
echo [2/3] Dang khoi dong Backend Server (Port 5000)...
start "OpenEdu - Backend Server" cmd /k "cd /d D:\WEBSITE\backend && npm run dev"

:: 3. Mo cua so rieng de chay Prisma Studio
echo [3/3] Dang khoi dong Prisma Studio (Port 5555)...
start "OpenEdu - Prisma Studio" cmd /k "cd /d D:\WEBSITE\backend && npx prisma studio"

echo ======================================================
echo    DA KHOI DONG THANH CONG CAC DICH VU!
echo    - Backend API : http://localhost:5000
echo    - Prisma Studio: http://localhost:5555
echo ======================================================
pause