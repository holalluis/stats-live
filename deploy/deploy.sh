#!/bin/bash

#git
git add *
git commit -am 'update'

#desplega al servidor
# -h  human readable format
# -P  mostra progrés
# -vv incrementa verbositat
# -r  actua recursivament
rsync -hPvr . root@164.132.111.240:/var/www/html/stats-live
