@echo off
rem ��������ÿһ������ص�״̬ Ĭ��Ϊ0 ����״̬Ϊ1
%errorlevel% 

rem ��ʼ����Ŀ
color 0A

rem echo ��ǰ�̷���%~d0
rem echo ��ǰ�̷���·����%~dp0single
rem echo ��ǰ�̷���·���Ķ��ļ�����ʽ��%~sdp0
rem echo ��ǰ������ȫ·����%~f0
rem echo ��ǰCMDĬ��Ŀ¼��%cd%

echo '---------------------------------'

:restUrl
rem �������в�Ȼif����ı������Ҳ���
SETLOCAL ENABLEDELAYEDEXPANSION
set /p url=��������Ŀ���·����
if not exist %url% ( 
echo %url%������ 
set /p url=��ʾ������[b] �˳�[o]��
rem ���ﲻ����%%���˸ĳ�!!��
if /i !url!==b ( call :restUrl ) else ( exit)
)

:restProject
set /p name=��������Ŀ��:
if exist %url%\%name% (
echo %name%�Ѵ���
set /p name=��ʾ�����������밴[r]��
if /i !name!==r ( call :restProject ) else ( exit)
)

mkdir %url%\%name%
echo ���½�Ŀ¼��%url%\%name%

:loop
set /p a=��ѡ����Ŀ����? (��ҳ[1]����ҳ[2])��
if /i '%a%'=='1' goto start1
if /i '%a%'=='2' goto start2
echo ������������������ &&goto loop 
 
:start1
echo 'start build....'%url%\%name%
xcopy /s/e/h %~dp0share %url%\%name%
xcopy /s/e/h %~dp0single\src %url%\%name%\src
xcopy /s/e/h %~dp0single\build %url%\%name%\build
xcopy %~dp0single %url%\%name%
cd %url%\%name%
echo '���ڰ�װ������...'
call cnpm install
call cnpm run dev
pause

:start2
echo 'start build....'%url%\%name%
xcopy /s/e/h %~dp0share %url%\%name%
xcopy /s/e/h %~dp0many\src %url%\%name%\src
xcopy /s/e/h %~dp0many\build %url%\%name%\build
xcopy %~dp0many %url%\%name%
cd %url%\%name%
echo '���ڰ�װ������...'
call cnpm install
call cnpm run dev
pause

@exit





