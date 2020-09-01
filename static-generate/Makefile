.PHONY: all test clean static
help:
	@ echo "generate p=XXX; deploy p=XXX;"
generate:
	node app.js $(p)
static:
	gulp static
	cd static && hs
deploy:
	rsync --exclude .DS_Store --exclude .tmp --exclude .idea --exclude .git --exclude node_modules -crzvF -e "ssh -p 22" ../deploy/   ubuntu@zh.xinshangshangxin.com:/home/ubuntu/production/static
push:
	git push origin master
test:
	@ if [ -n "$(g)" ]; \
	then \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test; \
	else \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail test; \
	fi
pushStatic:
	cd ./static && git add -A && git commit -m "auto" && git push origin master:gh-pages -f;