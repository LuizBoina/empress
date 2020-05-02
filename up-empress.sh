#!/bin/bash
a="Script para abrir uma IDE (Intellij, Code ou nenhuma) rodar o backend, frontend, mobile e emulador android da aplicacao Empress"
b='Passe a flag "-i" para abrir o web no Intellij'
c='Passe a flag "-I" para abrir o mobile no Intellij'
d='Passe a flag "-c" para abrir o web no Code'
e='Passe a flag "-C" para abrir o mobile no Code'
f='Passe a flag "-w" para rodar o web'
g='Passe a flag "-m" para rodar o mobile'
h='Passe a flag "-a" para abrir o emulador android'
i='Passe a flag "-h" para obter ajuda'

RUN_WEB=false
RUN_IDE=""
RUN_MOBILE=false
RUN_AVD=false
SHOW_HELP=false
while getopts ":iIcCwmah" opt; do
  case $opt in
	a) RUN_AVD=true;;
	c) RUN_IDE="CODE_WEB";;
	C) RUN_IDE="CODE_MOBILE";;
	i) RUN_IDE="INTELLIJ_WEB";;
	I) RUN_IDE="INTELLIJ_MOBILE";;
	m) RUN_MOBILE=true;;
    w) RUN_WEB=true;;
    \?)
      echo "Opcao invalida: -$OPTARG" >&2
      exit 1
      ;;
	h)
	  echo -e "$a\n$b\n$c\n$d\n$e\n$f\n$g\n$h\n$i" >&2
      exit 1
      ;;
  esac
done

if [ RUN_WEB ]; then
	gnome-terminal --tab --working-directory=/home/boina/empress -- docker-compose up
fi

if [ RUN_MOBILE ]; then
	gnome-terminal --tab --working-directory=/home/boina/empress-mobile -- npm start
fi

if [ RUN_AVD ]; then
	gnome-terminal --tab -- /home/boina/Android/Sdk/emulator/emulator -avd Nexus_5_API_26_Empress
fi

case $RUN_IDE in
	CODE_WEB) code /home/boina/empress ;;
	CODE_MOBILE) code /home/boina/empress-mobile ;;
	INTELLIJ_WEB) idea.sh /home/boina/empress ;;
	INTELLIJ_MOBILE) idea.sh /home/boina/empress-mobile ;;
esac