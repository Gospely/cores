echo "please enter commit info："

read msg

git add .
git commit -a -m "$msg"

git pull

git push -u origin master
