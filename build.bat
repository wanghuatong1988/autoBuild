@echo off
rem 用做查找每一次命令返回的状态 默认为0 出错状态为1
%errorlevel% 

rem 初始化项目
color 0A

rem echo 当前盘符：%~d0
rem echo 当前盘符和路径：%~dp0single
rem echo 当前盘符和路径的短文件名格式：%~sdp0
rem echo 当前批处理全路径：%~f0
rem echo 当前CMD默认目录：%cd%

echo '---------------------------------'

:restUrl
rem 加上这行不然if里面的变量会找不到
SETLOCAL ENABLEDELAYEDEXPANSION
set /p url=请输入项目存放路径：
if not exist %url% ( 
echo %url%不存在 
set /p url=提示：回退[b] 退出[o]：
rem 这里不能用%%号了改成!!号
if /i !url!==b ( call :restUrl ) else ( exit)
)

:restProject
set /p name=请输入项目名:
if exist %url%\%name% (
echo %name%已存在
set /p name=提示：重新输入请按[r]：
if /i !name!==r ( call :restProject ) else ( exit)
)

mkdir %url%\%name%
echo 已新建目录：%url%\%name%

:loop
set /p a=请选择项目类型? (单页[1]，多页[2])：
if /i '%a%'=='1' goto start1
if /i '%a%'=='2' goto start2
echo 输入有误，请重新输入 &&goto loop 
 
:start1
echo 'start build....'%url%\%name%
xcopy /s/e/h %~dp0share %url%\%name%
xcopy /s/e/h %~dp0single\src %url%\%name%\src
xcopy /s/e/h %~dp0single\build %url%\%name%\build
xcopy %~dp0single %url%\%name%
cd %url%\%name%
echo '正在安装依赖包...'
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
echo '正在安装依赖包...'
call cnpm install
call cnpm run dev
pause

@exit





