npm run build
zip dist.zip -r dist
rm -rf ../construction/dist.ide/*
mv dist.zip ../construction/dist.ide
cd ../construction/dist.ide && git pull && unzip dist.zip && cd dist && mv * ../ && cd ../ && rm -rf dist.zip && rm -rf dist && git add . && git commit -a -m 'constrution' && git push -u origin master
